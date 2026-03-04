# Function: Middleware()

```ts
function Middleware(options?): ClassDecorator;
```

Defined in: [packages/core/src/decorators/middleware.decorator.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/middleware.decorator.ts#L25)

Marks a class as middleware. Implies `@Injectable()`.

The class must implement `ElysiaNestMiddleware`:
```typescript
@Middleware()
export class LoggerMiddleware implements ElysiaNestMiddleware {
  async use(ctx: ElysiaContext, next: () => Promise<void>) {
    console.log(`--> ${ctx.request.method} ${ctx.path}`);
    await next(); // code here runs AFTER the route handler
    console.log(`<-- ${ctx.set.status}`);
  }
}
```

Register it in a module:
```typescript
@Module({ middlewares: [LoggerMiddleware] })
export class AppModule {}
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`InjectableOptions`](../interfaces/InjectableOptions.md) |

## Returns

`ClassDecorator`
