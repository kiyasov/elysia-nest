import { Module } from "nestelia";
import type { ModuleOptions } from "nestelia";
import {
  Container,
  type Provider,
  type ProviderToken,
  STATIC_CONTEXT,
} from "nestelia";
import { Injector } from "nestelia";
import { Logger } from "nestelia";
import type { Module as ModuleType } from "../../core/src/di/module";
import type { Type } from "nestelia";
import type { OverridesMetadata } from "./interfaces/overrides-metadata.interface";

/**
 * Override builder for replacing providers in testing module
 */
class OverrideByBuilder<T = unknown> {
  constructor(
    private readonly _builder: TestingModuleBuilder,
    private readonly _token: ProviderToken,
  ) {}

  /**
   * Override provider with a value
   */
  useValue(value: T): TestingModuleBuilder {
    this._builder.addOverride({
      token: this._token,
      type: "value",
      value,
    });
    return this._builder;
  }

  /**
   * Override provider with a class
   */
  useClass<M>(metatype: Type<M>): TestingModuleBuilder {
    this._builder.addOverride({
      token: this._token,
      type: "class",
      metatype,
    });
    return this._builder;
  }

  /**
   * Override provider with a factory
   */
  useFactory(
    factory: (...args: unknown[]) => T,
    inject?: ProviderToken[],
  ): TestingModuleBuilder {
    this._builder.addOverride({
      token: this._token,
      type: "factory",
      factory,
      inject,
    });
    return this._builder;
  }
}

/**
 * Builder for creating and configuring testing modules.
 *
 * @example
 * ```typescript
 * const moduleRef = await Test.createTestingModule({
 *   imports: [AppModule],
 *   providers: [MyService],
 * })
 *   .overrideProvider(DatabaseService)
 *   .useValue(mockDb)
 *   .compile();
 *
 * const service = moduleRef.get(MyService);
 * ```
 */
export class TestingModuleBuilder {
  private readonly _metadata: ModuleOptions;
  private readonly _overrides: OverridesMetadata[] = [];

  constructor(metadata: ModuleOptions) {
    this._metadata = {
      providers: [],
      imports: [],
      exports: [],
      controllers: [],
      middlewares: [],
      ...metadata,
    };
  }

  /**
   * Add provider override
   * @internal
   */
  addOverride(override: OverridesMetadata): void {
    this._overrides.push(override);
  }

  /**
   * Override a provider with mock/stub
   */
  overrideProvider<T>(token: ProviderToken): OverrideByBuilder<T> {
    return new OverrideByBuilder<T>(this, token);
  }

  /**
   * Override a class provider
   */
  overrideClass<T>(token: Type<T>): OverrideByBuilder<T> {
    return new OverrideByBuilder<T>(this, token);
  }

  /**
   * Compile the testing module and initialize all providers.
   *
   * Each call creates a fully isolated DI container so that unit tests
   * never interfere with each other or with integration tests that share
   * the global Container.instance.
   */
  async compile(): Promise<TestingModule> {
    // Each compile() gets its own isolated container — no global state is touched.
    const testContainer = Container.create();

    // Create a dynamic testing module
    @Module(this._metadata)
    class TestingModuleClass {}

    // Register the module in the isolated container
    const moduleRef = testContainer.addModule(
      TestingModuleClass,
      TestingModuleClass.name,
    );

    // Process imports first
    if (this._metadata.imports) {
      for (const importedModule of this._metadata.imports) {
        await this.processImport(importedModule, moduleRef, testContainer);
      }
    }

    // Register providers with overrides applied
    const providers = this.getProvidersWithOverrides();
    for (const provider of providers) {
      moduleRef.addProvider(provider);
    }

    // Register controllers
    if (this._metadata.controllers) {
      for (const controller of this._metadata.controllers) {
        moduleRef.addController(controller);
      }
    }

    // Initialize singleton providers and collect their resolved instances.
    const instances = await this.initializeSingletons(moduleRef, testContainer);

    // Fire onModuleInit on every provider that implements it, awaiting each so
    // async initialization (opening DB/Redis/RabbitMQ connections, wiring up
    // workers in QueueExplorer, etc.) fully settles before compile() resolves.
    // Without this, providers that self-wire in onModuleInit would silently
    // never initialize under Test.createTestingModule.
    for (const instance of instances) {
      if (!instance || typeof instance !== "object") {
        continue;
      }
      const hook = (instance as { onModuleInit?: () => unknown }).onModuleInit;
      if (typeof hook === "function") {
        await hook.call(instance);
      }
    }

    return new TestingModule(moduleRef, testContainer, instances);
  }

