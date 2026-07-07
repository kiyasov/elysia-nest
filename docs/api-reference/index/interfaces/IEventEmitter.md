# Interface: IEventEmitter

Defined in: [packages/core/src/events/event-emitter.interface.ts:17](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.interface.ts#L17)

Interface for event emitter

## Methods

### emit()

```ts
emit<T>(event, payload): Promise<void>;
```

Defined in: [packages/core/src/events/event-emitter.interface.ts:36](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.interface.ts#L36)

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

***

### off()

```ts
off<T>(event, handler?): void;
```

Defined in: [packages/core/src/events/event-emitter.interface.ts:31](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.interface.ts#L31)

Remove a handler for an event

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

***

### on()

```ts
on<T>(event, handler): void;
```

Defined in: [packages/core/src/events/event-emitter.interface.ts:21](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.interface.ts#L21)

Register a handler for an event

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

***

### once()

```ts
once<T>(event, handler): void;
```

Defined in: [packages/core/src/events/event-emitter.interface.ts:26](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.interface.ts#L26)

Register a one-time handler for an event

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
