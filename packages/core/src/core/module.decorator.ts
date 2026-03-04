/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";

import { Elysia } from "elysia";

import {
  GLOBAL_MODULE_METADATA,
  MODULE_METADATA,
} from "../decorators/constants";
import type { ModuleOptions } from "../decorators/types";
import type { Type } from "../di";
import { createElysiaPlugin } from "./elysia-plugin.factory";

/**
 * Module decorator that creates an Elysia plugin from the module configuration.
 *
 * @param options Module configuration options
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Module({
 *   controllers: [UsersController],
 *   providers: [UsersService],
 *   imports: [DatabaseModule],
 * })
 * export class AppModule {}
 * ```
 */
export const Module = (options: ModuleOptions): any =>
  // Return a function that takes the target class and returns the module factory
  // This is called by the TypeScript decorator system
  function (target: any) {
    // Create the module factory function
    const moduleFactory = createModuleFactory(target, options);

    // Copy static methods (including inherited ones) so that patterns like
    // CacheModule.forRootAsync() work even when the method lives on a base class.
    for (const prop of getInheritedStaticNames(target)) {
      if (
        prop !== "prototype" &&
        prop !== "name" &&
        prop !== "length" &&
        typeof target[prop] === "function"
      ) {
        // Create a wrapper that calls the original method but ensures
        // any returned dynamic module object uses moduleFactory as the module reference
        (moduleFactory as any)[prop] = (...args: unknown[]) => {
          const result = target[prop].apply(target, args);
          // If result is a dynamic module object (has module property), update it to use moduleFactory
          if (
            result &&
            typeof result === "object" &&
            "module" in result &&
            result.module === target
          ) {
            return { ...result, module: moduleFactory };
          }
          return result;
        };
      }
    }

    // Ensure moduleFactory has a prototype so it can be used as a constructor if needed
    if (!moduleFactory.prototype) {
      moduleFactory.prototype = target.prototype;
    }

    Reflect.defineMetadata(MODULE_METADATA, options, moduleFactory);

    // Copy @Global() metadata from original class to moduleFactory
    const isGlobal = Reflect.getMetadata(GLOBAL_MODULE_METADATA, target);
    if (isGlobal) {
      Reflect.defineMetadata(GLOBAL_MODULE_METADATA, true, moduleFactory);
    }

    return moduleFactory;
  };

/** Returns all static property names on a class, walking the prototype chain. */
function getInheritedStaticNames(cls: Function): Set<string> {
  const names = new Set<string>();
  for (
    let proto: object | null = cls;
    proto && proto !== Function.prototype;
    proto = Object.getPrototypeOf(proto)
  ) {
    Object.getOwnPropertyNames(proto).forEach((p) => names.add(p));
  }
  return names;
}

/**
 * Helper to create module factory function.
 *
 * @param target Module class
 * @param options Module options
 * @returns Factory function that creates Elysia app
 */
function createModuleFactory(target: any, options: ModuleOptions) {
  const moduleFactory = async function (instance?: any): Promise<Elysia> {
    // Check if this is a dynamic module configuration (from forRootAsync)
    if (
      instance &&
      typeof instance === "object" &&
      "module" in instance &&
      typeof instance.module === "function"
    ) {
      // This is a dynamic module - use the merged options
      const dynamicOptions = instance as {
        module: Type<any>;
        providers?: ModuleOptions["providers"];
        exports?: ModuleOptions["exports"];
        global?: boolean;
      };

      const mergedOptions: ModuleOptions = {
        ...options,
        providers: [
          ...(options.providers || []),
          ...(dynamicOptions.providers || []),
        ],
        exports: [
          ...(options.exports || []),
          ...(dynamicOptions.exports || []),
        ],
      };

      // Create metadata key for the merged options
      Reflect.defineMetadata(MODULE_METADATA, mergedOptions, target);

      const plugin = createElysiaPlugin(
        target,
        mergedOptions,
        dynamicOptions.module,
      );
      // Create new Elysia app and apply plugin
      const app = new Elysia();
      return await plugin(app);
    }

    // Regular module initialization
    // If no instance provided, use the target class itself
    const moduleinstance = instance
      ? instance instanceof Function
        ? instance
        : instance.constructor
      : target;

    const plugin = createElysiaPlugin(target, options, moduleinstance);
    // Create new Elysia app and apply plugin
    const app = new Elysia();
    return await plugin(app);
  };

  // Set the name of the function for debugging
  Object.defineProperty(moduleFactory, "name", { value: target.name });

  return moduleFactory;
}
