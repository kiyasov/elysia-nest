# Function: CacheTTL()

```ts
function CacheTTL(ttl): MethodDecorator & ClassDecorator;
```

Defined in: [packages/cache/src/decorators/cache-ttl.decorator.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/decorators/cache-ttl.decorator.ts#L65)

Decorator that sets the cache TTL (time-to-live) duration.

TTL determines how long an item remains in the cache before expiration.
Value is specified in milliseconds.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ttl` | `number` \| [`CacheTTLFactory`](../type-aliases/CacheTTLFactory.md) | A static TTL value in milliseconds, or a factory function. |

## Returns

`MethodDecorator` & `ClassDecorator`

A decorator function that sets the metadata.

## Examples

Static TTL (5 seconds):
```typescript
@CacheTTL(5000)
@Get('data')
async getData() {
  return this.dataService.findAll();
}
```

Dynamic TTL with factory:
```typescript
@CacheTTL((ctx) => {
  const request = ctx.switchToHttp().getRequest();
  // Cache expensive queries longer
  return request.query.complex ? 60000 : 10000;
})
@Get('search')
async search(@Query() query: SearchQuery) {
  return this.searchService.search(query);
}
```

## Public Api
