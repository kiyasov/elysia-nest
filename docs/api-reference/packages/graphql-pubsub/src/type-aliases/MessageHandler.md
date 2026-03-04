# Type Alias: MessageHandler()\<T\>

```ts
type MessageHandler<T> = (message) => void;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L51)

Callback invoked whenever a message arrives on a subscribed trigger.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `T` |

## Returns

`void`
