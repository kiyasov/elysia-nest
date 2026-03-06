import "reflect-metadata";

import { INTERCEPTORS_METADATA } from "../decorators/constants";

/**
 * Decorator that binds interceptors to the scope of the controller or method,
 * depending on its context.
 *
 * @param interceptors A single interceptor instance or class, or an array of
 * interceptor instances or classes.
 *
 * @publicApi
 */
export function UseInterceptors(
  ...interceptors: ((new (...args: any[]) => any) | object)[]
): MethodDecorator & ClassDecorator {
  return (
    target: object | (new (...args: any[]) => any),
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const isMethod = propertyKey !== undefined && descriptor !== undefined;

    if (isMethod) {
      // Method decorator
      const existingInterceptors =
        Reflect.getMetadata(
          INTERCEPTORS_METADATA,
          target.constructor,
          propertyKey!,
        ) || [];

      Reflect.defineMetadata(
        INTERCEPTORS_METADATA,
        [...existingInterceptors, ...interceptors],
        target.constructor,
        propertyKey!,
      );
    } else {
      // Class decorator
      const existingInterceptors =
        Reflect.getMetadata(INTERCEPTORS_METADATA, target) || [];

      Reflect.defineMetadata(
        INTERCEPTORS_METADATA,
        [...existingInterceptors, ...interceptors],
        target,
      );
    }
  };
}
