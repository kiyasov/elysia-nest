import "reflect-metadata";

import { typeMetadataStorage } from "../storages/type-metadata.storage";
import { ARGS_METADATA } from "./constants";

/** Options for an argument. */
export interface ArgsOptions {
  /** Argument name. */
  name: string;
  /** Function returning the type (for lazy loading and complex types). */
  type?: () => unknown;
  /** Whether the argument can be null. */
  nullable?: boolean;
  /** Argument description. */
  description?: string;
  /** Default value. */
  defaultValue?: unknown;
}

/** Argument metadata stored in Reflect. */
export interface ArgsMetadata extends Partial<ArgsOptions> {
  /** Parameter index in the method signature. */
  index: number;
  /** Argument name. */
  name?: string;
}

/** Definition of an operation argument for schema generation. */
export interface OperationArgDefinition {
  /** Argument name. */
  name: string;
  /** Function returning the type. */
  typeFn?: () => unknown;
  /** Whether the argument can be null. */
  nullable?: boolean;
  /** Argument description. */
  description?: string;
  /** Default value. */
  defaultValue?: unknown;
  /** Parameter index in the method signature. */
  index: number;
}

/**
 * Extracts argument definitions for a resolver method from metadata.
 * @param target - The resolver class prototype.
 * @param methodName - The method name.
 * @returns Array of argument definitions.
 */
export function getOperationArgsDefinitions(
  target: object,
  methodName: string,
): OperationArgDefinition[] {
  const argsMetadata =
    (Reflect.getMetadata(ARGS_METADATA, target, methodName) as
      | ArgsMetadata[]
      | undefined) ?? [];

  const paramTypes =
    (Reflect.getMetadata("design:paramtypes", target, methodName) as
      | unknown[]
      | undefined) ?? [];

  const defs: OperationArgDefinition[] = [];

  for (const argMeta of argsMetadata) {
    if (!argMeta.name) {
      const paramType = paramTypes[argMeta.index];
      if (!paramType || typeof paramType !== "function") {
        continue;
      }
      const fields = typeMetadataStorage.getFieldsByConstructor(paramType);
      for (const field of fields) {
        defs.push({
          name: field.name,
          typeFn: field.typeFn,
          nullable: field.nullable,
          description: field.description,
          defaultValue: field.defaultValue,
          index: argMeta.index,
        });
      }
      continue;
    }

    const inferredType = paramTypes[argMeta.index];
    defs.push({
      name: argMeta.name,
      typeFn:
        argMeta.type ??
        (inferredType && typeof inferredType === "function"
          ? () => inferredType
          : undefined),
      nullable: argMeta.nullable,
      description: argMeta.description,
      defaultValue: argMeta.defaultValue,
      index: argMeta.index,
    });
  }

  return defs;
}

/**
 * Decorator for resolver arguments.
 * @param nameOrOptions - Argument name or options object.
 *
 * @example
 * ```typescript
 * @Query()
 * async user(@Args('id') id: string) { }
 *
 * @Query()
 * async users(@Args('limit') limit: number, @Args('offset') offset: number) { }
 *
 * @Mutation()
 * async createUser(
 *   @Args({ name: 'input', type: () => CreateUserInput, description: 'User input' })
 *   input: CreateUserInput
 * ) { }
 *
 * @Query()
 * async search(
 *   @Args({ name: 'query', nullable: true, defaultValue: '' })
 *   query: string
 * ) { }
 * ```
 */
export function Args(): ParameterDecorator;
export function Args(name: string): ParameterDecorator;
export function Args(options: ArgsOptions): ParameterDecorator;
export function Args(
  name: string,
  options: Omit<ArgsOptions, "name">,
): ParameterDecorator;
export function Args(
  nameOrOptions?: string | ArgsOptions,
  options?: Omit<ArgsOptions, "name">,
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existingParams: ArgsMetadata[] =
      Reflect.getMetadata(ARGS_METADATA, target, propertyKey as string) || [];

    const argOptions: ArgsMetadata =
      typeof nameOrOptions === "string"
        ? { index: parameterIndex, name: nameOrOptions, ...options }
        : { index: parameterIndex, ...nameOrOptions };

    existingParams.push(argOptions);

    Reflect.defineMetadata(
      ARGS_METADATA,
      existingParams,
      target,
      propertyKey as string,
    );

    const methodName = propertyKey as string;

    const allOperations = [
      ...typeMetadataStorage.getQueries(),
      ...typeMetadataStorage.getMutations(),
      ...typeMetadataStorage.getSubscriptions(),
      ...typeMetadataStorage.getFieldResolvers(),
    ];

    const operation = allOperations.find(
      (op) => op.target === target && op.methodName === methodName,
    );

    if (operation) {
      operation.args = getOperationArgsDefinitions(target, methodName);
    }
  };
}
