import {
  type TypeFieldMetadata,
  typeMetadataStorage,
} from "../storages/type-metadata.storage";
import type {
  Constructor,
  EnumMetadata,
  InputTypeMetadata,
  InterfaceTypeMetadata,
  ObjectTypeMetadata,
  ScalarMetadata,
  UnionMetadata,
} from "./types";

/**
 * Decorator for GraphQL Object Type.
 * @param options - Type options or name.
 *
 * @example
 * ```typescript
 * @ObjectType()
 * class User {
 *   @Field()
 *   id: string;
 *
 *   @Field()
 *   name: string;
 * }
 *
 * // with description
 * @ObjectType({ description: 'System user' })
 * class User {
 *   // ...
 * }
 * ```
 */
export function ObjectType(
  options?:
    | {
        name?: string;
        description?: string;
        interfaces?: (() => unknown)[];
        isAbstract?: boolean;
      }
    | string,
): ClassDecorator {
  return (target) => {
    const name =
      typeof options === "string" ? options : options?.name || target.name;
    const metadata: ObjectTypeMetadata =
      typeof options === "string"
        ? { name, description: undefined }
        : { name, ...options };

    typeMetadataStorage.addObjectType(target, metadata);
    return target;
  };
}

/**
 * Decorator for GraphQL Input Type.
 * @param options - Type options or name.
 *
 * @example
 * ```typescript
 * @InputType()
 * class CreateUserInput {
 *   @Field()
 *   name: string;
 *
 *   @Field({ nullable: true })
 *   email?: string;
 * }
 * ```
 */
export function InputType(
  options?:
    | { name?: string; description?: string; isAbstract?: boolean }
    | string,
): ClassDecorator {
  return (target) => {
    const name =
      typeof options === "string" ? options : options?.name || target.name;
    const metadata: InputTypeMetadata =
      typeof options === "string"
        ? { name, description: undefined }
        : {
            name,
            description: (options as { description?: string } | undefined)
              ?.description,
          };

    typeMetadataStorage.addInputType(target, metadata);
    return target;
  };
}

/**
 * Decorator for a GraphQL field.
 *
 * The type is inferred from TypeScript's `design:type` metadata for primitive types
 * (`string` → `String`, `number` → `Number`, `boolean` → `Boolean`).
 * For all other types — enums, classes, union types — an explicit type factory
 * **must** be provided; omitting it throws an error at decoration time.
 *
 * @param typeFn - Function returning the GraphQL type. Required for enums,
 *   class references, and any type TypeScript cannot represent as a primitive
 *   (i.e. when `design:type` would be `Object`).
 * @param options - Field options.
 * @throws {Error} When no explicit type is given and `design:type` is `Object`.
 *
 * @example
 * ```typescript
 * @ObjectType()
 * class User {
 *   @Field()
 *   id: string;
 *
 *   @Field({ nullable: true })
 *   email?: string;
 *
 *   @Field(() => [Post])
 *   posts: Post[];
 *
 *   // Enum — explicit type factory required
 *   @Field(() => Role)
 *   role: Role;
 * }
 * ```
 */
export function Field(
  typeFnOrOptions?:
    | (() => unknown)
    | {
        type?: () => unknown;
        nullable?: boolean;
        description?: string;
        deprecationReason?: string;
        defaultValue?: unknown;
      },
  fieldOptions?: {
    nullable?: boolean;
    description?: string;
    deprecationReason?: string;
    defaultValue?: unknown;
  },
): PropertyDecorator {
  return (target, propertyKey) => {
    const isFunction = typeof typeFnOrOptions === "function";
    const explicitTypeFn = isFunction ? typeFnOrOptions : typeFnOrOptions?.type;
    const options = isFunction
      ? fieldOptions
      : { ...typeFnOrOptions, ...fieldOptions };
    const reflectedType = Reflect.getMetadata(
      "design:type",
      target,
      propertyKey,
    ) as unknown;

    if (!explicitTypeFn && reflectedType === Object) {
      const className = (
        (target as { constructor?: { name?: string } }).constructor?.name ?? "UnknownClass"
      );
      throw new Error(
        `@Field() on "${className}.${propertyKey.toString()}" cannot infer the GraphQL type ` +
          `(TypeScript emitted "Object" — this happens with enums, union types, and class references). ` +
          `Provide an explicit type factory: @Field(() => ${propertyKey.toString()[0].toUpperCase() + propertyKey.toString().slice(1)}Type)`,
      );
    }

    const typeFn =
      explicitTypeFn ??
      (typeof reflectedType === "function" ? () => reflectedType : undefined);

    const constructor = (target as object as { constructor: object })
      .constructor;

    const sourceLocation = extractCallerLocation(new Error());

    const fieldMeta: TypeFieldMetadata = {
      name: propertyKey.toString(),
      typeFn,
      nullable: options?.nullable,
      description: options?.description,
      deprecationReason: options?.deprecationReason,
      defaultValue: options?.defaultValue,
      target,
      sourceLocation,
    };

    typeMetadataStorage.addField(constructor, fieldMeta);
  };
}

/**
 * Decorator for GraphQL Enum.
 * @param options - Enum options or name.
 *
 * @example
 * ```typescript
 * @Enum()
 * enum UserRole {
 *   ADMIN = 'ADMIN',
 *   USER = 'USER',
 * }
 * ```
 */
