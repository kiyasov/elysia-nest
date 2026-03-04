# Type Alias: MessageHandler()\<T, R\>

```ts
type MessageHandler<T, R> = (data, ctx) => Promise<R> | Observable<R> | R;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L30)

Function signature for pattern handlers registered on a [Server](../interfaces/Server.md).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |
| `R` | `unknown` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `T` |
| `ctx` | `Record`\<`string`, `unknown`\> |

## Returns

`Promise`\<`R`\> \| `Observable`\<`R`\> \| `R`
