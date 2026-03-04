# Function: parseValidationError()

```ts
function parseValidationError(error): ValidationErrorDetails;
```

Defined in: [packages/core/src/exceptions/validation.exception.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/exceptions/validation.exception.ts#L22)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | \{ `message`: `string`; `type?`: `string`; `validator?`: `Record`\<`string`, `unknown`\>; \} |
| `error.message` | `string` |
| `error.type?` | `string` |
| `error.validator?` | `Record`\<`string`, `unknown`\> |

## Returns

[`ValidationErrorDetails`](../interfaces/ValidationErrorDetails.md)
