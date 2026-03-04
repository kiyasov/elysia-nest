# Interface: PubSubEngine

Defined in: [packages/graphql-pubsub/src/interfaces.ts:54](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L54)

Core PubSub contract that [RedisPubSub](../classes/RedisPubSub.md) implements.

## Methods

### asyncIterator()

```ts
asyncIterator<T>(triggers): AsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:62](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L62)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggers` | `string` \| `string`[] |

#### Returns

`AsyncIterator`\<`T`\>

***

### publish()

```ts
publish(triggerName, payload): Promise<void>;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:55](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggerName` | `string` |
| `payload` | `unknown` |

#### Returns

`Promise`\<`void`\>

***

### subscribe()

```ts
subscribe(
   triggerName, 
   onMessage, 
options?): Promise<number>;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:56](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L56)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggerName` | `string` |
| `onMessage` | [`MessageHandler`](../type-aliases/MessageHandler.md) |
| `options?` | [`SubscriptionOptions`](SubscriptionOptions.md) |

#### Returns

`Promise`\<`number`\>

***

### unsubscribe()

```ts
unsubscribe(subId): void;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/interfaces.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `subId` | `number` |

#### Returns

`void`
