# Type Alias: EventHandler\<T\>

```ts
type EventHandler<T> = (payload) => void | Promise<void>;
```

Defined in: [packages/core/src/events/event-emitter.interface.ts:4](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event-emitter.interface.ts#L4)

Event handler function type

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | `T` |

## Returns

`void` \| `Promise`\<`void`\>
