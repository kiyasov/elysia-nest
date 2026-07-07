# Class: EventEmitterService

Defined in: [packages/event-emitter/src/event-emitter.service.ts:52](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L52)

Injectable event emitter service.

Supports synchronous and asynchronous handlers, wildcard patterns,
and typed events. Use `@InjectEventEmitter()` or `@Inject(EVENT_EMITTER_TOKEN)`
to inject this service.

Dispatch performance: exact (non-wildcard) patterns are indexed in a
`Map` for O(1) lookup, and each wildcard pattern's `RegExp` is compiled
once at registration time, so `emit`/`emitAsync`/`listenerCount` never scan
the full registration list nor recompile regexes on the request path.

## Example

```typescript
@Injectable()
export class OrderService {
  constructor(private readonly events: EventEmitterService) {}

  async placeOrder(order: Order) {
    await this.events.emitAsync('order.created', order);
  }
}
```

## Constructors

### Constructor

```ts
new EventEmitterService(options?): EventEmitterService;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:68](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`EventEmitterModuleOptions`](../interfaces/EventEmitterModuleOptions.md) |

#### Returns

`EventEmitterService`

## Methods

### emit()

```ts
emit(event, payload?): boolean;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:79](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L79)

Emit an event synchronously. Returns `true` if at least one handler was
invoked (async handlers are fired but not awaited — use `emitAsync` if
you need to wait for them).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `payload?` | `unknown` |

#### Returns

`boolean`

***

### emitAsync()

```ts
emitAsync(event, payload?): Promise<unknown[]>;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:102](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L102)

Emit an event and await all async handlers.
Returns an array of values resolved by each handler.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `payload?` | `unknown` |

#### Returns

`Promise`\<`unknown`[]\>

***

### listenerCount()

```ts
listenerCount(event): number;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:204](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L204)

Returns the number of handlers registered for `event`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |

#### Returns

`number`

***

### off()

```ts
off<T>(event, handler?): this;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:153](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L153)

Remove a specific handler (or all handlers for an event when omitted).

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `handler?` | `EventHandler`\<`T`\> |

#### Returns

`this`

***

### on()

```ts
on<T>(event, handler): this;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:131](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L131)

Register a persistent event handler.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `handler` | `EventHandler`\<`T`\> |

#### Returns

`this`

***

### once()

```ts
once<T>(event, handler): this;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:142](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L142)

Register a one-time event handler.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `handler` | `EventHandler`\<`T`\> |

#### Returns

`this`

***

### removeAllListeners()

```ts
removeAllListeners(event?): this;
```

Defined in: [packages/event-emitter/src/event-emitter.service.ts:189](https://github.com/nestelia/nestelia/blob/main/packages/event-emitter/src/event-emitter.service.ts#L189)

Remove all listeners, optionally scoped to a specific event.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event?` | `string` \| `symbol` |

#### Returns

`this`
