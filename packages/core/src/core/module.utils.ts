/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Provider } from "../di/provider.interface";
import { Container, isCustomProvider, isTypeProvider, Scope, type Type } from "../di";
import { INJECTABLE_METADATA, MODULE_METADATA } from "../decorators/constants";
import { getLifecycleManager } from "../lifecycle/lifecycle-manager";

export interface DynamicModule {
  module: Type;
  providers?: Provider[];
  global?: boolean;
}

/**
 * Extracts module class from dynamic module or returns the module itself.
 */
export function getModuleClass(importedModule: any): Type {
  return importedModule.module?.prototype?.constructor || importedModule.module || importedModule;
}

/**
 * Checks if value is a dynamic module (e.g. CacheModule.forRoot()).
 */
export function isDynamicModule(importedModule: any): importedModule is DynamicModule {
  return (
    typeof importedModule === "object" &&
    importedModule !== null &&
    "module" in importedModule &&
    typeof importedModule.module === "function"
  );
}

/**
 * Checks if value is a decorated module class.
 */
export function isDecoratedModule(importedModule: any): importedModule is Type {
  return (
    typeof importedModule === "function" && Reflect.getMetadata(MODULE_METADATA, importedModule)
  );
}

/**
 * Extracts provider token and scope from a provider definition.
 */
export function extractProviderInfo(provider: any): {
  token: any;
  scope: Scope;
} {
  if (isTypeProvider(provider)) {
    const meta = Reflect.getMetadata(INJECTABLE_METADATA, provider);
    return { token: provider, scope: meta?.scope ?? Scope.SINGLETON };
  }
  if (isCustomProvider(provider)) {
    return {
      token: provider.provide,
      scope: provider.scope ?? Scope.SINGLETON,
    };
  }
  return { token: null, scope: Scope.SINGLETON };
}

/**
 * Eagerly resolves all singleton providers and controllers across all registered
 * modules.  Any missing-provider, unresolvable-dependency, or circular-dependency
 * error will propagate immediately so the application fails fast at bootstrap.
 */
export async function initializeSingletonProviders(): Promise<void> {
  const container = Container.instance;
  const processedTokens = new Set<unknown>();
  const instances: unknown[] = [];

  // First pass: eagerly load all provider and controller instances
  for (const moduleRef of container.getModules().values()) {
    // Providers
    for (const [token, wrapper] of moduleRef.getProviders()) {
      if (processedTokens.has(token)) {
        continue;
      }

      // `useValue` providers have no metatype and are already resolved eagerly
      // (their instance is set at registration time). We must NOT `container.get`
      // a valueless wrapper, but we DO want to run their lifecycle hooks, so pick
      // up the pre-set instance directly. `useExisting` aliases also have no
      // metatype but a null instance, so they are skipped here (their target
      // provider gets its own lifecycle). Instance-level guards below ensure
      // nothing double-fires.
      if (!wrapper.metatype) {
        const eager = wrapper.instance;
        if (eager !== null && typeof eager === "object") {
          processedTokens.add(token);
          instances.push(eager);
        }
        continue;
      }
      processedTokens.add(token);

      // Let DI errors propagate — they are caught by createElysiaApplication
      const instance = await container.get(token);
      if (instance) {
        instances.push(instance);
      }
    }

    // Controllers — must also be resolved eagerly
    for (const [token, wrapper] of moduleRef.getControllers()) {
      if (processedTokens.has(token) || !wrapper.metatype) {
        continue;
      }
      processedTokens.add(token);
      await container.get(token);
    }
  }

  // Second pass: call onModuleInit after all providers are loaded, and register
  // EVERY provider with the lifecycle manager so the remaining hooks
  // (onApplicationBootstrap, onModuleDestroy, beforeApplicationShutdown,
  // onApplicationShutdown) fire even when a provider does not also implement
  // onModuleInit.
  for (const instance of instances) {
    if (
      typeof (instance as any).onModuleInit === "function" &&
      !(instance as any).__onModuleInitCalled
    ) {
      await (instance as any).onModuleInit();
      (instance as any).__onModuleInitCalled = true;
    }

    if (!(instance as any).__lifecycleRegistered) {
      (instance as any).__lifecycleRegistered = true;
      getLifecycleManager().register(instance);
    }
  }
}