  /**
   * Get providers with overrides applied
   */
  private getProvidersWithOverrides(): Provider[] {
    const baseProviders = this._metadata.providers || [];
    const overriddenProviders: Provider[] = [];

    for (const provider of baseProviders) {
      const token =
        typeof provider === "function" ? provider : provider.provide;
      const override = this._overrides.find((o) => o.token === token);

      if (override) {
        overriddenProviders.push(
          this.createOverriddenProvider(token, override),
        );
      } else {
        overriddenProviders.push(provider);
      }
    }

    // Add override providers that weren't in original providers
    for (const override of this._overrides) {
      const exists = baseProviders.some((p) => {
        const pToken = typeof p === "function" ? p : p.provide;
        return pToken === override.token;
      });

      if (!exists) {
        overriddenProviders.push(
          this.createOverriddenProvider(override.token, override),
        );
      }
    }

    return overriddenProviders;
  }

  /**
   * Create provider from override metadata
   */
  private createOverriddenProvider(
    token: ProviderToken,
    override: OverridesMetadata,
  ): Provider {
    switch (override.type) {
      case "value":
        return {
          provide: token,
          useValue: override.value,
        };
      case "class":
        return {
          provide: token,
          useClass: override.metatype!,
        };
      case "factory":
        return {
          provide: token,
          useFactory: override.factory!,
          inject: override.inject || [],
        };
      default:
        throw new Error(
          `Unknown override type: ${(override as OverridesMetadata).type}`,
        );
    }
  }

  /**
   * Process imported modules
   */
  private async processImport(
    importedModule: Type | { module: Type },
    targetModule: ModuleType,
    testContainer: Container,
  ): Promise<void> {
    const moduleClass =
      typeof importedModule === "function"
        ? importedModule
        : importedModule.module;

    const importedRef = testContainer.addModule(
      moduleClass,
      moduleClass.name || "imported-module",
    );

    targetModule.addImport(importedRef);
  }

  /**
   * Initialize all singleton providers and return their resolved instances.
   *
   * The returned list is used to drive lifecycle hooks (onModuleInit on
   * compile, the destroy hooks on close). It includes useValue providers,
   * which are pre-resolved but may still implement lifecycle hooks, and
   * excludes alias providers, which delegate to their target.
   */
  private async initializeSingletons(
    moduleRef: ModuleType,
    testContainer: Container,
  ): Promise<unknown[]> {
    const injector = new Injector(testContainer);
    const instances: unknown[] = [];

    for (const [token, wrapper] of moduleRef.getProviders()) {
      // Aliases (useExisting) resolve to another provider — skip them.
      if (wrapper.isAlias) {
        continue;
      }

      const instancePerContext = wrapper.getInstanceByContextId(STATIC_CONTEXT);

      if (!instancePerContext.isResolved) {
        // useValue providers have no metatype but are already resolved above.
        if (!wrapper.metatype) {
          continue;
        }

        try {
          await injector.loadInstance(wrapper, moduleRef, STATIC_CONTEXT);
        } catch (e) {
          const tokenName =
            typeof token === "function" ? token.name : String(token);
          Logger.error(
            `Failed to initialize provider ${tokenName}: ${
              e instanceof Error ? e.stack ?? e.message : String(e)
            }`,
            "TestingModule",
          );
          continue;
        }
      }

      const resolved = wrapper.getInstanceByContextId(STATIC_CONTEXT);
      if (resolved.isResolved && resolved.instance != null) {
        instances.push(resolved.instance);
      }
    }

    return instances;
  }
}

