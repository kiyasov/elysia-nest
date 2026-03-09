import "reflect-metadata";

import {
  GraphQLBoolean,
  GraphQLEnumType,
  type GraphQLFieldConfigMap,
  type GraphQLFieldResolver,
  GraphQLFloat,
  GraphQLID,
  type GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  type GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  type GraphQLNamedType,
  GraphQLNonNull,
  GraphQLObjectType,
  type GraphQLOutputType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
} from "graphql";

import {
  GUARDS_METADATA,
  PARAMS_METADATA,
} from "@kiyasov/elysia-nest";
import type { ParamMetadata } from "@kiyasov/elysia-nest";
import type { Container } from "@kiyasov/elysia-nest";
import { Reflector } from "@kiyasov/elysia-nest";
import type { ExecutionContext } from "@kiyasov/elysia-nest";
import {
  ARGS_METADATA,
  CONTEXT_METADATA,
  ENUM_METADATA,
  INFO_METADATA,
  PARENT_METADATA,
  RESOLVER_METADATA,
  UNION_TYPE_METADATA,
} from "./decorators/constants";
import { Float, ID, Int } from "./decorators/type.decorator";
import type { BuildSchemaOptions } from "./interfaces";
import {
  type ResolverFieldMetadata,
  type TypeFieldMetadata,
  typeMetadataStorage,
} from "./storages/type-metadata.storage";

type Constructor<T = unknown> = new (...args: unknown[]) => T;
type UnionTypeFactoryMetadata = {
  name: string;
  types: () => readonly Constructor[];
  resolveType?: (value: unknown) => string | Constructor | null;
  description?: string;
};

/**
 * Builds a GraphQL schema from decorator metadata stored in {@link typeMetadataStorage}.
 * Follows the code-first schema generation pattern.
 */
export class SchemaBuilder {
  private readonly container: Container;
  private readonly buildSchemaOptions: BuildSchemaOptions;
  /** Named types indexed by GraphQL type name */
  private readonly types = new Map<string, GraphQLNamedType>();
  /** Types indexed by their TypeScript constructor for fast lookup */
  private readonly typesByConstructor = new Map<object, GraphQLNamedType>();
  /** Cache for inheritance-resolved field lists */
  private readonly fieldsCache = new Map<Constructor, TypeFieldMetadata[]>();

  constructor(
    container: Container,
    buildSchemaOptions: BuildSchemaOptions = {},
  ) {
    this.container = container;
    this.buildSchemaOptions = buildSchemaOptions;
  }

  /**
   * Builds and returns the complete GraphQL schema from registered metadata.
   * Registers all object types, input types, enums, and scalars, then assembles
   * the root Query / Mutation / Subscription types.
   */
  buildSchema(): GraphQLSchema {
    this.buildEnums();
    this.buildScalars();
    this.buildObjectTypes();
    this.buildInputTypes();

    const queryFields = this.buildOperationFields(
      typeMetadataStorage.getQueries(),
    );
    const mutationFields = this.buildOperationFields(
      typeMetadataStorage.getMutations(),
    );
    const subscriptionFields = this.buildSubscriptionFields();

    const queryType =
      Object.keys(queryFields).length > 0
        ? new GraphQLObjectType({ name: "Query", fields: queryFields })
        : null;

    const mutationType =
      Object.keys(mutationFields).length > 0
        ? new GraphQLObjectType({ name: "Mutation", fields: mutationFields })
        : null;

    const subscriptionType =
      Object.keys(subscriptionFields).length > 0
        ? new GraphQLObjectType({
            name: "Subscription",
            fields: subscriptionFields,
          })
        : null;

    if (!queryType && !mutationType && !subscriptionType) {
      throw new Error(
        "No GraphQL operations found. Decorate at least one method with @Query, @Mutation, or @Subscription.",
      );
    }

    return new GraphQLSchema({
      query: queryType ?? undefined,
      mutation: mutationType ?? undefined,
      subscription: subscriptionType ?? undefined,
      types: Array.from(this.types.values()),
    });
  }

  // ── Type builders ────────────────────────────────────────────────────────────

