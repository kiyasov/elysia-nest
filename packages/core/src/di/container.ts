import { AsyncLocalStorage } from "node:async_hooks";

import type { ContextId } from "./constants";
import { STATIC_CONTEXT } from "./constants";
import { Injector } from "./injector";
import type { InstanceWrapper } from "./instance-wrapper";
import { Module } from "./module";
import type { Provider, ProviderToken, Type } from "./provider.interface";

// Request context for backward compatibility
export interface RequestContext {
  id: string | symbol;
  container?: Map<ProviderToken, unknown>;
}

const requestAsyncStorage = new AsyncLocalStorage<RequestContext>();

export class Container {
  private static _instance: Container;
  private readonly _modules = new Map<string, Module>();
  private readonly _globalModules = new Set<Module>();
  private readonly _injector: Injector;
  // Cache for O(1) module lookup by metatype
  private readonly _moduleByMetatype = new Map<Type, Module>();
  // Tracks modules initialized within the current createElysiaApplication session
  private _sessionInitialized = new Set<Type>();

  private constructor() {
    this._injector = new Injector(this);
  }

  public static get instance(): Container {
    if (!Container._instance) {
      Container._instance = new Container();
    }
    return Container._instance;
  }

  public addModule(metatype: Type, token: string): Module {
    // Check if module already exists by token
    if (this._modules.has(token)) {
      return this._modules.get(token)!;
    }

    // Check if module already exists by metatype (using cache)
    const existingByMetatype = this._moduleByMetatype.get(metatype);
    if (existingByMetatype) {
      return existingByMetatype;
    }

    const moduleRef = new Module(metatype, this);
    moduleRef.token = token;
    this._modules.set(token, moduleRef);
    this._moduleByMetatype.set(metatype, moduleRef);

    // Bind global modules to the new module
    this.bindGlobalsToImports(moduleRef);

    return moduleRef;
  }

  public getModules(): Map<string, Module> {
    return this._modules;
  }

  public getModuleByKey(key: string): Module | undefined {
    return this._modules.get(key);
  }

  public addGlobalModule(module: Module): void {
    this._globalModules.add(module);
  }

  public getGlobalModules(): Set<Module> {
    return this._globalModules;
  }

  public bindGlobalScope(): void {
    this._modules.forEach((moduleRef) => {
      this.bindGlobalsToImports(moduleRef);
    });
  }

  public bindGlobalsToImports(moduleRef: Module): void {
    this._globalModules.forEach((globalModule) => {
      this.bindGlobalModuleToModule(moduleRef, globalModule);
    });
  }

  public bindGlobalModuleToModule(target: Module, globalModule: Module): void {
    if (target === globalModule) {
      return;
    }
    target.addImport(globalModule);
  }

  public async get<T>(token: Type<T>, moduleKey?: Type, contextId?: ContextId): Promise<T | undefined>;
  public async get<T>(token: ProviderToken, moduleKey?: Type, contextId?: ContextId): Promise<T | undefined>;
  public async get<T>(
    token: ProviderToken,
    moduleKey?: Type,
    contextId: ContextId = STATIC_CONTEXT,
  ): Promise<T | undefined> {
    // Auto-use request context when available and contextId is STATIC_CONTEXT
    if (contextId === STATIC_CONTEXT) {
      const requestCtx = Container.getRequestContext();
      if (requestCtx) {
        contextId = requestCtx as ContextId;
      }
    }

    // Helper to load and return instance
    const loadAndReturn = async (
      wrapper: InstanceWrapper<T>,
      moduleRef: Module,
    ): Promise<T | undefined> => {
      // If this is an alias, resolve the target instead
      if (wrapper.isAlias && wrapper.aliasTarget) {
        return this.get<T>(wrapper.aliasTarget, moduleKey, contextId);
      }

      // For transient providers, always create a fresh instance
      if (wrapper.isTransient) {
        const transientCtx: ContextId = { id: Symbol("transient") };
        await this._injector.loadInstance(wrapper, moduleRef, transientCtx);
        const resolved = wrapper.getInstanceByContextId(transientCtx);
        return resolved.instance as T;
      }

      const instancePerContext = wrapper.getInstanceByContextId(contextId);
      if (instancePerContext.isResolved) {
        return instancePerContext.instance as T;
      }
      await this._injector.loadInstance(wrapper, moduleRef, contextId);
      const resolved = wrapper.getInstanceByContextId(contextId);
      return resolved.instance as T;
    };

    // If moduleKey provided, search in that module first using cache (O(1))
    if (moduleKey) {
      const moduleRef = this._moduleByMetatype.get(moduleKey);
      if (moduleRef) {
        // Try providers first
        let wrapper = moduleRef.getProviderByKey<T>(token);
        if (wrapper) {
          return loadAndReturn(wrapper, moduleRef);
        }
        // Try controllers
        wrapper = moduleRef.getControllerByKey<T>(token);
        if (wrapper) {
          return loadAndReturn(wrapper, moduleRef);
        }
      }
    }

    // Search in all modules
    for (const moduleRef of this._modules.values()) {
      // Try providers first
      let wrapper = moduleRef.getProviderByKey<T>(token);
      if (wrapper) {
        return loadAndReturn(wrapper, moduleRef);
      }
      // Try controllers
      wrapper = moduleRef.getControllerByKey<T>(token);
      if (wrapper) {
        return loadAndReturn(wrapper, moduleRef);
      }
    }
    return undefined;
  }

