# Function: getCatchExceptionsMetadata()

```ts
function getCatchExceptionsMetadata(target): (...args) => Error[] | undefined;
```

Defined in: [packages/core/src/exceptions/catch.decorator.ts:46](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/exceptions/catch.decorator.ts#L46)

Get the exception types that a filter catches

## Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `object` |

## Returns

(...`args`) => `Error`[] \| `undefined`