  private buildObjectTypes(): void {
    for (const typeMeta of typeMetadataStorage.getObjectTypes()) {
      const name = typeMeta.name ?? (typeMeta.target as Constructor).name;
      if (!name) {
        continue;
      }

      const target = typeMeta.target as Constructor;
      const objectType = new GraphQLObjectType({
        name,
        description: typeMeta.description,
        fields: () => this.buildObjectTypeFields(target, name),
      });

      this.types.set(name, objectType);
      this.typesByConstructor.set(target, objectType);
    }
  }

  private buildInputTypes(): void {
    for (const typeMeta of typeMetadataStorage.getInputTypes()) {
      const name = typeMeta.name ?? (typeMeta.target as Constructor).name;
      if (!name) {
        continue;
      }

      const target = typeMeta.target as Constructor;
      const inputType = new GraphQLInputObjectType({
        name,
        description: typeMeta.description,
        fields: () => this.buildInputFields(this.collectFields(target)),
      });

      this.types.set(name, inputType);
      this.typesByConstructor.set(target, inputType);
    }
  }

  private buildEnums(): void {
    for (const enumMeta of typeMetadataStorage.getEnums()) {
      const name = enumMeta.name ?? (enumMeta.target as Constructor).name;
      if (!name) {
        continue;
      }

      const enumObj = enumMeta.target as unknown as Record<
        string,
        string | number
      >;
      const values: Record<string, { value: unknown }> = {};
      for (const [key, rawValue] of Object.entries(enumObj)) {
        if (this.isValidEnumName(key)) {
          values[key] = { value: rawValue };
          continue;
        }

        if (
          typeof rawValue === "string" &&
          this.isValidEnumName(rawValue) &&
          !(rawValue in values)
        ) {
          values[rawValue] = { value: key };
        }
      }

      const enumType = new GraphQLEnumType({
        name,
        description: enumMeta.description,
        values,
      });
      this.types.set(name, enumType);
      this.typesByConstructor.set(enumMeta.target as Constructor, enumType);
    }
  }

  private buildScalars(): void {
    for (const scalarMeta of typeMetadataStorage.getScalars()) {
      const name = scalarMeta.name ?? (scalarMeta.target as Constructor).name;
      if (!name) {
        continue;
      }

      const scalarClass = scalarMeta.target as Constructor;
      const staticImpl = scalarClass as unknown as {
        parseValue?: (value: unknown) => unknown;
        serialize?: (value: unknown) => unknown;
        parseLiteral?: (ast: unknown) => unknown;
        description?: string;
      };
      const instanceImpl = this.tryCreateScalarInstance(scalarClass);
      const parseValue = instanceImpl?.parseValue
        ? instanceImpl.parseValue.bind(instanceImpl)
        : staticImpl.parseValue?.bind(staticImpl);
      const serialize = instanceImpl?.serialize
        ? instanceImpl.serialize.bind(instanceImpl)
        : staticImpl.serialize?.bind(staticImpl);
      const parseLiteral = instanceImpl?.parseLiteral
        ? instanceImpl.parseLiteral.bind(instanceImpl)
        : staticImpl.parseLiteral?.bind(staticImpl);

      const scalarType = new GraphQLScalarType({
        name,
        description:
          scalarMeta.description ??
          instanceImpl?.description ??
          staticImpl.description,
        parseValue,
        serialize,
        parseLiteral,
      });

      this.types.set(name, scalarType);
      this.typesByConstructor.set(scalarClass, scalarType);

      const mappedType = scalarMeta.typeFn?.();
      if (typeof mappedType === "function") {
        this.typesByConstructor.set(mappedType as Constructor, scalarType);
      }
    }
  }

  private tryCreateScalarInstance(scalarClass: Constructor): {
    parseValue?: (value: unknown) => unknown;
    serialize?: (value: unknown) => unknown;
    parseLiteral?: (ast: unknown) => unknown;
    description?: string;
  } | null {
    try {
      return new (scalarClass as new () => {
        parseValue?: (value: unknown) => unknown;
        serialize?: (value: unknown) => unknown;
        parseLiteral?: (ast: unknown) => unknown;
        description?: string;
      })();
    } catch {
      return null;
    }
  }

