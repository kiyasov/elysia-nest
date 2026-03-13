import "reflect-metadata";

import { type ContextId, STATIC_CONTEXT } from "./constants";
import type { Container } from "./container";
import { INJECT_METADATA } from "./injectable.decorator";
import type { InstanceWrapper } from "./instance-wrapper";
import type { Module } from "./module";
import { ModuleRef } from "./module-ref";
import type { ProviderToken, Type } from "./provider.interface";
import { isForwardRef } from "./provider.interface";

export class Injector {
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
      const paramTypes: (Type | undefined)[] =
        Reflect.getMetadata("design:paramtypes", metatype) || [];

      const dependencies: unknown[] = [];
      const injectionMetadata: Array<{ index: number; token: unknown }> =
        Reflect.getMetadata(INJECT_METADATA, metatype) || [];

      for (let i = 0; i < paramTypes.length; i++) {
        const paramType = paramTypes[i];
        const customInjection = injectionMetadata.find(
          (meta) => meta.index === i,
        );
        const token = customInjection
          ? customInjection.token
          : (paramType as ProviderToken);

        if (token === undefined) {
          throw new Error(
            `Cannot resolve dependency at index ${i} in ${wrapper.name.toString()}. ` +
              `Make sure it's properly decorated with @Inject() or is a class.`,
          );
        }

        const resolvedToken = isForwardRef(token) ? token.forwardRef() : token;

        const dep = await this.resolveDependency(
          resolvedToken as ProviderToken,
          moduleRef,
          contextId,
        );
        dependencies.push(dep);
      }

      return dependencies;
    }

    // Factory provider with inject array
    const inject = wrapper.inject || [];
    const dependencies: unknown[] = [];

    for (const tokenOrConfig of inject) {
      let token: ProviderToken;
      if (
        typeof tokenOrConfig === "object" &&
        tokenOrConfig !== null &&
        "token" in tokenOrConfig
      ) {
        token = tokenOrConfig.token as ProviderToken;
      } else {
        token = tokenOrConfig as ProviderToken;
      }

      const resolvedToken = isForwardRef(token) ? token.forwardRef() : token;

      const dep = await this.resolveDependency(
        resolvedToken as ProviderToken,
        moduleRef,
        contextId,
      );
      dependencies.push(dep);
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
        `Provider ${typeof token === "function" ? token.name : String(token)} not found in module ${moduleRef.name}`,
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
}
