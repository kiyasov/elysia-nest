# Type Alias: MiddlewareType

```ts
type MiddlewareType = 
  | Type<ElysiaNestMiddleware>
  | FunctionalMiddleware;
```

Defined in: [packages/core/src/interfaces/middleware.interface.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/middleware.interface.ts#L30)

Represents either a class type that implements ElysiaNestMiddleware
or a functional middleware.
