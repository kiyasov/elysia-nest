# Type Alias: CacheKeyFactory()

```ts
type CacheKeyFactory = (ctx) => string;
```

Defined in: [packages/cache/src/decorators/cache-key.decorator.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/decorators/cache-key.decorator.ts#L24)

Factory function type for generating cache keys dynamically.

This function receives the execution context and returns a string key.
Useful for generating keys based on request parameters, headers, or user context.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) |

## Returns

`string`

The cache key string.

## Example

```typescript
const keyFactory: CacheKeyFactory = (ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return `user:${request.user.id}:profile`;
};
```

## Public Api
