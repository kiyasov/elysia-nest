# packages/graphql-pubsub/src

## Classes

| Class | Description |
| ------ | ------ |
| [GraphQLPubSubGlobalModule](classes/GraphQLPubSubGlobalModule.md) | - |
| [GraphQLPubSubModule](classes/GraphQLPubSubModule.md) | Feature module that provides a [RedisPubSub](classes/RedisPubSub.md) instance for use with GraphQL subscriptions. |
| [GraphQLPubSubModuleCore](classes/GraphQLPubSubModuleCore.md) | - |
| [PubSubAsyncIterator](classes/PubSubAsyncIterator.md) | Async iterator for GraphQL subscriptions backed by a [PubSubEngine](interfaces/PubSubEngine.md). |
| [RedisPubSub](classes/RedisPubSub.md) | Redis-backed implementation of the [PubSubEngine](interfaces/PubSubEngine.md) contract. |

## Functions

| Function | Description |
| ------ | ------ |
| [InjectPubSub](functions/InjectPubSub.md) | Parameter decorator that injects the [RedisPubSub](classes/RedisPubSub.md) instance registered under the [GRAPHQL\_PUBSUB](variables/GRAPHQL_PUBSUB.md) token. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [GraphQLPubSubModuleOptions](interfaces/GraphQLPubSubModuleOptions.md) | Options accepted by [GraphQLPubSubModule.forRoot](classes/GraphQLPubSubModule.md#forroot). |
| [PubSubEngine](interfaces/PubSubEngine.md) | Core PubSub contract that [RedisPubSub](classes/RedisPubSub.md) implements. |
| [RedisPubSubOptions](interfaces/RedisPubSubOptions.md) | Options for creating a [RedisPubSub](classes/RedisPubSub.md) instance. |
| [SubscriptionEvent](interfaces/SubscriptionEvent.md) | Metadata stored per active subscription. |
| [SubscriptionOptions](interfaces/SubscriptionOptions.md) | Options passed when subscribing to a trigger. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [MessageHandler](type-aliases/MessageHandler.md) | Callback invoked whenever a message arrives on a subscribed trigger. |
| [SubscriptionMap](type-aliases/SubscriptionMap.md) | `subId → SubscriptionEvent` map. |
| [SubsRefsMap](type-aliases/SubsRefsMap.md) | `channel → [subId, …]` map for fan-out dispatch. |
| [TriggerTransform](type-aliases/TriggerTransform.md) | A function that maps a trigger name (plus subscription options) to the Redis channel key that will actually be subscribed to. |

## Variables

| Variable | Description |
| ------ | ------ |
| [GRAPHQL\_PUBSUB](variables/GRAPHQL_PUBSUB.md) | DI token for the `RedisPubSub` instance. Use [InjectPubSub](functions/InjectPubSub.md) for convenience. |
| [GRAPHQL\_PUBSUB\_OPTIONS](variables/GRAPHQL_PUBSUB_OPTIONS.md) | DI token for the raw `RedisPubSubOptions` object. |
