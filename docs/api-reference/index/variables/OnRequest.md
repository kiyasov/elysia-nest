# Variable: OnRequest()

```ts
const OnRequest: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:75](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L75)

Hook called when new request is received

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-request

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnRequest()
  async logRequest(context: Context) {
    console.log(`Request: ${context.request.method} ${context.path}`);
  }
}
```