  // ── Field builders ───────────────────────────────────────────────────────────

  /**
   * Collects all fields for a type, merging inherited fields (parent fields
   * can be overridden by child fields with the same name).
   * Results are cached per constructor.
   */
  private collectFields(target: Constructor): TypeFieldMetadata[] {
    const cached = this.fieldsCache.get(target);
    if (cached) {
      return cached;
    }

    const parent = Object.getPrototypeOf(target) as Constructor | null;
    const parentFields =
      parent && parent !== Function.prototype ? this.collectFields(parent) : [];

    const ownFields = typeMetadataStorage.getFieldsByConstructor(target);
    const fieldMap = new Map<string, TypeFieldMetadata>();
    for (const f of parentFields) {
      fieldMap.set(f.name, f);
    }
    for (const f of ownFields) {
      fieldMap.set(f.name, f);
    }

    const result = Array.from(fieldMap.values());
    this.fieldsCache.set(target, result);
    return result;
  }

  private buildOutputFields(
    fields: TypeFieldMetadata[],
  ): GraphQLFieldConfigMap<unknown, unknown> {
    const result: GraphQLFieldConfigMap<unknown, unknown> = {};
    for (const f of fields) {
      const incompatibility =
        f.defaultValue !== undefined
          ? this.getOutputDefaultValueIncompatibility(
              f.typeFn?.(),
              f.defaultValue,
            )
          : null;
      if (incompatibility) {
        const ownerName = this.getFieldOwnerName(f.target);
        const location = f.sourceLocation
          ? ` (defined at ${f.sourceLocation})`
          : "";
        throw new Error(
          `Invalid defaultValue for output field "${ownerName}.${f.name}": ${String(f.defaultValue)}.${location} ${incompatibility}`,
        );
      }

      result[f.name] = {
        type: this.resolveOutputType(f.typeFn, f.nullable),
        description: f.description,
        deprecationReason: f.deprecationReason,
        resolve: (parent: unknown) => {
          const record = parent as Record<string, unknown>;
          const value = record[f.name];
          if (value !== null && value !== undefined) {
            return value;
          }
          if (f.defaultValue === undefined) {
            return value;
          }
          return f.defaultValue;
        },
      };
    }
    return result;
  }

  private getOutputDefaultValueIncompatibility(
    rawType: unknown,
    defaultValue: unknown,
  ): string | null {
    if (
      typeof rawType === "object" &&
      rawType !== null &&
      "name" in rawType &&
      "serialize" in rawType &&
      typeof (rawType as { serialize: unknown }).serialize === "function"
    ) {
      const scalarName =
        typeof (rawType as { name: unknown }).name === "string"
          ? (rawType as { name: string }).name
          : "UnknownScalar";
      try {
        (rawType as { serialize: (value: unknown) => unknown }).serialize(
          defaultValue,
        );
        return null;
      } catch (error) {
        const reason =
          error instanceof Error ? error.message : "Scalar serialize failed";
        return `Expected value compatible with GraphQL scalar "${scalarName}". ${reason}`;
      }
    }

    return null;
  }

  private getFieldOwnerName(target: object): string {
    if (typeof target === "function" && target.name) {
      return target.name;
    }

    const ctor = (target as { constructor?: { name?: string } }).constructor;
    if (ctor?.name) {
      return ctor.name;
    }

    return "UnknownType";
  }

  private buildObjectTypeFields(
    target: Constructor,
    objectTypeName: string,
  ): GraphQLFieldConfigMap<unknown, unknown> {
    const fields = this.buildOutputFields(this.collectFields(target));
    const fieldResolvers = typeMetadataStorage
      .getFieldResolvers()
      .filter((resolverMeta) =>
        this.isFieldResolverForType(resolverMeta, target, objectTypeName),
      );

    for (const resolverMeta of fieldResolvers) {
      const existingField = fields[resolverMeta.name];
      const resolverType = resolverMeta.returnType
        ? this.resolveOutputType(resolverMeta.returnType, resolverMeta.nullable)
        : (existingField?.type ??
          this.resolveOutputType(undefined, resolverMeta.nullable));

      fields[resolverMeta.name] = {
        type: resolverType,
        description: resolverMeta.description ?? existingField?.description,
        deprecationReason:
          resolverMeta.deprecationReason ?? existingField?.deprecationReason,
        args: this.buildArgDefinitions(resolverMeta),
        resolve: this.createResolver(resolverMeta),
      };
    }

    return fields;
  }

