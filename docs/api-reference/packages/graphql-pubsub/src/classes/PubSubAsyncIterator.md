# Class: PubSubAsyncIterator\<T\>

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:31](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L31)

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
   options?
): PubSubAsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:54](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L54)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pubsub` | [`PubSubEngine`](../interfaces/PubSubEngine.md) |
| `triggers` | `string`[] |
| `options?` | [`AsyncIteratorOptions`](../interfaces/AsyncIteratorOptions.md) |

#### Returns

`PubSubAsyncIterator`\<`T`\>

## Methods

### \[asyncIterator\]()

```ts
asyncIterator: AsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:112](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L112)

Makes this object usable in `for await…of` loops.

#### Returns

`AsyncIterator`\<`T`\>

***

### next()

```ts
next(): Promise<IteratorResult<T, any>>;
```

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:80](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L80)

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

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:98](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L98)

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

Defined in: [packages/graphql-pubsub/src/pubsub-async-iterator.ts:105](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/pubsub-async-iterator.ts#L105)

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
