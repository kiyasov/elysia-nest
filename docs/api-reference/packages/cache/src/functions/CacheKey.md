# Function: CacheKey()

```ts
function CacheKey(key): MethodDecorator & ClassDecorator;
```

Defined in: [packages/cache/src/decorators/cache-key.decorator.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/decorators/cache-key.decorator.ts#L61)

Decorator that sets the caching key used to store/retrieve cached items.

This decorator is useful for WebSocket or Microservice-based applications
where automatic URL-based key generation is not available.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` \| [`CacheKeyFactory`](../type-aliases/CacheKeyFactory.md) | A static string key or a factory function that generates a key. |

## Returns

`MethodDecorator` & `ClassDecorator`

A decorator function that sets the metadata.

## Examples

Static key:
```typescript
@CacheKey('events')
@Get('events')
async getEvents() {
  return this.eventsService.findAll();
}
```

Dynamic key with factory:
```typescript
@CacheKey((ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return `user:${request.params.id}`;
})
@Get(':id')
async getUser(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

## Public Api
