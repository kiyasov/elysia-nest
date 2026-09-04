
import { type ContextId, STATIC_CONTEXT } from "./constants";
import type { Container } from "./container";
import { INJECT_METADATA, INJECTABLE_SOURCE, OPTIONAL_METADATA } from "./injectable.decorator";
import type { InstanceWrapper } from "./instance-wrapper";
import type { Module } from "./module";
import { ModuleRef } from "./module-ref";
import type { ProviderToken, Type } from "./provider.interface";
import { isForwardRef } from "./provider.interface";
import { createClassMetadataCache } from "../utils/metadata-cache";

/**
 * Error thrown when the DI container cannot resolve a dependency.
 */
export class DIError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "DIError";
  }
}

const paramTypesCache = createClassMetadataCache<(Type | undefined)[]>();
const injectMetadataCache = createClassMetadataCache<Array<{ index: number; token: unknown }>>();
const optionalMetadataCache = createClassMetadataCache<number[]>();

export class Injector {
  private readonly _resolutionChain: InstanceWrapper[] = [];

  constructor(private readonly container: Container) {}

  public async loadInstance(
    wrapper: InstanceWrapper,
    moduleRef: Module,
    contextId: ContextId = STATIC_CONTEXT,
  ): Promise<void> {
    // Skip alias providers - they don't need instantiation
    if (wrapper.isAlias) {
      return;
    }

    const instancePerContext = wrapper.getInstanceByContextId(contextId);
    if (instancePerContext.isResolved) {
      return;
    }

    // Circular dependency detection
    const cycleStart = this._resolutionChain.indexOf(wrapper);
    if (cycleStart !== -1) {
      const cycle = this._resolutionChain
        .slice(cycleStart)
        .map((w) => this.formatTokenName(w.token));
      cycle.push(this.formatTokenName(wrapper.token));
      throw new DIError(
        `DI Error: Circular dependency detected:\n  ${cycle.join(" → ")}`,
      );
    }

    this._resolutionChain.push(wrapper);
    try {
      // Resolve constructor dependencies
      const dependencies = await this.resolveConstructorParams(
        wrapper,
        moduleRef,
        contextId,
      );

      // Create instance
      const instance = await this.instantiateClass(wrapper, dependencies);

      // Store instance
      instancePerContext.instance = instance;
      instancePerContext.isResolved = true;
      wrapper.setInstanceByContextId(contextId, instancePerContext);
    } finally {
      this._resolutionChain.pop();
    }
  }

  public async loadPrototype(
    wrapper: InstanceWrapper,
    contextId: ContextId = STATIC_CONTEXT,
  ): Promise<void> {
    const prototype = wrapper.createPrototype(contextId);
    if (prototype) {
      const instancePerContext = wrapper.getInstanceByContextId(contextId);
      instancePerContext.instance = prototype as unknown;
      wrapper.setInstanceByContextId(contextId, instancePerContext);
    }
  }

  private async resolveConstructorParams(
    wrapper: InstanceWrapper,
    moduleRef: Module,
    contextId: ContextId,
  ): Promise<unknown[]> {
    const metatype = wrapper.metatype as Type | null;
    if (!metatype) {
      return [];
    }
    if (!wrapper.inject) {
      // Standard class with design:paramtypes
      const paramTypes = paramTypesCache.get(metatype, () =>
        Reflect.getMetadata("design:paramtypes", metatype) || [],
      );

      const dependencies: unknown[] = [];
      const injectionMetadata = injectMetadataCache.get(metatype, () =>
        Reflect.getMetadata(INJECT_METADATA, metatype) || [],
      );
      const optionalParams = optionalMetadataCache.get(metatype, () =>
        Reflect.getMetadata(OPTIONAL_METADATA, metatype) || [],
      );

      const injectionByIndex = new Map<number, unknown>();
      for (const { index, token } of injectionMetadata) {
        injectionByIndex.set(index, token);
      }
      const optionalSet = new Set(optionalParams);
      const explicitParamCount = Math.max(
        ...injectionMetadata.map(({ index }) => index + 1),
        ...optionalParams.map((index) => index + 1),
        0,
      );
      const paramCount = Math.max(paramTypes.length, explicitParamCount);

      for (let i = 0; i < paramCount; i++) {
        const paramType = paramTypes[i];
        const token = injectionByIndex.has(i)
          ? injectionByIndex.get(i)
          : (paramType as ProviderToken);
        const isOptional = optionalSet.has(i);

        if (token === undefined) {
          if (isOptional) {
            dependencies.push(undefined);
            continue;
          }
          throw this.createResolutionError(
            wrapper,
            i,
            "undefined",
            moduleRef,
            metatype,
          );
        }

        const resolvedToken = isForwardRef(token) ? token.forwardRef() : token;

        try {
          const dep = await this.resolveDependency(
            resolvedToken as ProviderToken,
            moduleRef,
            contextId,
          );
          dependencies.push(dep);
        } catch (e) {
          if (isOptional) {
            dependencies.push(undefined);
          } else if (e instanceof DIError) {
            throw e;
          } else {
            const tokenName = this.formatTokenName(
              resolvedToken as ProviderToken,
            );
            throw this.createResolutionError(
              wrapper,
              i,
              tokenName,
              moduleRef,
              metatype,
              e as Error,
            );
          }
        }
      }

      return dependencies;
    }

    // Factory provider with inject array
    const inject = wrapper.inject || [];
    const dependencies: unknown[] = [];

    for (let i = 0; i < inject.length; i++) {
      const tokenOrConfig = inject[i];
      let token: ProviderToken;
      let isOptional = false;
      if (
        typeof tokenOrConfig === "object" &&
        tokenOrConfig !== null &&
        "token" in tokenOrConfig
      ) {
        token = tokenOrConfig.token as ProviderToken;
        isOptional = !!(tokenOrConfig as { optional?: boolean }).optional;
      } else {
        token = tokenOrConfig as ProviderToken;
      }

      const resolvedToken = isForwardRef(token) ? token.forwardRef() : token;

      try {
        const dep = await this.resolveDependency(
          resolvedToken as ProviderToken,
          moduleRef,
          contextId,
        );
        dependencies.push(dep);
      } catch (e) {
        if (isOptional) {
          dependencies.push(undefined);
        } else if (e instanceof DIError) {
          throw e;
        } else {
          const tokenName = this.formatTokenName(
            resolvedToken as ProviderToken,
          );
          throw this.createResolutionError(
            wrapper,
            i,
            tokenName,
            moduleRef,
            metatype,
            e as Error,
          );
        }
      }
    }

    return dependencies;
  }