/**
 * Compiled testing module with methods to access providers
 */
export class TestingModule {
  constructor(
    private readonly _module: ModuleType,
    private readonly _container: Container,
    /**
     * Resolved provider instances collected during compile(), in registration
     * order. Used to drive the destroy lifecycle hooks on close().
     */
    private _instances: unknown[] = [],
  ) {}

  /**
   * Get a provider instance from the module.
   * Synchronous - returns already resolved instance.
   */
  get<T>(token: ProviderToken): T {
    const tokenName = typeof token === "function" ? token.name : String(token);

    // Search in current module and imports
    let wrapper = this._module.getProviderByKey<T>(token);

    // Then check imported modules
    if (!wrapper) {
      for (const importedModule of this._module.imports) {
        wrapper = importedModule.getProviderByKey<T>(token);
        if (wrapper) {
          break;
        }
      }
    }

    if (!wrapper) {
      throw new Error(
        `Provider "${tokenName}" not found in module or its imports`,
      );
    }

    const instancePerContext = wrapper.getInstanceByContextId(STATIC_CONTEXT);

    if (!instancePerContext.isResolved) {
      throw new Error(`Provider "${tokenName}" is not resolved yet`);
    }

    return instancePerContext.instance as T;
  }

  /**
   * Resolve a provider instance (async, for request-scoped providers)
   */
  async resolve<T>(token: ProviderToken): Promise<T> {
    const instance = await this._container.get<T>(token, this._module.metatype);

    if (!instance) {
      throw new Error(
        `Provider "${typeof token === "function" ? token.name : String(token)}" not found or could not be resolved`,
      );
    }

    return instance;
  }

  /**
   * Check if provider exists in module
   */
  has(token: ProviderToken): boolean {
    try {
      const wrapper = this._module.getProviderByKey(token);
      return !!wrapper;
    } catch {
      return false;
    }
  }

  /**
   * Get the module reference
   */
  get module(): ModuleType {
    return this._module;
  }

  /**
   * Get the container instance
   */
  get container(): Container {
    return this._container;
  }

  /**
   * Clean up the testing module, firing destroy lifecycle hooks and releasing
   * the resources this module owns.
   *
   * Fires the destroy hooks in NestJS order — onModuleDestroy →
   * beforeApplicationShutdown → onApplicationShutdown — over every collected
   * provider instance, awaiting each so async cleanup (closing DB/Redis/
   * RabbitMQ connections, draining workers) settles before close() resolves.
   * Runs best-effort: a throwing hook is logged and never prevents the
   * remaining hooks from running.
   *
   * Note: this intentionally does NOT call `Container.clear()`. That method
   * wipes PROCESS-GLOBAL singletons — the lifecycle manager, the global
   * exception filters, the global event emitter and the schema cache — which
   * are shared with real applications booted via createElysiaApplication and
   * with other tests. Clearing them here would silently destroy an unrelated
   * running app's lifecycle registrations / filters / listeners.
   *
   * The isolated test container created in compile() is not registered in any
   * global registry, so once this TestingModule is dropped it becomes eligible
   * for garbage collection on its own. Container exposes no instance-scoped
   * clear (adding one would require a core change, which is out of scope), so
   * we clear only the state we own here: the collected instance list.
   */
  async close(): Promise<void> {
    const hookOrder = [
      "onModuleDestroy",
      "beforeApplicationShutdown",
      "onApplicationShutdown",
    ] as const;

    for (const hookName of hookOrder) {
      for (const instance of this._instances) {
        if (!instance || typeof instance !== "object") {
          continue;
        }
        const hook = (instance as Record<string, unknown>)[hookName];
        if (typeof hook !== "function") {
          continue;
        }
        try {
          await (hook as () => unknown).call(instance);
        } catch (error) {
          Logger.error(
            `Error in ${hookName} hook: ${
              error instanceof Error ? error.stack ?? error.message : String(error)
            }`,
            "TestingModule",
          );
        }
      }
    }

    this._instances = [];
  }
}
