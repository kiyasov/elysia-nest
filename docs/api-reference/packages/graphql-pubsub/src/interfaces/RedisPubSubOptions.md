# Interface: RedisPubSubOptions

Defined in: [packages/graphql-pubsub/src/interfaces.ts:4](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L4)

Options for creating a [RedisPubSub](../classes/RedisPubSub.md) instance.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="connection"></a> `connection?` | `RedisOptions` | ioredis connection options used when `publisher`/`subscriber` are not provided. | [packages/graphql-pubsub/src/interfaces.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L15) |
| <a id="connectionlistener"></a> `connectionListener?` | (`err`) => `void` | Called when the publisher/subscriber connections are established or fail. `undefined` is passed on successful connect, an `Error` on failure. | [packages/graphql-pubsub/src/interfaces.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L20) |
| <a id="deserializer"></a> `deserializer?` | (`payload`) => `unknown` | Custom deserializer for incoming message payloads. Defaults to `JSON.parse`. | [packages/graphql-pubsub/src/interfaces.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L32) |
| <a id="keyprefix"></a> `keyPrefix?` | `string` | Key prefix prepended to every Redis channel name. | [packages/graphql-pubsub/src/interfaces.ts:6](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L6) |
| <a id="publisher"></a> `publisher?` | `Redis` | Pre-existing Redis client used for publishing. | [packages/graphql-pubsub/src/interfaces.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L8) |
| <a id="reviver"></a> `reviver?` | (`key`, `value`) => `unknown` | Optional JSON `reviver` function passed to `JSON.parse` when deserialising incoming messages (used only when `deserializer` is not provided). | [packages/graphql-pubsub/src/interfaces.ts:28](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L28) |
| <a id="serializer"></a> `serializer?` | (`payload`) => `string` | Custom serializer for outgoing message payloads. Defaults to `JSON.stringify`. | [packages/graphql-pubsub/src/interfaces.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L30) |
| <a id="subscriber"></a> `subscriber?` | `Redis` | Pre-existing Redis client used for subscribing. | [packages/graphql-pubsub/src/interfaces.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L10) |
| <a id="triggertransform"></a> `triggerTransform?` | [`TriggerTransform`](../type-aliases/TriggerTransform.md) | Transforms a trigger name before it is used as the Redis channel key. | [packages/graphql-pubsub/src/interfaces.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L22) |
