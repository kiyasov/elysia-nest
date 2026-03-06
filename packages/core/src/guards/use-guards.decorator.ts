import "reflect-metadata";

import { GUARDS_METADATA } from "../decorators/constants";

/**
 * Decorator that binds guards to the scope of the controller or method,
 * depending on its context.
 *
 * @param guards A single guard instance or class, or an array of guard
 * instances or classes.
 *
 * @publicApi
 */
export function UseGuards(
  ...guards: ((new (...args: any[]) => any) | object)[]
): MethodDecorator & ClassDecorator {
  return (
    target: object | (new (...args: any[]) => any),
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const isMethod = propertyKey !== undefined && descriptor !== undefined;

    if (isMethod) {
      // Method decorator
      const existingGuards =
        Reflect.getMetadata(
          GUARDS_METADATA,
          target.constructor,
          propertyKey!,
        ) || [];

      Reflect.defineMetadata(
        GUARDS_METADATA,
        [...existingGuards, ...guards],
        target.constructor,
        propertyKey!,
      );
    } else {
      // Class decorator
      const existingGuards = Reflect.getMetadata(GUARDS_METADATA, target) || [];

      Reflect.defineMetadata(
        GUARDS_METADATA,
        [...existingGuards, ...guards],
        target,
      );
    }
  };
}