export function Enum(
  options?: { name?: string; description?: string } | string,
): ClassDecorator {
  return (target) => {
    const name =
      typeof options === "string" ? options : options?.name || target.name;
    const metadata: EnumMetadata =
      typeof options === "string"
        ? { name, description: undefined }
        : { name, ...options };

    typeMetadataStorage.addEnum(target, metadata);
    return target;
  };
}

/**
 * Decorator for GraphQL Interface.
 * @param options - Interface options or name.
 *
 * @example
 * ```typescript
 * @InterfaceType()
 * abstract class Node {
 *   @Field()
 *   id: string;
 * }
 * ```
 */
export function InterfaceType(
  options?:
    | {
        name?: string;
        description?: string;
        resolveType?: (value: unknown) => string;
      }
    | string,
): ClassDecorator {
  return (target) => {
    const name =
      typeof options === "string" ? options : options?.name || target.name;
    const metadata: InterfaceTypeMetadata =
      typeof options === "string"
        ? { name, description: undefined }
        : { name, ...options };

    typeMetadataStorage.addInterfaceType(target, metadata);
    return target;
  };
}

/**
 * Decorator for GraphQL Scalar.
 * @param name - Scalar name.
 * @param typeFnOrOptions - Type factory function or scalar options.
 * @param options - Scalar options when typeFnOrOptions is a function.
 *
 * @example
 * ```typescript
 * @Scalar('Date')
 * class DateScalar implements CustomScalar<string, Date> {
 *   description = 'Date custom scalar type';
 *
 *   parseValue(value: string): Date {
 *     return new Date(value);
 *   }
 *
 *   serialize(value: Date): string {
 *     return value.toISOString();
 *   }
 *
 *   parseLiteral(ast: ValueNode): Date {
 *     if (ast.kind === Kind.STRING) {
 *       return new Date(ast.value);
 *     }
 *     return null;
 *   }
 * }
 * ```
 */
export function Scalar(
  name: string,
  typeFnOrOptions?: (() => unknown) | { description?: string },
  options?: { description?: string },
): ClassDecorator {
  return (target) => {
    const typeFn =
      typeof typeFnOrOptions === "function" ? typeFnOrOptions : undefined;
    const scalarOptions =
      typeof typeFnOrOptions === "function"
        ? options
        : (typeFnOrOptions ?? options);

    const metadata: ScalarMetadata = {
      name,
      ...scalarOptions,
      typeFn,
    };

    typeMetadataStorage.addScalar(target, metadata);
    return target;
  };
}

/**
 * Decorator for GraphQL Directive.
 * @param name - Directive name.
 * @param options - Directive options.
 */
export function Directive(
  name: string,
  options?: {
    description?: string;
    locations?: string[];
    args?: Record<string, unknown>;
  },
): ClassDecorator {
  return (target) => {
    const metadata = {
      name,
      ...options,
    };

    Reflect.defineMetadata("__graphql_directive__", metadata, target);
    return target;
  };
}

/**
 * Decorator for GraphQL Union.
 * @param name - Union name.
 * @param types - Array of type factory functions.
 * @param options - Union options.
 *
 * @example
 * ```typescript
 * @Union('SearchResult', [Book, Movie])
 * class SearchResult {}
 * ```
 */
export function Union(
  name: string,
  types: (() => unknown)[],
  options?: { description?: string; resolveType?: (value: unknown) => string },
): ClassDecorator {
  return (target) => {
    const metadata: UnionMetadata = {
      name,
      types: types.map((t) => t() as Constructor<unknown>),
      ...options,
    };

    typeMetadataStorage.addUnion(target, metadata);
    return target;
  };
}

/**
 * Hides a field from the GraphQL schema.
 * @example
 * ```typescript
 * @ObjectType()
 * class User {
 *   @Field()
 *   id: string;
 *
 *   @HideField()
 *   password: string;
 * }
 * ```
 */
export function HideField(): PropertyDecorator {
  return (target, propertyKey) => {
    const constructor = (target as { constructor: object }).constructor;
    typeMetadataStorage.removeField(constructor, propertyKey.toString());
  };
}

/** Interface for custom scalars. */
export interface CustomScalar<TExternal, TInternal> {
  /** Description of the scalar type. */
  description: string;
  /** Parses an external value to internal representation. */
  parseValue(value: TExternal): TInternal;
  /** Serializes an internal value to external representation. */
  serialize(value: TInternal): TExternal;
  /** Parses a literal AST node to internal representation. */
  parseLiteral(value: unknown): TInternal | null;
}

/** Marker class for GraphQL Int scalar. Use with @Field(() => Int). */
export abstract class Int {}

/** Marker class for GraphQL Float scalar. Use with @Field(() => Float). */
export abstract class Float {}

/** Marker class for GraphQL ID scalar. Use with @Field(() => ID). */
export abstract class ID {}

/**
 * Extracts the caller location from an error stack trace.
 * @param error - Error object with stack trace.
 * @returns The file path and line number of the caller.
 */
function extractCallerLocation(error: Error): string | undefined {
  const stack = error.stack;
  if (!stack) {
    return undefined;
  }

  const lines = stack.split("\n");
  for (const line of lines) {
    if (
      line.includes("type.decorator") ||
      line.includes("type-metadata.storage") ||
      line.includes("node_modules")
    ) {
      continue;
    }
    const match = line.match(/\(?([^\s()]+\.[tj]sx?:\d+:\d+)\)?/);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}
