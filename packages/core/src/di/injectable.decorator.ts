
import { INJECTABLE_METADATA } from "../decorators/constants";
import type { Type } from "./provider.interface";
import {
  Scope,
  type ScopeOptions as importedScopeOptions,
} from "./scope-options.interface";

export interface InjectableOptions extends importedScopeOptions {
  providedIn?: "root" | Type | null;
}

const defaultOptions: InjectableOptions = {
  scope: Scope.SINGLETON,
  providedIn: "root",
};

export const INJECTABLE_SOURCE = Symbol("INJECTABLE_SOURCE");

export function Injectable(
  options: InjectableOptions = defaultOptions,
): ClassDecorator {
  const sourceStack = new Error().stack;
  return (target) => {
    Reflect.defineMetadata(
      INJECTABLE_METADATA,
      { ...defaultOptions, ...options },
      target,
    );
    if (sourceStack) {
      Reflect.defineMetadata(INJECTABLE_SOURCE, sourceStack, target);
    }
    return target;
  };
}

// An array for keeping track of dependencies
export const INJECT_METADATA = Symbol("INJECT_METADATA");

export function Inject(token: unknown): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existingParams: Array<{ index: number; token: unknown }> =
      Reflect.getOwnMetadata(INJECT_METADATA, target) || [];
    Reflect.defineMetadata(
      INJECT_METADATA,
      [...existingParams, { index: parameterIndex, token }],
      target,
    );
  };
}

export const OPTIONAL_METADATA = Symbol("OPTIONAL_METADATA");

export function Optional(): ParameterDecorator {
  return (target, _propertyKey, parameterIndex) => {
    const existingOptionalParams: number[] =
      Reflect.getOwnMetadata(OPTIONAL_METADATA, target) || [];
    Reflect.defineMetadata(
      OPTIONAL_METADATA,
      [...existingOptionalParams, parameterIndex],
      target,
    );
  };
}
