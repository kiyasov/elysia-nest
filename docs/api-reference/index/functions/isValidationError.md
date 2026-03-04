# Function: isValidationError()

```ts
function isValidationError(error): error is Error & { code: "VALIDATION"; expected?: unknown; status: number; type: string; validator?: { properties?: Record<string, unknown> } };
```

Defined in: [packages/core/src/exceptions/validation.exception.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/exceptions/validation.exception.ts#L8)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

## Returns

`error is Error & { code: "VALIDATION"; expected?: unknown; status: number; type: string; validator?: { properties?: Record<string, unknown> } }`
