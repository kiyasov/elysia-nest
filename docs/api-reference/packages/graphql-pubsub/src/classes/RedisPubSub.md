# Class: RedisPubSub

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:43](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L43)

Redis-backed implementation of the [PubSubEngine](../interfaces/PubSubEngine.md) contract.

Uses two separate ioredis connections — one for publishing (`PUBLISH`) and
one dedicated to blocking subscribe commands (`SUBSCRIBE` / `PSUBSCRIBE`).
This separation is required because a Redis client in subscribe mode can
only issue subscribe/unsubscribe commands.

Construct via [GraphQLPubSubModule.forRoot](GraphQLPubSubModule.md#forroot) or
[GraphQLPubSubModule.forRootAsync](GraphQLPubSubModule.md#forrootasync) in module-based apps.

## Example

```typescript
const pubsub = new RedisPubSub({ connection: { host: "localhost", port: 6379 } });

// Publish
await pubsub.publish("ORDER_CREATED", { id: 1 });

// Subscribe
const subId = await pubsub.subscribe("ORDER_CREATED", (payload) => {
  console.log(payload);
});

// Later…
pubsub.unsubscribe(subId);
await pubsub.close();
```

## Implements

- [`PubSubEngine`](../interfaces/PubSubEngine.md)

## Accessors

### channelCount

#### Get Signature

```ts
get channelCount(): number;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:384](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L384)

Number of distinct Redis channels (after `triggerTransform`) that
this instance is currently subscribed to.

##### Returns

`number`

***

### subscriptionCount

#### Get Signature

```ts
get subscriptionCount(): number;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:376](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L376)

Number of active per-iterator subscriptions currently held in memory.

Useful for exporting as a metric — steady growth here when client
churn is normal is a sign that subscription iterators aren't being
returned on disconnect (typically a dirty-WebSocket-close issue).

##### Returns

`number`

## Constructors

### Constructor

```ts
new RedisPubSub(options?): RedisPubSub;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:71](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L71)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RedisPubSubOptions`](../interfaces/RedisPubSubOptions.md) |

#### Returns

`RedisPubSub`

## Methods

### asyncIterator()

```ts
asyncIterator<T>(triggers, options?): AsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:346](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L346)

Creates an `AsyncIterator` over the given `triggers` for use in
GraphQL subscription resolvers.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggers` | `string` \| `string`[] |
| `options?` | [`AsyncIteratorOptions`](../interfaces/AsyncIteratorOptions.md) |

#### Returns

`AsyncIterator`\<`T`\>

#### Example

```typescript
// In a GraphQL resolver:
subscribe() {
  return pubsub.asyncIterator<OrderCreatedEvent>("ORDER_CREATED");
}
```

#### Implementation of

[`PubSubEngine`](../interfaces/PubSubEngine.md).[`asyncIterator`](../interfaces/PubSubEngine.md#asynciterator)

***

### close()

```ts
close(): Promise<void>;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:417](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L417)

Gracefully closes both Redis connections.

Call this during application shutdown to allow open sockets to drain.

#### Returns

`Promise`\<`void`\>

***

### debug()

```ts
debug(): {
  channelCount: number;
  channels: {
     subscribers: number;
     trigger: string;
  }[];
  subscriptionCount: number;
};
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:396](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L396)

Snapshot of the subscription state for observability.

The returned structure is a copy — mutating it does not affect the
internal maps. Intended for `/health` endpoints, metric collectors,
and regression tests for leak detection. Preferable to reaching into
`subscriptionMap` via `as unknown as { subscriptionMap }`.

#### Returns

```ts
{
  channelCount: number;
  channels: {
     subscribers: number;
     trigger: string;
  }[];
  subscriptionCount: number;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `channelCount` | `number` | [packages/graphql-pubsub/src/redis-pubsub.ts:398](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L398) |
| `channels` | \{ `subscribers`: `number`; `trigger`: `string`; \}[] | [packages/graphql-pubsub/src/redis-pubsub.ts:399](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L399) |
| `subscriptionCount` | `number` | [packages/graphql-pubsub/src/redis-pubsub.ts:397](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L397) |

***

### getPublisher()

```ts
getPublisher(): Redis;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:365](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L365)

Returns the underlying publisher Redis client.

#### Returns

`Redis`

***

### getSubscriber()

```ts
getSubscriber(): Redis;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:360](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L360)

Returns the underlying subscriber Redis client.

#### Returns

`Redis`

#### Warning

Do **not** issue regular Redis commands on this client — it is
  in subscribe mode and only accepts `(P)SUBSCRIBE` / `(P)UNSUBSCRIBE`.

***

### publish()

```ts
publish(trigger, payload): Promise<void>;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:142](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L142)

Publishes `payload` to the Redis channel derived from `trigger`.

The payload is serialised with the custom [RedisPubSubOptions.serializer](../interfaces/RedisPubSubOptions.md#serializer)
when provided, otherwise `JSON.stringify`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `trigger` | `string` |
| `payload` | `unknown` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`PubSubEngine`](../interfaces/PubSubEngine.md).[`publish`](../interfaces/PubSubEngine.md#publish)

***

### subscribe()

```ts
subscribe<T>(
   trigger, 
   onMessage, 
options?): Promise<number>;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:160](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L160)

Subscribes to `trigger` and invokes `onMessage` for every incoming message.

If another subscriber already holds a subscription for the same resolved
channel, the existing Redis subscription is reused — no additional
`SUBSCRIBE` command is issued.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `trigger` | `string` |
| `onMessage` | [`MessageHandler`](../type-aliases/MessageHandler.md)\<`T`\> |
| `options` | [`SubscriptionOptions`](../interfaces/SubscriptionOptions.md) |

#### Returns

`Promise`\<`number`\>

A numeric subscription ID used with [unsubscribe](#unsubscribe).

#### Implementation of

[`PubSubEngine`](../interfaces/PubSubEngine.md).[`subscribe`](../interfaces/PubSubEngine.md#subscribe)

***

### unsubscribe()

```ts
unsubscribe(subId): void;
```

Defined in: [packages/graphql-pubsub/src/redis-pubsub.ts:298](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/redis-pubsub.ts#L298)

Cancels the subscription identified by `subId`.

When the cancelled subscription was the last one for its Redis channel,
the corresponding `UNSUBSCRIBE` / `PUNSUBSCRIBE` command is issued.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `subId` | `number` |

#### Returns

`void`

#### Throws

If `subId` is not a known subscription.

#### Implementation of

[`PubSubEngine`](../interfaces/PubSubEngine.md).[`unsubscribe`](../interfaces/PubSubEngine.md#unsubscribe)
