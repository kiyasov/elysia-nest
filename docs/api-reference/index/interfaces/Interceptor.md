# Interface: Interceptor

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L8)

Interface for request interceptors

## Methods

### intercept()

```ts
intercept(context): boolean | void | Promise<boolean | void>;
```

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L13)

Method to intercept incoming requests

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | `any` | The request context |

#### Returns

`boolean` \| `void` \| `Promise`\<`boolean` \| `void`\>