  private isFieldResolverForType(
    resolverMeta: ResolverFieldMetadata,
    objectTypeCtor: Constructor,
    objectTypeName: string,
  ): boolean {
    const resolverClass = (resolverMeta.target as { constructor: Constructor })
      .constructor;
    const resolverOptions = Reflect.getMetadata(
      RESOLVER_METADATA,
      resolverClass,
    ) as
      | {
          name?: string | Constructor;
          type?: () => Constructor;
        }
      | undefined;

    const explicitType = resolverOptions?.type?.();
    if (explicitType) {
      return explicitType === objectTypeCtor;
    }

    if (typeof resolverOptions?.name === "function") {
      return resolverOptions.name === objectTypeCtor;
    }

    if (typeof resolverOptions?.name === "string") {
      return resolverOptions.name === objectTypeName;
    }

    return false;
  }

  private buildInputFields(
    fields: TypeFieldMetadata[],
  ): GraphQLInputFieldConfigMap {
    const result: GraphQLInputFieldConfigMap = {};
    for (const f of fields) {
      result[f.name] = {
        type: this.resolveInputType(f.typeFn, f.nullable),
        description: f.description,
        deprecationReason: f.deprecationReason,
        defaultValue: f.defaultValue,
      };
    }
    return result;
  }

  // ── Operation builders ────────────────────────────────────────────────────────

  private buildOperationFields(
    operations: ResolverFieldMetadata[],
  ): GraphQLFieldConfigMap<unknown, unknown> {
    const fields: GraphQLFieldConfigMap<unknown, unknown> = {};
    for (const op of operations) {
      fields[op.name] = {
        type: this.resolveOutputType(op.returnType, op.nullable),
        description: op.description,
        deprecationReason: op.deprecationReason,
        args: this.buildArgDefinitions(op),
        resolve: this.createResolver(op),
      };
    }
    return fields;
  }

  private buildSubscriptionFields(): GraphQLFieldConfigMap<unknown, unknown> {
    const fields: GraphQLFieldConfigMap<unknown, unknown> = {};
    for (const sub of typeMetadataStorage.getSubscriptions()) {
      fields[sub.name] = {
        type: this.resolveOutputType(sub.returnType, sub.nullable),
        description: sub.description,
        deprecationReason: sub.deprecationReason,
        args: this.buildArgDefinitions(sub),
        // subscribe calls the resolver method (with Guards) to get AsyncIterator
        subscribe: this.createResolver(sub),
        // resolve extracts the field with the subscription name from payload
        resolve: (payload: unknown) => (payload as Record<string, unknown>)[sub.name],
      };
    }
    return fields;
  }

  /** Converts stored arg metadata into a GraphQL argument definition map. */
  private buildArgDefinitions(
    op: ResolverFieldMetadata,
  ): Record<
    string,
    { type: GraphQLInputType; description?: string; defaultValue?: unknown }
  > {
    const args: Record<
      string,
      { type: GraphQLInputType; description?: string; defaultValue?: unknown }
    > = {};
    for (const arg of op.args) {
      args[arg.name] = {
        type: this.resolveInputType(arg.typeFn, arg.nullable),
        description: arg.description,
        defaultValue: arg.defaultValue,
      };
    }
    return args;
  }

  // ── Type resolution ──────────────────────────────────────────────────────────

  private resolveOutputType(
    typeFn: (() => unknown) | undefined,
    nullable?: boolean,
  ): GraphQLOutputType {
    const raw = typeFn ? typeFn() : undefined;
    return this.resolveScalarOrRef(raw, nullable) as GraphQLOutputType;
  }