  public async getFromModule<T>(
    token: ProviderToken,
    moduleKey: string,
    contextId: ContextId = STATIC_CONTEXT,
  ): Promise<T | undefined> {
    const moduleRef = this._modules.get(moduleKey);
    if (!moduleRef) {
      return undefined;
    }

    const wrapper = moduleRef.getProviderByKey<T>(token);
    if (!wrapper) {
      return undefined;
    }

    // If this is an alias, resolve the target instead
    if (wrapper.isAlias && wrapper.aliasTarget) {
      return this.get<T>(wrapper.aliasTarget, undefined, contextId);
    }

    const instancePerContext = wrapper.getInstanceByContextId(contextId);
    if (instancePerContext.isResolved) {
      return instancePerContext.instance as T;
    }

    await this._injector.loadInstance(wrapper, moduleRef, contextId);
    const resolved = wrapper.getInstanceByContextId(contextId);
    return resolved.instance as T;
  }

  public clear(): void {
    this._modules.clear();
    this._globalModules.clear();
    this._moduleByMetatype.clear();
    this._sessionInitialized.clear();
  }

  public beginInitSession(): void {
    this._sessionInitialized.clear();
  }

  public isInitializedInSession(metatype: Type): boolean {
    return this._sessionInitialized.has(metatype);
  }

  public markInitializedInSession(metatype: Type): void {
    this._sessionInitialized.add(metatype);
  }

  // Backward compatibility methods
  public registerControllers(controllers: Type[], moduleKey?: Type): void {
    // Find or create module for this key using cache (O(1))
    let moduleRef: Module | undefined;

    if (moduleKey) {
      moduleRef = this._moduleByMetatype.get(moduleKey);
    }

    // If no module found, use first module or create default
    let targetModule = moduleRef;
    if (!targetModule) {
      if (this._modules.size === 0) {
        // Create a default module
        const DefaultModule = class DefaultModule {};
        targetModule = this.addModule(DefaultModule as Type, "default");
      } else {
        targetModule = this._modules.values().next().value;
      }
    }

    // Register controllers
    for (const controller of controllers) {
      targetModule!.addController(controller);
    }

    // Ensure global modules are bound
    this.bindGlobalScope();
  }

  public register(providers: Provider[], moduleKey?: Type): void {
    // Find or create module for this key using cache (O(1))
    let moduleRef: Module | undefined;

    if (moduleKey) {
      moduleRef = this._moduleByMetatype.get(moduleKey);
    }

    // If no module found, use first module or create default
    let targetModule = moduleRef;
    if (!targetModule) {
      if (this._modules.size === 0) {
        // Create a default module
        const DefaultModule = class DefaultModule {};
        targetModule = this.addModule(DefaultModule as Type, "default");
      } else {
        targetModule = this._modules.values().next().value;
      }
    }

    // Register providers
    for (const provider of providers) {
      targetModule!.addProvider(provider);
    }

    // Ensure global modules are bound
    this.bindGlobalScope();
  }

  public static getRequestContext(): RequestContext | undefined {
    return requestAsyncStorage.getStore();
  }

  public static runInRequestContext<R>(
    context: RequestContext,
    fn: () => R,
  ): R {
    return requestAsyncStorage.run(context, fn);
  }
}

// Export a singleton instance for backward compatibility
export const DIContainer = Container.instance;
