# Interface: ExceptionFilter

Defined in: [packages/core/src/exceptions/exceptions.filter.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/exceptions/exceptions.filter.ts#L15)

Interface for exception filters

## Methods

### catch()

```ts
catch(exception, context): any;
```

Defined in: [packages/core/src/exceptions/exceptions.filter.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/exceptions/exceptions.filter.ts#L21)

Method to catch and handle exceptions

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `exception` | `Error` | The exception thrown |
| `context` | [`ExceptionContext`](ExceptionContext.md) | The request context |

#### Returns

`any`
