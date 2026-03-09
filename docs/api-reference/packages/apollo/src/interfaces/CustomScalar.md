# Interface: CustomScalar\<TExternal, TInternal\>

Defined in: [packages/apollo/src/decorators/type.decorator.ts:387](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L387)

Interface for custom scalars.

## Type Parameters

| Type Parameter |
| ------ |
| `TExternal` |
| `TInternal` |

## Methods

### parseLiteral()

```ts
parseLiteral(value): TInternal | null;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:395](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L395)

Parses a literal AST node to internal representation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

`TInternal` \| `null`

***

### parseValue()

```ts
parseValue(value): TInternal;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:391](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L391)

Parses an external value to internal representation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `TExternal` |

#### Returns

`TInternal`

***

### serialize()

```ts
serialize(value): TExternal;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:393](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L393)

Serializes an internal value to external representation.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `TInternal` |

#### Returns

`TExternal`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="description"></a> `description` | `string` | Description of the scalar type. | [packages/apollo/src/decorators/type.decorator.ts:389](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L389) |
