# Variable: OnParse()

```ts
const OnParse: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:95](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L95)

Hook called to parse request body

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-parse

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnParse()
  async customParser(context: Context) {
    const contentType = context.request.headers.get('content-type');
    if (contentType === 'application/custom') {
      return await context.request.text();
    }
  }
}
```
