import { INJECTABLE_METADATA } from "../decorators/constants";
import type { Container } from "./container";
import { InstanceWrapper } from "./instance-wrapper";
import type { Provider, ProviderToken, Type } from "./provider.interface";
import type { Scope } from "./scope-options.interface";

export class Module {
  private readonly _providers = new Map<ProviderToken, InstanceWrapper>();
  private readonly _controllers = new Map<ProviderToken, InstanceWrapper>();
  private readonly _imports = new Set<Module>();
  private readonly _exports = new Set<ProviderToken>();
  private readonly _metatype: Type;
  private _token: string;
  private readonly _container: Container;
  private _isInitialized = false;

  constructor(metatype: Type, container: Container) {
    this._metatype = metatype;
    this._container = container;
    this._token = metatype.name;
  }

  get metatype(): Type {
    return this._metatype;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get name(): string {
    return this._token;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  markInitialized(): void {
    this._isInitialized = true;
  }

  get imports(): Set<Module> {
    return this._imports;
  }

  public addProvider(provider: Provider): void {
    const token = this.getProviderToken(provider);

    let metatype: Type | Function | null = null;
    let inject: unknown[] | null = null;
    let instance: unknown = null;
    let isResolved = false;

    if (typeof provider === "function") {
      metatype = provider;
    } else if ("useClass" in provider) {
      metatype = provider.useClass;
    } else if ("useFactory" in provider) {
      metatype = provider.useFactory;
      inject = provider.inject ?? [];
    } else if ("useValue" in provider) {
      metatype = null;
      instance = provider.useValue;
      isResolved = true;
    } else if ("useExisting" in provider) {
      metatype = null;
    }

    const isAlias = "useExisting" in provider;
    const aliasTarget = isAlias ? provider.useExisting : undefined;

    // Read scope from @Injectable() metadata if available
    let scope: Scope | undefined;
    if (metatype && typeof metatype === "function") {
      const injectableMeta = Reflect.getMetadata(INJECTABLE_METADATA, metatype);
      if (injectableMeta?.scope !== undefined) {
        scope = injectableMeta.scope as Scope;
      }
    }

    const wrapper = new InstanceWrapper({
      token,
      metatype,
      inject: inject ?? undefined,
      instance,
      isResolved,
      isAlias,
      aliasTarget,
      scope,
      host: this,
    });

    this._providers.set(token, wrapper);
  }

  public addController(controller: Type): void {
    const wrapper = new InstanceWrapper({
      token: controller,
      metatype: controller,
      host: this,
    });
    this._controllers.set(controller, wrapper);
  }

  public addImport(module: Module): void {
    this._imports.add(module);
  }

  public addExport(exportToken: ProviderToken): void {
    this._exports.add(exportToken);
  }

  public getExports(): Set<ProviderToken> {
    return this._exports;
  }

  public getProviderByKey<T>(
    token: ProviderToken,
    visited: Set<Module> = new Set(),
  ): InstanceWrapper<T> | undefined {
    // Prevent infinite recursion from circular imports
    if (visited.has(this)) {
      return undefined;
    }
    visited.add(this);

    // Check own providers first
    const ownProvider = this._providers.get(token);
    if (ownProvider) {
      return ownProvider as InstanceWrapper<T>;
    }

    // Check imported modules
    for (const importedModule of this._imports) {
      const fromImport = importedModule.getProviderByKey<T>(token, visited);
      if (fromImport) {
        return fromImport;
      }
    }

    return undefined;
  }

  public getControllerByKey<T>(
    token: ProviderToken,
    visited: Set<Module> = new Set(),
  ): InstanceWrapper<T> | undefined {
    // Prevent infinite recursion from circular imports
    if (visited.has(this)) {
      return undefined;
    }
    visited.add(this);

    // Check own controllers first
    const ownController = this._controllers.get(token);
    if (ownController) {
      return ownController as InstanceWrapper<T>;
    }

    // Check imported modules
    for (const importedModule of this._imports) {
      const fromImport = importedModule.getControllerByKey<T>(token, visited);
      if (fromImport) {
        return fromImport;
      }
    }

    return undefined;
  }

  public getProviders(): Map<ProviderToken, InstanceWrapper> {
    return this._providers;
  }

  public getControllers(): Map<ProviderToken, InstanceWrapper> {
    return this._controllers;
  }

  public getImports(): Set<Module> {
    return this._imports;
  }

  private getProviderToken(provider: Provider): ProviderToken {
    if (typeof provider === "function") {
      return provider;
    }
    return provider.provide;
  }
}
