# Variable: OnBeforeHandle()

```ts
const OnBeforeHandle: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:134](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L134)

Hook called before request handler

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-before-handle

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnBeforeHandle()
  async checkAuth(context: Context) {
    if (!context.headers.authorization) {
      context.set.status = 401;
      return { error: 'Unauthorized' };
    }
  }
}
```
