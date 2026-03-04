# Interface: NestInterceptor\<T, R\>

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L44)

Elysia-Nest interceptor interface

## Public Api

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |
| `R` | `any` |

## Methods

### intercept()

```ts
intercept(context, next): Observable<R> | Promise<Observable<R>>;
```

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:50](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L50)

Intercept the request/response stream

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](ExecutionContext.md) | The execution context |
| `next` | [`CallHandler`](CallHandler.md)\<`T`\> | The call handler |

#### Returns

`Observable`\<`R`\> \| `Promise`\<`Observable`\<`R`\>\>
