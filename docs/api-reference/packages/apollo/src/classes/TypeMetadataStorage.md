# Class: TypeMetadataStorage

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:68](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L68)

Global storage for GraphQL type metadata.
Fields are stored separately from type declarations.
globalThis ensures a single instance even with symlink-based module resolution.

## Constructors

### Constructor

```ts
new TypeMetadataStorage(): TypeMetadataStorage;
```

#### Returns

`TypeMetadataStorage`

## Methods

### addEnum()

```ts
addEnum(target, metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:153](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L153)

Registers an enum type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The enum object. |
| `metadata` | [`EnumMetadata`](../interfaces/EnumMetadata.md) | Enum metadata. |

#### Returns

`void`

***

### addField()

```ts
addField(constructor, field): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:182](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L182)

Adds a field to a type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `constructor` | `object` | The class constructor. |
| `field` | `TypeFieldMetadata` | Field metadata. |

#### Returns

`void`

***

### addFieldResolver()

```ts
addFieldResolver(metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:245](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L245)

Registers a field resolver.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadata` | `ResolverFieldMetadata` | Field resolver metadata. |

#### Returns

`void`

***

### addInputType()

```ts
addInputType(target, metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:132](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L132)

Registers an input type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The class constructor. |
| `metadata` | [`InputTypeMetadata`](../interfaces/InputTypeMetadata.md) | Input type metadata. |

#### Returns

`void`

***

### addInterfaceType()

```ts
addInterfaceType(target, metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:144](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L144)

Registers an interface type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The class constructor. |
| `metadata` | [`InterfaceTypeMetadata`](../interfaces/InterfaceTypeMetadata.md) | Interface type metadata. |

#### Returns

`void`

***

### addMutation()

```ts
addMutation(metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:229](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L229)

Registers a mutation resolver.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadata` | `ResolverFieldMetadata` | Mutation metadata. |

#### Returns

`void`

***

### addObjectType()

```ts
addObjectType(target, metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:120](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L120)

Registers an object type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The class constructor. |
| `metadata` | [`ObjectTypeMetadata`](../interfaces/ObjectTypeMetadata.md) | Object type metadata. |

#### Returns

`void`

***

### addQuery()

```ts
addQuery(metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:221](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L221)

Registers a query resolver.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadata` | `ResolverFieldMetadata` | Query metadata. |

#### Returns

`void`

***

### addScalar()

```ts
addScalar(target, metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:162](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L162)

Registers a scalar type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The class constructor. |
| `metadata` | [`ScalarMetadata`](../interfaces/ScalarMetadata.md) | Scalar metadata. |

#### Returns

`void`

***

### addSubscription()

```ts
addSubscription(metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:237](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L237)

Registers a subscription resolver.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadata` | `ResolverFieldMetadata` | Subscription metadata. |

#### Returns

`void`

***

### addUnion()

```ts
addUnion(target, metadata): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:171](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L171)

Registers a union type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The class constructor. |
| `metadata` | [`UnionMetadata`](../interfaces/UnionMetadata.md) | Union metadata. |

#### Returns

`void`

***

### clear()

```ts
clear(): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:90](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L90)

Clears all registered metadata in-place.
Preserves the same instance so module-level imports remain valid.

#### Returns

`void`

***

### getEnums()

```ts
getEnums(): EnumMetadata & {
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:297](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L297)

Gets all registered enums.

#### Returns

[`EnumMetadata`](../interfaces/EnumMetadata.md) & \{
  `target`: `object`;
\}[]

Array of enum metadata.

***

### getFieldResolvers()

```ts
getFieldResolvers(): ResolverFieldMetadata[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:354](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L354)

Gets all registered field resolvers.

#### Returns

`ResolverFieldMetadata`[]

Array of field resolver metadata.

***

### getFieldsByConstructor()

```ts
getFieldsByConstructor(constructor): TypeFieldMetadata[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:196](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L196)

Gets all fields for a constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `constructor` | `object` | The class constructor. |

#### Returns

`TypeFieldMetadata`[]

Array of field metadata.

***

### getInputTypes()

```ts
getInputTypes(): InputTypeMetadata & {
  fields: TypeFieldMetadata[];
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:269](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L269)

Gets all registered input types with their fields.

#### Returns

[`InputTypeMetadata`](../interfaces/InputTypeMetadata.md) & \{
  `fields`: `TypeFieldMetadata`[];
  `target`: `object`;
\}[]

Array of input type metadata with fields.

***

### getInterfaceTypes()

```ts
getInterfaceTypes(): InterfaceTypeMetadata & {
  fields: TypeFieldMetadata[];
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:283](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L283)

Gets all registered interface types with their fields.

#### Returns

[`InterfaceTypeMetadata`](../interfaces/InterfaceTypeMetadata.md) & \{
  `fields`: `TypeFieldMetadata`[];
  `target`: `object`;
\}[]

Array of interface type metadata with fields.

***

### getMutations()

```ts
getMutations(): ResolverFieldMetadata[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:338](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L338)

Gets all registered mutations.

#### Returns

`ResolverFieldMetadata`[]

Array of mutation metadata.

***

### getObjectTypes()

```ts
getObjectTypes(): ObjectTypeMetadata & {
  fields: TypeFieldMetadata[];
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:255](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L255)

Gets all registered object types with their fields.

#### Returns

[`ObjectTypeMetadata`](../interfaces/ObjectTypeMetadata.md) & \{
  `fields`: `TypeFieldMetadata`[];
  `target`: `object`;
\}[]

Array of object type metadata with fields.

***

### getQueries()

```ts
getQueries(): ResolverFieldMetadata[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:330](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L330)

Gets all registered queries.

#### Returns

`ResolverFieldMetadata`[]

Array of query metadata.

***

### getScalars()

```ts
getScalars(): ScalarMetadata & {
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:308](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L308)

Gets all registered scalars.

#### Returns

[`ScalarMetadata`](../interfaces/ScalarMetadata.md) & \{
  `target`: `object`;
\}[]

Array of scalar metadata.

***

### getSubscriptions()

```ts
getSubscriptions(): ResolverFieldMetadata[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:346](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L346)

Gets all registered subscriptions.

#### Returns

`ResolverFieldMetadata`[]

Array of subscription metadata.

***

### getUnions()

```ts
getUnions(): UnionMetadata & {
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:319](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L319)

Gets all registered unions.

#### Returns

[`UnionMetadata`](../interfaces/UnionMetadata.md) & \{
  `target`: `object`;
\}[]

Array of union metadata.

***

### removeField()

```ts
removeField(constructor, fieldName): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:205](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L205)

Removes a field from a type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `constructor` | `object` | The class constructor. |
| `fieldName` | `string` | Name of the field to remove. |

#### Returns

`void`

***

### reset()

```ts
static reset(): void;
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L109)

Resets the global metadata storage by clearing the singleton in-place.
Module-level imports of [typeMetadataStorage](../variables/typeMetadataStorage.md) remain valid after calling this.
Useful for testing to ensure clean state between test cases.

#### Returns

`void`