  private async resolveDependency(
    token: ProviderToken,
    moduleRef: Module,
    contextId: ContextId,
  ): Promise<unknown> {
    // Special handling for ModuleRef - create it on the fly
    if (token === ModuleRef) {
      return new ModuleRef(this.container, moduleRef);
    }

    // First check in current module
    let wrapper = moduleRef.getProviderByKey(token);

    // Then check in imports
    if (!wrapper) {
      for (const importedModule of moduleRef.imports) {
        wrapper = importedModule.getProviderByKey(token);
        if (wrapper) {
          break;
        }
      }
    }

    // Finally check all global modules
    if (!wrapper) {
      for (const globalModule of this.container.getGlobalModules()) {
        wrapper = globalModule.getProviderByKey(token);
        if (wrapper) {
          break;
        }
      }
    }

    if (!wrapper) {
      throw new Error(
        `Provider ${this.formatTokenName(token)} not found in module ${moduleRef.name}`,
      );
    }

    // If this is an alias provider, resolve the aliased token instead
    if (wrapper.isAlias && wrapper.aliasTarget) {
      return this.resolveDependency(wrapper.aliasTarget, moduleRef, contextId);
    }

    // Ensure instance is loaded in the module that owns the wrapper
    await this.loadInstance(wrapper, wrapper.host ?? moduleRef, contextId);

    const instancePerContext = wrapper.getInstanceByContextId(contextId);
    return instancePerContext.instance;
  }

  private async instantiateClass(
    wrapper: InstanceWrapper,
    dependencies: unknown[],
  ): Promise<unknown> {
    const { metatype } = wrapper;

    if (!metatype) {
      throw new Error(
        `Cannot instantiate provider ${wrapper.name.toString()}: no metatype`,
      );
    }

    // Factory provider
    if (wrapper.isFactory) {
      const factoryFn = metatype as (...args: unknown[]) => unknown;
      const result = factoryFn(...dependencies);
      return result instanceof Promise ? await result : result;
    }

    // Class provider
    const ClassConstructor = metatype as Type;
    return new ClassConstructor(...dependencies);
  }

  private formatTokenName(token: ProviderToken): string {
    if (typeof token === "function") return token.name;
    if (typeof token === "symbol") return token.toString();
    return String(token);
  }

  private getSourceLocation(
    metatype: Type | Function,
  ): string | undefined {
    const stack: string | undefined = Reflect.getMetadata(
      INJECTABLE_SOURCE,
      metatype,
    );
    if (!stack) return undefined;
    const lines = stack.split("\n");
    // Skip the Error line and frames within elysia-nest/packages/core internals
    for (const line of lines.slice(1)) {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("at ") &&
        !trimmed.includes("/packages/core/") &&
        !trimmed.includes("node_modules")
      ) {
        const match =
          trimmed.match(/\((.+)\)$/) || trimmed.match(/at\s+(.+)$/);
        if (match) return match[1].trim();
      }
    }
    return undefined;
  }

  private createResolutionError(
    wrapper: InstanceWrapper,
    paramIndex: number,
    dependencyName: string,
    moduleRef: Module,
    metatype: Type | Function,
    cause?: Error,
  ): DIError {
    const wrapperName = this.formatTokenName(wrapper.token);
    const source = this.getSourceLocation(metatype);
    const sourceInfo = source
      ? `  at ${wrapperName} constructor (${source})`
      : `  at ${wrapperName} constructor`;

    const message =
      `DI Error: Cannot resolve dependency "${wrapperName}" ` +
      `(parameter ${paramIndex}: ${dependencyName})\n` +
      `  in module ${moduleRef.name}\n` +
      sourceInfo;

    return new DIError(message, cause ? { cause } : undefined);
  }
}
