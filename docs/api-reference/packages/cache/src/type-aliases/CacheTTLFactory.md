# Type Alias: CacheTTLFactory()

```ts
type CacheTTLFactory = (ctx) => Promise<number> | number;
```

Defined in: [packages/cache/src/decorators/cache-ttl.decorator.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/decorators/cache-ttl.decorator.ts#L25)

Factory function type for generating TTL (time-to-live) values dynamically.

This function receives the execution context and returns a TTL in milliseconds.
Can be async for cases where TTL needs to be fetched from external sources.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `ctx` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) |

## Returns

`Promise`\<`number`\> \| `number`

The TTL in milliseconds, or a Promise resolving to TTL.

## Example

```typescript
const ttlFactory: CacheTTLFactory = (ctx) => {
  const request = ctx.switchToHttp().getRequest();
  // Premium users get longer cache
  return request.user.isPremium ? 3600000 : 60000;
};
```

## Public Api
