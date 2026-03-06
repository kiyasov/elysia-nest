import "reflect-metadata";

import { ROUTE_SCHEMA_METADATA } from "./constants";

export interface RouteSchemaOptions {
  body?: object;
  query?: object;
  params?: object;
  headers?: object;
  response?: object | Record<number, object>;
}

export function Schema(options: RouteSchemaOptions): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    _descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      ROUTE_SCHEMA_METADATA,
      options,
      target.constructor,
      propertyKey,
    );
  };
}
