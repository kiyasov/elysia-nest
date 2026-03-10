# Function: createEdgeType()

```ts
function createEdgeType<T>(NodeType): AnyConstructor;
```

Defined in: [packages/apollo/src/pagination.ts:76](https://github.com/kiyasov/nestelia/blob/main/packages/apollo/src/pagination.ts#L76)

Creates a Relay-style Edge type for a given node class.
Fields: `node`, `cursor`.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `NodeType` | `Constructor`\<`T`\> |

## Returns

`AnyConstructor`

## Public Api