  private resolveInputType(
    typeFn: (() => unknown) | undefined,
    nullable?: boolean,
  ): GraphQLInputType {
    const raw = typeFn ? typeFn() : undefined;
    return this.resolveScalarOrRef(raw, nullable) as GraphQLInputType;
  }

  /**
   * Resolves a raw type value (JS primitive class, marker class, or array) to
   * a GraphQL named type, wrapping in NonNull when not nullable.
   */
  private resolveScalarOrRef(
    value: unknown,
    nullable: boolean | undefined,
  ): GraphQLOutputType | GraphQLInputType {
    if (Array.isArray(value)) {
      const inner = this.resolveScalarOrRef(value[0], false);
      const list = new GraphQLList(
        inner as GraphQLOutputType & GraphQLInputType,
      );
      return nullable ? list : new GraphQLNonNull(list);
    }

    let gqlType: GraphQLOutputType | GraphQLInputType;

    const scalarFromMap = this.buildSchemaOptions.scalarsMap?.find(
      (item) => item.type === value,
    )?.scalar;
    const scalarFromRegisteredType =
      value && (typeof value === "function" || typeof value === "object")
        ? this.typesByConstructor.get(value as object)
        : undefined;

    if (scalarFromMap) {
      gqlType = scalarFromMap;
    } else if (scalarFromRegisteredType) {
      gqlType = scalarFromRegisteredType as GraphQLOutputType;
    } else if (value instanceof GraphQLScalarType) {
      gqlType = value;
    } else if (this.isGraphQLScalarTypeLike(value)) {
      gqlType = value as GraphQLScalarType;
    } else if (value === String) {
      gqlType = GraphQLString;
    } else if (value === Boolean) {
      gqlType = GraphQLBoolean;
    } else if (value === Int) {
      gqlType = GraphQLInt;
    } else if (value === Float) {
      gqlType = GraphQLFloat;
    } else if (value === Number) {
      gqlType =
        this.buildSchemaOptions.numberScalarMode === "integer"
          ? GraphQLInt
          : GraphQLFloat;
    } else if (value === ID) {
      gqlType = GraphQLID;
    } else if (value === Date) {
      gqlType =
        this.buildSchemaOptions.dateScalarMode === "timestamp"
          ? GraphQLInt
          : GraphQLString;
    } else if (typeof value === "function") {
      const ctor = value as Constructor;
      const unionMetadata = Reflect.getMetadata(UNION_TYPE_METADATA, ctor) as
        | UnionTypeFactoryMetadata
        | undefined;

      if (unionMetadata) {
        const existingUnion = this.types.get(unionMetadata.name);
        if (existingUnion instanceof GraphQLUnionType) {
          gqlType = existingUnion;
        } else {
          const unionType = new GraphQLUnionType({
            name: unionMetadata.name,
            description: unionMetadata.description,
            types: () =>
              unionMetadata.types().map((memberCtor) => {
                const member =
                  this.typesByConstructor.get(memberCtor) ??
                  this.types.get(memberCtor.name);

                if (!(member instanceof GraphQLObjectType)) {
                  throw new Error(
                    `Union member "${memberCtor.name}" for union "${unionMetadata.name}" is not a GraphQLObjectType`,
                  );
                }

                return member;
              }),
            resolveType: unionMetadata.resolveType
              ? (unionValue: unknown) => {
                  const resolved = unionMetadata.resolveType?.(unionValue);
                  if (!resolved) {
                    return undefined;
                  }
                  if (typeof resolved === "string") {
                    return resolved;
                  }

                  const resolvedType =
                    this.typesByConstructor.get(resolved) ??
                    this.types.get(resolved.name);

                  return resolvedType instanceof GraphQLObjectType
                    ? resolvedType.name
                    : undefined;
                }
              : undefined,
          });

          this.types.set(unionMetadata.name, unionType);
          this.typesByConstructor.set(ctor, unionType);
          gqlType = unionType;
        }
      } else {
        const known =
          (ctor.name ? this.types.get(ctor.name) : undefined) ??
          this.typesByConstructor.get(ctor);
        if (known) {
          gqlType = known as GraphQLOutputType;
        } else {
          const typeName = ctor.name ?? String(ctor);
          throw new Error(
            `[GraphQL] Cannot determine GraphQL type for "${typeName}". ` +
              `Provide an explicit type factory: @Field(() => ${typeName}). ` +
              `If this is an enum, make sure to call registerEnumType(${typeName}, { name: '${typeName}' }).`,
          );
        }
      }
    } else if (value !== undefined && value !== null) {
      // Plain object (e.g. unregistered enum) — check ENUM_METADATA for the name
      const enumMeta = Reflect.getMetadata(ENUM_METADATA, value) as
        | { name: string }
        | undefined;
      const typeName =
        enumMeta?.name ??
        (value as { name?: string }).name ??
        String(value);
      throw new Error(
        `[GraphQL] Cannot determine GraphQL type for "${typeName}". ` +
          `If this is an enum, call registerEnumType(${typeName}, { name: '${typeName}' }) ` +
          `and use @Field(() => ${typeName}).`,
      );
    } else {
      throw new Error(
        `[GraphQL] @Field() type could not be inferred. ` +
          `Provide an explicit type factory: @Field(() => YourType).`,
      );
    }

    return nullable ? gqlType : new GraphQLNonNull(gqlType);
  }

