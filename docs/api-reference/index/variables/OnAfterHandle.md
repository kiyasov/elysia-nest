# Variable: OnAfterHandle()

```ts
const OnAfterHandle: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:153](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L153)

Hook called after request handler

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-after-handle

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnAfterHandle()
  async modifyResponse(context: Context) {
    if (context.response && typeof context.response === 'object') {
      context.response.timestamp = new Date().toISOString();
    }
  }
}
```
