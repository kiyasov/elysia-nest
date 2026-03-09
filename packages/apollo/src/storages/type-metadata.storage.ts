import "reflect-metadata";

import type {
  EnumMetadata,
  InputTypeMetadata,
  InterfaceTypeMetadata,
  ObjectTypeMetadata,
  ScalarMetadata,
  UnionMetadata,
} from "../decorators/types";

/** Metadata for a field in a GraphQL type. */
export interface TypeFieldMetadata {
  /** Field name. */
  name: string;
  /** Function returning the field type. */
  typeFn?: () => unknown;
  /** Whether the field can be null. */
  nullable?: boolean;
  /** Field description. */
  description?: string;
  /** Deprecation reason. */
  deprecationReason?: string;
  /** Default value. */
  defaultValue?: unknown;
  /** Target object (for debugging). */
  target: object;
  /** Source location where the field was defined. */
  sourceLocation?: string;
}

/** Metadata for a resolver field (query, mutation, subscription, or field resolver). */
export interface ResolverFieldMetadata {
  /** Kind of resolver field. */
  kind: "query" | "mutation" | "subscription" | "fieldResolver";
  /** Target class prototype. */
  target: object;
  /** Method name. */
  methodName: string;
  /** Field name in schema. */
  name: string;
  /** Function returning the return type. */
  returnType?: () => unknown;
  /** Whether the field can be null. */
  nullable?: boolean;
  /** Default value. */
  defaultValue?: unknown;
  /** Description. */
  description?: string;
  /** Deprecation reason. */
  deprecationReason?: string;
  /** Argument definitions. */
  args: Array<{
    name: string;
    typeFn?: () => unknown;
    nullable?: boolean;
    description?: string;
    defaultValue?: unknown;
    index: number;
  }>;
}

/**
 * Global storage for GraphQL type metadata.
 * Fields are stored separately from type declarations.
 * globalThis ensures a single instance even with symlink-based module resolution.
 */
export class TypeMetadataStorage {
  // Type registrations (only classes decorated with @ObjectType / @InputType)
  private objectTypes = new Map<object, ObjectTypeMetadata>();
  private inputTypes = new Map<object, InputTypeMetadata>();
  private interfaceTypes = new Map<object, InterfaceTypeMetadata>();
  private enums = new Map<object, EnumMetadata>();
  private scalars = new Map<object, ScalarMetadata>();
  private unions = new Map<object, UnionMetadata>();

  // Fields stored separately keyed by constructor — populated by @Field()
  private fieldsByConstructor = new Map<object, TypeFieldMetadata[]>();

  // Resolver operations
  private queries: ResolverFieldMetadata[] = [];
  private mutations: ResolverFieldMetadata[] = [];
  private subscriptions: ResolverFieldMetadata[] = [];
  private fieldResolvers: ResolverFieldMetadata[] = [];

  /**
   * Clears all registered metadata in-place.
   * Preserves the same instance so module-level imports remain valid.
   */
  clear(): void {
    this.objectTypes = new Map();
    this.inputTypes = new Map();
    this.interfaceTypes = new Map();
    this.enums = new Map();
    this.scalars = new Map();
    this.unions = new Map();
    this.fieldsByConstructor = new Map();
    this.queries = [];
    this.mutations = [];
    this.subscriptions = [];
    this.fieldResolvers = [];
  }

  /**
   * Resets the global metadata storage by clearing the singleton in-place.
   * Module-level imports of {@link typeMetadataStorage} remain valid after calling this.
   * Useful for testing to ensure clean state between test cases.
   */
  static reset(): void {
    typeMetadataStorage.clear();
  }

  // ── Type registrations ──────────────────────────────────────────────────────

  /**
   * Registers an object type.
   * @param target - The class constructor.
   * @param metadata - Object type metadata.
   */
  addObjectType(target: object, metadata: ObjectTypeMetadata): void {
    this.objectTypes.set(target, {
      ...this.objectTypes.get(target),
      ...metadata,
    });
  }

  /**
   * Registers an input type.
   * @param target - The class constructor.
   * @param metadata - Input type metadata.
   */
  addInputType(target: object, metadata: InputTypeMetadata): void {
    this.inputTypes.set(target, {
      ...this.inputTypes.get(target),
      ...metadata,
    });
  }

  /**
   * Registers an interface type.
   * @param target - The class constructor.
   * @param metadata - Interface type metadata.
   */
  addInterfaceType(target: object, metadata: InterfaceTypeMetadata): void {
    this.interfaceTypes.set(target, metadata);
  }

  /**
   * Registers an enum type.
   * @param target - The enum object.
   * @param metadata - Enum metadata.
   */
  addEnum(target: object, metadata: EnumMetadata): void {
    this.enums.set(target, metadata);
  }

  /**
   * Registers a scalar type.
   * @param target - The class constructor.
   * @param metadata - Scalar metadata.
   */
  addScalar(target: object, metadata: ScalarMetadata): void {
    this.scalars.set(target, metadata);
  }

  /**
   * Registers a union type.
   * @param target - The class constructor.
   * @param metadata - Union metadata.
   */
  addUnion(target: object, metadata: UnionMetadata): void {
    this.unions.set(target, metadata);
  }

  // ── Field registration (called by @Field()) ─────────────────────────────────

