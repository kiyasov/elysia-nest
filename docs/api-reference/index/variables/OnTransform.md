# Variable: OnTransform()

```ts
const OnTransform: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:114](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L114)

Hook called to transform parsed body

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-transform

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnTransform()
  async transformBody(context: Context) {
    if (context.body && typeof context.body === 'object') {
      context.body.transformed = true;
    }
  }
}
```
