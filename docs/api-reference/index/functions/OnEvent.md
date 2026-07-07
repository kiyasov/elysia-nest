# Function: OnEvent()

```ts
function OnEvent(event, options?): MethodDecorator;
```

Defined in: [packages/core/src/events/event.decorators.ts:30](https://github.com/nestelia/nestelia/blob/main/packages/core/src/events/event.decorators.ts#L30)

Decorator to mark a method as an event handler

## Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` \| `symbol` |
| `options` | [`OnEventOptions`](../interfaces/OnEventOptions.md) |

## Returns

`MethodDecorator`
