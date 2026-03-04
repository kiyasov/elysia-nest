# Class: PubSubAsyncIterator\<T\>

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:26](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L26)

Async iterator for GraphQL subscriptions backed by a [PubSubEngine](../interfaces/PubSubEngine.md).

Implements the `AsyncIterator` / `AsyncIterable` protocols so it can be
used directly in GraphQL resolvers:

```typescript
yield* pubsub.asyncIterator<MyEvent>("MY_EVENT");
```

Internally it maintains two queues:
- **pullQueue** – pending `next()` promises waiting for a message.
- **pushQueue** – messages that arrived before `next()` was called.

To prevent unbounded memory growth the push-queue is capped at
MAX\_QUEUE\_SIZE; oldest entries are dropped when the limit is
exceeded (similar to a lossy channel).

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Implements

- `AsyncIterator`\<`T`\>

## Constructors

### Constructor

```ts
new PubSubAsyncIterator<T>(
   pubsub, 
   triggers, 
options?): PubSubAsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:40](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L40)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pubsub` | [`PubSubEngine`](../interfaces/PubSubEngine.md) |
| `triggers` | `string`[] |
| `options?` | [`SubscriptionOptions`](../interfaces/SubscriptionOptions.md) |

#### Returns

`PubSubAsyncIterator`\<`T`\>

## Methods

### \[asyncIterator\]()

```ts
asyncIterator: AsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:83](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L83)

Makes this object usable in `for await…of` loops.

#### Returns

`AsyncIterator`\<`T`\>

***

### next()

```ts
next(): Promise<IteratorResult<T, any>>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:56](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L56)

Returns the next message, waiting if none is buffered yet.

#### Returns

`Promise`\<`IteratorResult`\<`T`, `any`\>\>

#### Implementation of

```ts
AsyncIterator.next
```

***

### return()

```ts
return(): Promise<IteratorResult<T, any>>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:71](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L71)

Terminates the iterator and unsubscribes from all triggers.

#### Returns

`Promise`\<`IteratorResult`\<`T`, `any`\>\>

#### Implementation of

```ts
AsyncIterator.return
```

***

### throw()

```ts
throw(error): Promise<IteratorResult<T, any>>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:77](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L77)

Terminates the iterator, unsubscribes, then re-throws `error`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `error` | `unknown` |

#### Returns

`Promise`\<`IteratorResult`\<`T`, `any`\>\>

#### Implementation of

```ts
AsyncIterator.throw
```
