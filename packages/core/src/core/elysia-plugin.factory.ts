/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Context as ElysiaContextType, Elysia } from "elysia";

import {
  APP_FILTERS_METADATA,
  GLOBAL_MODULE_METADATA,
  INJECTABLE_METADATA,
  MODULE_METADATA,
} from "../decorators/constants";
import type { ModuleOptions } from "../decorators/types";
import { Container, DIContainer, isCustomProvider, Scope, type Type } from "../di";
import { APP_FILTER } from "../di/constants";
import type { Provider } from "../di/provider.interface";
import { type ElysiaNestMiddleware, isClassMiddleware } from "../interfaces/middleware.interface";
import { Logger } from "../logger/logger.service";
import { validateModuleDependencies } from "./helpers";
import { setupController } from "./controller-setup";
import { addGlobalExceptionFilter, applyExceptionFilters } from "./exception-filter.registry";
import {
  type DynamicModule,
  extractProviderInfo,
  getModuleClass,
  initializeSingletonProviders,
  isDecoratedModule,
  isDynamicModule,
} from "./module.utils";

export { addGlobalExceptionFilter, applyExceptionFilters };

/**
 * Helper function to create the Elysia plugin from module metadata.
 */
export function createElysiaPlugin(
  _target: any,
  metadata: ModuleOptions,
  moduleinstance: any,
): (app: Elysia) => Promise<Elysia> {
  return async (app: Elysia): Promise<any> => {
    const prefix = metadata?.prefix?.replace(/\/$/, "") || "";
    const moduleName = moduleinstance.name || "AnonymousModule";
    const moduleLogger = new Logger("InstanceLoader");

    if (app === undefined) {
      app = new Elysia({ prefix }) as any;
    }
    if (!metadata?.controllers?.length) {
      app = app.get("/__health__", () => "ok") as unknown as Elysia;
    }

    // Ensure module is created in container first
    const currentModuleRef = Container.instance.addModule(
      moduleinstance as Type<any>,
      moduleinstance.name || "module",
    );

    // If this module was already fully initialized within the current
    // createElysiaApplication session (e.g. it is imported by multiple parent modules),
    // skip re-initialization — providers, controllers and lifecycle hooks would run again
    // otherwise, producing duplicate log lines and redundant work.
    if (Container.instance.isInitializedInSession(moduleinstance as Type<any>)) {
      return app;
    }
    Container.instance.markInitializedInSession(moduleinstance as Type<any>);

    // Collect and store APP_FILTER providers
    const appFilters = metadata?.providers?.reduce<any[]>((acc, provider) => {
      if (isCustomProvider(provider) && provider.provide === APP_FILTER) {
        if ("useClass" in provider && provider.useClass) {
          acc.push(provider.useClass);
        } else if ("useValue" in provider && provider.useValue) {
          acc.push(provider.useValue);
        } else if ("useFactory" in provider && typeof provider.useFactory === "function") {
          acc.push(provider.useFactory);
        }
      }
      return acc;
    }, []);

    if (appFilters?.length) {
      const existingFilters = Reflect.getMetadata(APP_FILTERS_METADATA, moduleinstance) || [];
      Reflect.defineMetadata(
        APP_FILTERS_METADATA,
        [...existingFilters, ...appFilters],
        moduleinstance,
      );
    }

    // Register global module with providers
    const registerGlobalModule = (dynamicModule: DynamicModule) => {
      const moduleClass = getModuleClass(dynamicModule);
      const moduleRef = Container.instance.addModule(
        moduleClass,
        moduleClass.name || "global-module",
      );

      const baseMetadata: ModuleOptions = Reflect.getMetadata(MODULE_METADATA, moduleClass) || {};
      const allProviders: Provider[] = [
        ...(baseMetadata.providers || []),
        ...(dynamicModule.providers || []),
      ];

      for (const provider of allProviders) {
        moduleRef.addProvider(provider);
      }
      if (allProviders.length) {
        DIContainer.register(allProviders, moduleClass);
      }

      Container.instance.addGlobalModule(moduleRef);
      Container.instance.bindGlobalScope();
    };

    // Collect class middleware instances; apply functional middleware immediately
    const classMiddlewares: ElysiaNestMiddleware[] = [];
    if (metadata?.middlewares?.length) {
      for (const item of metadata.middlewares) {
        try {
          if (isClassMiddleware(item)) {
            const injectableMeta = Reflect.getMetadata(INJECTABLE_METADATA, item);
            if (injectableMeta !== undefined) {
              DIContainer.register([item], moduleinstance as Type<any>);
            }
            const instance = await DIContainer.get<ElysiaNestMiddleware>(
              item,
              moduleinstance as Type<any>,
            );
            if (!instance) {
              throw new Error(
                `Failed to resolve middleware "${item.name}". ` +
                  `Make sure it is decorated with @Middleware() or @Injectable() ` +
                  `and listed in the module providers if it has dependencies.`,
              );
            }
            classMiddlewares.push(instance);
          } else {
            app = app.use(item as any) as any;
          }
        } catch (e) {
          Logger.error(
            `Failed to apply middleware ${isClassMiddleware(item) ? item.name : "functional"}:`,
            e,
          );
        }
      }
    }

    // Process a single import
    const processImport = async (importedModule: any) => {
      if (isDynamicModule(importedModule)) {
        const moduleClass = getModuleClass(importedModule);
        const importedRef = Container.instance.addModule(moduleClass, moduleClass.name || "module");

        currentModuleRef.addImport(importedRef);

        if (importedModule.providers?.length) {
          for (const provider of importedModule.providers) {
            importedRef.addProvider(provider);
          }
          DIContainer.register(importedModule.providers, moduleClass);
        }

        const moduleFn = importedModule.module as unknown as (...args: unknown[]) => unknown;
        const plugin = await moduleFn(importedModule);
        app = app.use(plugin as any) as any;

        if (importedModule.global) {
          registerGlobalModule(importedModule);
        }
        Container.instance.bindGlobalScope();
        return;
      }

      if (isDecoratedModule(importedModule)) {
        const moduleClass = importedModule;
        const importedRef = Container.instance.addModule(moduleClass, moduleClass.name || "module");

        currentModuleRef.addImport(importedRef);

        const plugin = await (importedModule as unknown as () => Promise<unknown>)();
        app = app.use(plugin as any) as any;

        if (Reflect.getMetadata(GLOBAL_MODULE_METADATA, importedModule)) {
          const moduleMetadata: ModuleOptions =
            Reflect.getMetadata(MODULE_METADATA, moduleClass) || {};

          const globalRef =
            Container.instance.getModuleByKey(moduleClass.name) ||
            Container.instance.addModule(moduleClass, moduleClass.name || "global-module");

          if (moduleMetadata.providers?.length) {
            for (const provider of moduleMetadata.providers) {
              globalRef.addProvider(provider);
            }
          }

          Container.instance.addGlobalModule(globalRef);
          Container.instance.bindGlobalScope();
        }
        return;
      }

      // Plugin with .plugin property or direct Elysia plugin
      try {
        const plugin =
          typeof importedModule?.plugin === "function" ? importedModule.plugin : importedModule;
        app = app.use(plugin as any) as any;
      } catch (e) {
        Logger.error(`Failed to apply import: ${importedModule?.name || "Unknown import"}.`, e);
        throw e;
      }
    };

    if (metadata?.imports?.length) {
      await Promise.all(metadata.imports.map(processImport));
    }

    if (metadata?.children?.length) {
      const childPlugins = await Promise.all(metadata.children.map((child) => child()));
      for (const plugin of childPlugins) {
        app = app.use(plugin as (app: Elysia) => Elysia);
      }
    }

    Container.instance.bindGlobalScope();

    DIContainer.register([{ provide: "ELYSIA_APP", useValue: app }], moduleinstance as Type<any>);

    if (metadata?.providers?.length) {
      DIContainer.register(metadata.providers, moduleinstance as Type<any>);
    }

    if (metadata?.exports?.length) {
      for (const exportItem of metadata.exports) {
        currentModuleRef.addExport(exportItem);
        if (typeof exportItem === "function") {
          currentModuleRef.addProvider(exportItem);
        }
      }
    }

    if (metadata?.controllers?.length) {
      DIContainer.registerControllers(metadata.controllers, moduleinstance as Type<any>);

      await validateModuleDependencies(
        metadata.controllers,
        metadata.providers,
        moduleinstance as Type<any>,
      );
    }

    await initializeSingletonProviders();

    if (metadata?.controllers?.length) {
      await Promise.all(
        metadata.controllers.map((controllerClass) =>
          setupController(app, controllerClass, moduleinstance, prefix, classMiddlewares),
        ),
      );
    }

    if (metadata?.providers?.length) {
      const singletonProviders = metadata.providers
        .map((provider) => ({ provider, ...extractProviderInfo(provider) }))
        .filter(({ token, scope }) => token && scope === Scope.SINGLETON);

      await Promise.all(
        singletonProviders.map(async ({ token }) => {
          try {
            const instance = await DIContainer.get(token!, moduleinstance as Type<unknown>);
            if (
              instance &&
              typeof (instance as { onModuleInit?: () => Promise<void> | void }).onModuleInit ===
                "function" &&
              !(instance as { __onModuleInitCalled?: boolean }).__onModuleInitCalled
            ) {
              await (instance as { onModuleInit: () => Promise<void> | void }).onModuleInit();
              (instance as { __onModuleInitCalled?: boolean }).__onModuleInitCalled = true;
            }
          } catch (e) {
            Logger.error(`Error in local provider:`, e);
          }
        }),
      );
    }

    moduleLogger.log(`${moduleName} dependencies initialized`);

    return app as any;
  };
}