  private isGraphQLScalarTypeLike(value: unknown): value is GraphQLScalarType {
    return (
      typeof value === "object" &&
      value !== null &&
      "name" in value &&
      "serialize" in value &&
      "parseValue" in value &&
      "parseLiteral" in value
    );
  }

  private isValidEnumName(value: string): boolean {
    return /^[_A-Za-z][_0-9A-Za-z]*$/.test(value);
  }

  // ── Resolver factory ─────────────────────────────────────────────────────────

  /**
   * Creates a GraphQL resolver function for the given operation metadata.
   * Resolves the resolver class instance from DI, then maps @Args, @Parent,
   * @Context, and @Info decorator metadata to the correct parameter positions.
   */
  private createResolver(
    metadata: ResolverFieldMetadata,
  ): GraphQLFieldResolver<unknown, unknown> {
    return async (parent, args, context, info) => {
      const resolverClass = (metadata.target as { constructor: Constructor })
        .constructor;
      await this.runGuards(resolverClass, metadata.methodName, [
        parent,
        args,
        context,
        info,
      ]);
      const instance = (await this.container.get(resolverClass)) as Record<
        string,
        (...params: unknown[]) => unknown
      >;

      if (!instance) {
        throw new Error(
          `Could not resolve instance of "${resolverClass.name}"`,
        );
      }

      const method = instance[metadata.methodName];
      if (typeof method !== "function") {
        throw new Error(
          `Method "${metadata.methodName}" not found on "${resolverClass.name}"`,
        );
      }

      const resolvedParams: unknown[] = [];
      const executionContext = this.createGraphQLExecutionContext(
        resolverClass,
        metadata.methodName,
        [parent, args, context, info],
      ) as unknown as ExecutionContext;

      // @Args - map by argument name from GraphQL args object
      for (const arg of metadata.args) {
        resolvedParams[arg.index] = args[arg.name];
      }

      const argsMetas = Reflect.getMetadata(
        ARGS_METADATA,
        metadata.target,
        metadata.methodName,
      ) as Array<{ index: number; name?: string }> | undefined;
      for (const argMeta of argsMetas ?? []) {
        if (!argMeta.name) {
          resolvedParams[argMeta.index] = args;
        }
      }

      // @Parent / @Root
      const parentMetas = Reflect.getMetadata(
        PARENT_METADATA,
        metadata.target,
        metadata.methodName,
      ) as Array<{ index: number }> | undefined;
      for (const p of parentMetas ?? []) {
        resolvedParams[p.index] = parent;
      }

      // @Context / @Ctx
      const ctxMetas = Reflect.getMetadata(
        CONTEXT_METADATA,
        metadata.target,
        metadata.methodName,
      ) as Array<{ index: number; property?: string }> | undefined;
      for (const c of ctxMetas ?? []) {
        if (
          c.property &&
          typeof context === "object" &&
          context !== null &&
          c.property in context
        ) {
          resolvedParams[c.index] = (context as Record<string, unknown>)[
            c.property
          ];
        } else {
          resolvedParams[c.index] = context;
        }
      }

      // @Info
      const infoMetas = Reflect.getMetadata(
        INFO_METADATA,
        metadata.target,
        metadata.methodName,
      ) as Array<{ index: number }> | undefined;
      for (const i of infoMetas ?? []) {
        resolvedParams[i.index] = info;
      }

      const paramMetas =
        (Reflect.getMetadata(
          PARAMS_METADATA,
          resolverClass,
          metadata.methodName,
        ) as ParamMetadata[] | undefined) ?? [];
      for (const paramMeta of paramMetas) {
        if (!paramMeta.factory || paramMeta.type !== "__factory__") {
          continue;
        }
        resolvedParams[paramMeta.index] = await paramMeta.factory(
          paramMeta.data,
          executionContext,
        );
      }

      return method.apply(instance, resolvedParams);
    };
  }

