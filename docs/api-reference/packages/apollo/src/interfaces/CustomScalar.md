# Interface: CustomScalar\<TExternal, TInternal\>

Defined in: [packages/apollo/src/decorators/type.decorator.ts:362](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L362)

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

Defined in: [packages/apollo/src/decorators/type.decorator.ts:370](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L370)

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

Defined in: [packages/apollo/src/decorators/type.decorator.ts:366](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L366)

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

Defined in: [packages/apollo/src/decorators/type.decorator.ts:368](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L368)

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
| <a id="description"></a> `description` | `string` | Description of the scalar type. | [packages/apollo/src/decorators/type.decorator.ts:364](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L364) |
