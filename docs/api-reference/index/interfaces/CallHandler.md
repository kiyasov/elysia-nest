# Interface: CallHandler\<T\>

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L32)

Call handler interface for interceptors

## Public Api

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

## Methods

### handle()

```ts
handle(): Observable<T>;
```

Defined in: [packages/core/src/interceptors/interceptor.interface.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/interceptor.interface.ts#L36)

Returns an Observable representing the response stream

#### Returns

`Observable`\<`T`\>
