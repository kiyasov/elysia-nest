# Class: CacheInterceptor

Defined in: [packages/cache/src/interceptors/cache.interceptor.ts:97](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L97)

Interceptor that handles HTTP caching using cache-manager.

This interceptor checks the cache before executing a request handler.
If a cached value exists, it returns that value immediately.
Otherwise, it executes the handler and stores the result in cache.

Features:
- Automatic cache key generation from HTTP request URL
- Support for custom cache keys via

## Cache Key

decorator
- Configurable TTL via

## Cache TTL

decorator
- Cache hit/miss headers (X-Cache)
- Only caches GET requests by default

## Example

```typescript
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController {
  @Get(':id')
  @CacheTTL(60) // Cache for 60 seconds
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
```

## Public Api

## Implements

- [`NestInterceptor`](../../../../index/interfaces/NestInterceptor.md)

## Constructors

### Constructor

```ts
new CacheInterceptor(
   cacheManager, 
   reflector, 
   httpAdapterHost?): CacheInterceptor;
```

Defined in: [packages/cache/src/interceptors/cache.interceptor.ts:108](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L108)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cacheManager` | [`Cache`](Cache.md) | The cache manager instance. |
| `reflector` | `Reflector` | The reflector for reading metadata. |
| `httpAdapterHost?` | `HttpAdapterHost` | Optional HTTP adapter host; absent in non-HTTP contexts. |

#### Returns

`CacheInterceptor`

## Methods

### intercept()

```ts
intercept(context, next): Promise<Observable<unknown>>;
```

Defined in: [packages/cache/src/interceptors/cache.interceptor.ts:123](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L123)

Intercepts the request and handles caching logic.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) | The execution context. |
| `next` | [`CallHandler`](../../../../index/interfaces/CallHandler.md) | The next handler in the chain. |

#### Returns

`Promise`\<`Observable`\<`unknown`\>\>

An observable of the response.

#### Implementation of

[`NestInterceptor`](../../../../index/interfaces/NestInterceptor.md).[`intercept`](../../../../index/interfaces/NestInterceptor.md#intercept)

***

### isRequestCacheable()

```ts
protected isRequestCacheable(context): boolean;
```

Defined in: [packages/cache/src/interceptors/cache.interceptor.ts:246](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L246)

Checks if the current request method is cacheable.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) | The execution context. |

#### Returns

`boolean`

True if the request method is in allowedMethods.

***

### setHeadersWhenHttp()

```ts
protected setHeadersWhenHttp(context, value): void;
```

Defined in: [packages/cache/src/interceptors/cache.interceptor.ts:263](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L263)

Sets cache headers (X-Cache: HIT/MISS) on HTTP response.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) | The execution context. |
| `value` | `unknown` | The cached value (null/undefined means miss). |

#### Returns

`void`

***

### trackBy()

```ts
protected trackBy(context): string | undefined;
```

Defined in: [packages/cache/src/interceptors/cache.interceptor.ts:213](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L213)

Generates a cache key for the current request.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) | The execution context. |

#### Returns

`string` \| `undefined`

The cache key or undefined if not cacheable.

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="allowedmethods"></a> `allowedMethods` | `readonly` | readonly `string`[] | List of HTTP methods that are allowed to be cached. | [packages/cache/src/interceptors/cache.interceptor.ts:101](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L101) |
| <a id="cachemanager"></a> `cacheManager` | `readonly` | [`Cache`](Cache.md) | The cache manager instance. | [packages/cache/src/interceptors/cache.interceptor.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L109) |
| <a id="httpadapterhost"></a> `httpAdapterHost?` | `readonly` | `HttpAdapterHost` | Optional HTTP adapter host; absent in non-HTTP contexts. | [packages/cache/src/interceptors/cache.interceptor.ts:113](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L113) |
| <a id="reflector"></a> `reflector` | `readonly` | `Reflector` | The reflector for reading metadata. | [packages/cache/src/interceptors/cache.interceptor.ts:110](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interceptors/cache.interceptor.ts#L110) |
