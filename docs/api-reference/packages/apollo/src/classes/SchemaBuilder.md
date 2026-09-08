# Class: SchemaBuilder

Defined in: [packages/apollo/src/schema-builder.ts:64](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/schema-builder.ts#L64)

Builds a GraphQL schema from decorator metadata stored in [typeMetadataStorage](../variables/typeMetadataStorage.md).
Follows the code-first schema generation pattern.

## Constructors

### Constructor

```ts
new SchemaBuilder(container, buildSchemaOptions?): SchemaBuilder;
```

Defined in: [packages/apollo/src/schema-builder.ts:74](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/schema-builder.ts#L74)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `container` | [`Container`](../../../../index/classes/Container.md) |
| `buildSchemaOptions` | [`BuildSchemaOptions`](../interfaces/BuildSchemaOptions.md) |

#### Returns

`SchemaBuilder`

## Methods

### buildSchema()

```ts
buildSchema(): GraphQLSchema;
```

Defined in: [packages/apollo/src/schema-builder.ts:87](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/schema-builder.ts#L87)

Builds and returns the complete GraphQL schema from registered metadata.
Registers all object types, input types, enums, and scalars, then assembles
the root Query / Mutation / Subscription types.

#### Returns

[`GraphQLSchema`](GraphQLSchema.md)