  /**
   * Adds a field to a type.
   * @param constructor - The class constructor.
   * @param field - Field metadata.
   */
  addField(constructor: object, field: TypeFieldMetadata): void {
    const existing = this.fieldsByConstructor.get(constructor);
    if (existing) {
      existing.push(field);
    } else {
      this.fieldsByConstructor.set(constructor, [field]);
    }
  }

  /**
   * Gets all fields for a constructor.
   * @param constructor - The class constructor.
   * @returns Array of field metadata.
   */
  getFieldsByConstructor(constructor: object): TypeFieldMetadata[] {
    return this.fieldsByConstructor.get(constructor) ?? [];
  }

  /**
   * Removes a field from a type.
   * @param constructor - The class constructor.
   * @param fieldName - Name of the field to remove.
   */
  removeField(constructor: object, fieldName: string): void {
    const fields = this.fieldsByConstructor.get(constructor);
    if (fields) {
      const idx = fields.findIndex((f) => f.name === fieldName);
      if (idx !== -1) {
        fields.splice(idx, 1);
      }
    }
  }

  // ── Resolver operations ─────────────────────────────────────────────────────

  /**
   * Registers a query resolver.
   * @param metadata - Query metadata.
   */
  addQuery(metadata: ResolverFieldMetadata): void {
    this.queries.push(metadata);
  }

  /**
   * Registers a mutation resolver.
   * @param metadata - Mutation metadata.
   */
  addMutation(metadata: ResolverFieldMetadata): void {
    this.mutations.push(metadata);
  }

  /**
   * Registers a subscription resolver.
   * @param metadata - Subscription metadata.
   */
  addSubscription(metadata: ResolverFieldMetadata): void {
    this.subscriptions.push(metadata);
  }

  /**
   * Registers a field resolver.
   * @param metadata - Field resolver metadata.
   */
  addFieldResolver(metadata: ResolverFieldMetadata): void {
    this.fieldResolvers.push(metadata);
  }

  // ── Getters ─────────────────────────────────────────────────────────────────

  /**
   * Gets all registered object types with their fields.
   * @returns Array of object type metadata with fields.
   */
  getObjectTypes(): Array<
    ObjectTypeMetadata & { fields: TypeFieldMetadata[]; target: object }
  > {
    return Array.from(this.objectTypes.entries()).map(([target, meta]) => ({
      ...meta,
      fields: this.fieldsByConstructor.get(target) ?? [],
      target,
    }));
  }

  /**
   * Gets all registered input types with their fields.
   * @returns Array of input type metadata with fields.
   */
  getInputTypes(): Array<
    InputTypeMetadata & { fields: TypeFieldMetadata[]; target: object }
  > {
    return Array.from(this.inputTypes.entries()).map(([target, meta]) => ({
      ...meta,
      fields: this.fieldsByConstructor.get(target) ?? [],
      target,
    }));
  }

  /**
   * Gets all registered interface types with their fields.
   * @returns Array of interface type metadata with fields.
   */
  getInterfaceTypes(): Array<
    InterfaceTypeMetadata & { fields: TypeFieldMetadata[]; target: object }
  > {
    return Array.from(this.interfaceTypes.entries()).map(([target, meta]) => ({
      ...meta,
      fields: this.fieldsByConstructor.get(target) ?? [],
      target,
    }));
  }

  /**
   * Gets all registered enums.
   * @returns Array of enum metadata.
   */
  getEnums(): Array<EnumMetadata & { target: object }> {
    return Array.from(this.enums.entries()).map(([target, meta]) => ({
      ...meta,
      target,
    }));
  }

  /**
   * Gets all registered scalars.
   * @returns Array of scalar metadata.
   */
  getScalars(): Array<ScalarMetadata & { target: object }> {
    return Array.from(this.scalars.entries()).map(([target, meta]) => ({
      ...meta,
      target,
    }));
  }

  /**
   * Gets all registered unions.
   * @returns Array of union metadata.
   */
  getUnions(): Array<UnionMetadata & { target: object }> {
    return Array.from(this.unions.entries()).map(([target, meta]) => ({
      ...meta,
      target,
    }));
  }

  /**
   * Gets all registered queries.
   * @returns Array of query metadata.
   */
  getQueries(): ResolverFieldMetadata[] {
    return this.queries;
  }

  /**
   * Gets all registered mutations.
   * @returns Array of mutation metadata.
   */
  getMutations(): ResolverFieldMetadata[] {
    return this.mutations;
  }

  /**
   * Gets all registered subscriptions.
   * @returns Array of subscription metadata.
   */
  getSubscriptions(): ResolverFieldMetadata[] {
    return this.subscriptions;
  }

  /**
   * Gets all registered field resolvers.
   * @returns Array of field resolver metadata.
   */
  getFieldResolvers(): ResolverFieldMetadata[] {
    return this.fieldResolvers;
  }
}

const g = globalThis as {
  __ElysiaGqlTypeMetadataStorage?: TypeMetadataStorage;
};

/**
 * Global singleton instance of TypeMetadataStorage.
 * Stored on globalThis to ensure a single instance across the application.
 */
export const typeMetadataStorage: TypeMetadataStorage =
  g.__ElysiaGqlTypeMetadataStorage ||
  (g.__ElysiaGqlTypeMetadataStorage = new TypeMetadataStorage());
