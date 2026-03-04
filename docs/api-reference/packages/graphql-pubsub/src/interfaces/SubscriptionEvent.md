# Interface: SubscriptionEvent\<T\>

Defined in: [packages/graphql-pubsub/src/interfaces.ts:66](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L66)

Metadata stored per active subscription.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="handler"></a> `handler` | [`MessageHandler`](../type-aliases/MessageHandler.md)\<`T`\> | Message callback. | [packages/graphql-pubsub/src/interfaces.ts:72](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L72) |
| <a id="id"></a> `id` | `number` | Unique subscription identifier. | [packages/graphql-pubsub/src/interfaces.ts:68](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L68) |
| <a id="ispattern"></a> `isPattern` | `boolean` | Whether this subscription uses Redis pattern-subscribe. | [packages/graphql-pubsub/src/interfaces.ts:74](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L74) |
| <a id="trigger"></a> `trigger` | `string` | Resolved Redis channel / pattern key. | [packages/graphql-pubsub/src/interfaces.ts:70](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L70) |
