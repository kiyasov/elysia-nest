# Class: EventEmitter

Defined in: [packages/core/src/events/event-emitter.ts:11](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.ts#L11)

Event emitter for dispatching and handling events

## Implements

- [`IEventEmitter`](../interfaces/IEventEmitter.md)

## Constructors

### Constructor

```ts
new EventEmitter(): EventEmitter;
```

#### Returns

`EventEmitter`

## Methods

### emit()

```ts
emit<T>(event, payload): Promise<void>;
```

Defined in: [packages/core/src/events/event-emitter.ts:64](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.ts#L64)

Emit an event with a payload

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `payload` | `T` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IEventEmitter`](../interfaces/IEventEmitter.md).[`emit`](../interfaces/IEventEmitter.md#emit)

***

### off()

```ts
off<T>(event, handler?): void;
```

Defined in: [packages/core/src/events/event-emitter.ts:35](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.ts#L35)

Remove an event handler

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `handler?` | [`EventHandler`](../type-aliases/EventHandler.md)\<`T`\> |

#### Returns

`void`

#### Implementation of

[`IEventEmitter`](../interfaces/IEventEmitter.md).[`off`](../interfaces/IEventEmitter.md#off)

***

### on()

```ts
on<T>(event, handler): void;
```

Defined in: [packages/core/src/events/event-emitter.ts:21](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.ts#L21)

Register an event handler

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler.md)\<`T`\> |

#### Returns

`void`

#### Implementation of

[`IEventEmitter`](../interfaces/IEventEmitter.md).[`on`](../interfaces/IEventEmitter.md#on)

***

### once()

```ts
once<T>(event, handler): void;
```

Defined in: [packages/core/src/events/event-emitter.ts:28](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.ts#L28)

Register a one-time event handler

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `handler` | [`EventHandler`](../type-aliases/EventHandler.md)\<`T`\> |

#### Returns

`void`

#### Implementation of

[`IEventEmitter`](../interfaces/IEventEmitter.md).[`once`](../interfaces/IEventEmitter.md#once)

***

### removeAllListeners()

```ts
removeAllListeners(event?): void;
```

Defined in: [packages/core/src/events/event-emitter.ts:108](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.ts#L108)

Remove all listeners, or all listeners for a specific event

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event?` | `string` \| `symbol` |

#### Returns

`void`
