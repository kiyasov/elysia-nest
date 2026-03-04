# Variable: OnError()

```ts
const OnError: (options?) => MethodDecorator;
```

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:208](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L208)

Hook called when error occurs

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \{ `before?`: `boolean`; \} | - |
| `options.before?` | `boolean` | Insert before other hooks |

## Returns

`MethodDecorator`

## See

https://elysiajs.com/essential/life-cycle.html#on-error

## Example

```typescript
@Controller('/users')
export class UserController {
  @OnError()
  async handleError({ error, set }: Context) {
    console.error('Error occurred:', error);
    set.status = 500;
    return { error: 'Internal Server Error' };
  }
}
```
