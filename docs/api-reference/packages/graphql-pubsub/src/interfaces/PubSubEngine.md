# Interface: PubSubEngine

Defined in: [packages/graphql-pubsub/src/interfaces.ts:76](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/interfaces.ts#L76)

Core PubSub contract that [RedisPubSub](../classes/RedisPubSub.md) implements.

## Methods

### asyncIterator()

```ts
asyncIterator<T>(triggers, options?): AsyncIterator<T>;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:84](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/interfaces.ts#L84)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `triggers` | `string` \| `string`[] |
| `options?` | [`AsyncIteratorOptions`](AsyncIteratorOptions.md) |

#### Returns

`AsyncIterator`\<`T`\>

***

### publish()

```ts
publish(triggerName, payload): Promise<void>;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:77](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/interfaces.ts#L77)

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
   options?
): Promise<number>;
```

Defined in: [packages/graphql-pubsub/src/interfaces.ts:78](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/interfaces.ts#L78)

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

Defined in: [packages/graphql-pubsub/src/interfaces.ts:83](https://github.com/nestelia/nestelia/blob/main/packages/graphql-pubsub/src/interfaces.ts#L83)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `subId` | `number` |

#### Returns

`void`
