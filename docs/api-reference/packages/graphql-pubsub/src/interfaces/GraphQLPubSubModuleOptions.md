# Interface: GraphQLPubSubModuleOptions

Defined in: [packages/graphql-pubsub/src/graphql-pubsub.module.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L19)

Options accepted by [GraphQLPubSubModule.forRoot](../classes/GraphQLPubSubModule.md#forroot).

Exactly one of `useValue`, `useExisting`, or `useFactory` should be provided.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="isglobal"></a> `isGlobal?` | `boolean` | When `true` (default) the module is registered globally and the [GRAPHQL\_PUBSUB](../variables/GRAPHQL_PUBSUB.md) token is available application-wide without importing this module in every feature module. | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:43](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L43) |
| <a id="useexisting"></a> `useExisting?` | \{ `keyPrefix?`: `string`; `publisher`: `Redis`; `subscriber`: `Redis`; \} | Pre-created publisher and subscriber Redis clients. Use this when you manage Redis connections outside of the module. | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L31) |
| `useExisting.keyPrefix?` | `string` | - | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:34](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L34) |
| `useExisting.publisher` | `Redis` | - | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L32) |
| `useExisting.subscriber` | `Redis` | - | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L33) |
| <a id="usefactory"></a> `useFactory?` | (...`args`) => \| [`RedisPubSubOptions`](RedisPubSubOptions.md) \| `Promise`\<[`RedisPubSubOptions`](RedisPubSubOptions.md)\> | Synchronous factory function that returns [RedisPubSubOptions](RedisPubSubOptions.md). Prefer [GraphQLPubSubModule.forRootAsync](../classes/GraphQLPubSubModule.md#forrootasync) when async config is needed. | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L24) |
| <a id="usevalue"></a> `useValue?` | [`RedisPubSubOptions`](RedisPubSubOptions.md) | Plain configuration object passed directly to [RedisPubSub](../classes/RedisPubSub.md). | [packages/graphql-pubsub/src/graphql-pubsub.module.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L37) |
