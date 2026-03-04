# Variable: OnAfterResponse()

```ts
const OnAfterResponse: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:189](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L189)

Hook called after response is sent

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-after-response

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnAfterResponse()
  async logResponse(context: Context) {
    console.log(`Response sent: ${context.set.status}`);
  }
}
```
