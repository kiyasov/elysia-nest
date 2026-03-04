# Type Alias: TriggerTransform()

```ts
type TriggerTransform = (trigger, options) => string;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L39)

A function that maps a trigger name (plus subscription options) to the
Redis channel key that will actually be subscribed to.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `trigger` | `string` |
| `options` | [`SubscriptionOptions`](../interfaces/SubscriptionOptions.md) |

## Returns

`string`
