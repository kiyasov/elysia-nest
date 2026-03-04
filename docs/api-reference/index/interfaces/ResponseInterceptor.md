# Interface: ResponseInterceptor

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L19)

Interface for response interceptors

## Methods

### interceptAfter()

```ts
interceptAfter(context): any;
```

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L24)

Method to intercept outgoing responses

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `any` | The response context |

#### Returns

`any`