  private async runGuards(
    resolverClass: Constructor,
    methodName: string,
    gqlArgs: [unknown, Record<string, unknown>, unknown, unknown],
  ): Promise<void> {
    const classGuards =
      (Reflect.getMetadata(GUARDS_METADATA, resolverClass) as unknown[]) ?? [];
    const methodGuards =
      (Reflect.getMetadata(
        GUARDS_METADATA,
        resolverClass,
        methodName,
      ) as unknown[]) ?? [];
    const guards = [...classGuards, ...methodGuards];
    if (guards.length === 0) {
      return;
    }

    const executionContext = this.createGraphQLExecutionContext(
      resolverClass,
      methodName,
      gqlArgs,
    );

    for (const guardToken of guards) {
      const guard = await this.resolveGuard(guardToken);
      if (
        !guard ||
        typeof (guard as { canActivate?: unknown }).canActivate !== "function"
      ) {
        continue;
      }
      const allowed = await (
        guard as {
          canActivate: (context: unknown) => boolean | Promise<boolean>;
        }
      ).canActivate(executionContext);
      if (!allowed) {
        throw new Error("Forbidden resource");
      }
    }
  }

  private async resolveGuard(guardToken: unknown): Promise<unknown> {
    if (typeof guardToken !== "function") {
      return guardToken;
    }
    const ctor = guardToken as Constructor;
    const fromContainer = await this.container.get(ctor);
    if (fromContainer) {
      return fromContainer;
    }

    this.container.register([Reflector, ctor]);
    const resolved = await this.container.get(ctor);
    if (resolved) {
      return resolved;
    }

    throw new Error(
      `Guard "${ctor.name}" could not be resolved from the DI container. Make sure it is registered as a provider.`,
    );
  }

  private createGraphQLExecutionContext(
    resolverClass: Constructor,
    methodName: string,
    gqlArgs: [unknown, Record<string, unknown>, unknown, unknown],
  ): {
    getClass: () => Constructor;
    getHandler: () => (...args: unknown[]) => unknown;
    getArgByIndex: (index: number) => unknown;
    getArgs: () => [unknown, Record<string, unknown>, unknown, unknown];
    getType: () => "graphql";
    switchToHttp: () => {
      getRequest: () => unknown;
      getResponse: () => unknown;
    };
    switchToRpc: () => { getData: () => unknown; getContext: () => unknown };
    switchToWs: () => { getData: () => unknown; getClient: () => unknown };
  } {
    const [parent, args, ctx, info] = gqlArgs;
    const handlerTarget = resolverClass.prototype as Record<string, unknown>;

    return {
      getClass: () => resolverClass,
      getHandler: () =>
        (handlerTarget[methodName] as (...params: unknown[]) => unknown) ??
        (() => undefined),
      getArgByIndex: (index: number) => gqlArgs[index] as unknown,
      getArgs: () => [parent, args, ctx, info],
      getType: () => "graphql",
      switchToHttp: () => ({
        getRequest: () => ctx,
        getResponse: () => undefined,
      }),
      switchToRpc: () => ({
        getData: () => undefined,
        getContext: () => ctx,
      }),
      switchToWs: () => ({
        getData: () => undefined,
        getClient: () => undefined,
      }),
    };
  }
}
