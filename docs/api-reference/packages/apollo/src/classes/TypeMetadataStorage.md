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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:137](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L137)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:166](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L166)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:229](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L229)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:116](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L116)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:128](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L128)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:213](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L213)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:104](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L104)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:205](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L205)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:146](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L146)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:221](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L221)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:155](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L155)

Registers a union type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The class constructor. |
| `metadata` | [`UnionMetadata`](../interfaces/UnionMetadata.md) | Union metadata. |

#### Returns

`void`

***

### getEnums()

```ts
getEnums(): EnumMetadata & {
  target: object;
}[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:281](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L281)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:338](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L338)

Gets all registered field resolvers.

#### Returns

`ResolverFieldMetadata`[]

Array of field resolver metadata.

***

### getFieldsByConstructor()

```ts
getFieldsByConstructor(constructor): TypeFieldMetadata[];
```

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:180](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L180)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:253](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L253)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:267](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L267)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:322](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L322)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:239](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L239)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:314](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L314)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:292](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L292)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:330](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L330)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:303](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L303)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:189](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L189)

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

Defined in: [packages/apollo/src/storages/type-metadata.storage.ts:90](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/storages/type-metadata.storage.ts#L90)

Resets the global metadata storage.
Useful for testing to ensure clean state.

#### Returns

`void`
