# packages/cache/src

Elysia-Nest Cache Manager Module

A comprehensive caching module for Elysia-Nest applications, providing:
- In-memory and Redis caching support
- HTTP request/response caching via interceptor
- Decorators for fine-grained cache control
- Multi-tier caching with non-blocking operations

## Example

Quick start:
```typescript
import { CacheModule } from '@@kiyasov/elysia-nest/cache-manager';

@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}
```

## Classes

| Class | Description |
| ------ | ------ |
| [Cache](classes/Cache.md) | Empty base class that will be merged with the Cache interface. |
| [CacheInterceptor](classes/CacheInterceptor.md) | Interceptor that handles HTTP caching using cache-manager. |
| [CacheModule](classes/CacheModule.md) | Module that provides caching functionality for @kiyasov/elysia-nest. |

## Functions

| Function | Description |
| ------ | ------ |
| [CacheKey](functions/CacheKey.md) | Decorator that sets the caching key used to store/retrieve cached items. |
| [CacheTTL](functions/CacheTTL.md) | Decorator that sets the cache TTL (time-to-live) duration. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CacheManagerOptions](interfaces/CacheManagerOptions.md) | Interface defining Cache Manager configuration options. |
| [CacheModuleAsyncOptions](interfaces/CacheModuleAsyncOptions.md) | Options for dynamically (asynchronously) configuring the Cache module. |
| [CacheOptionsFactory](interfaces/CacheOptionsFactory.md) | Factory interface for creating cache options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [CacheKeyFactory](type-aliases/CacheKeyFactory.md) | Factory function type for generating cache keys dynamically. |
| [CacheModuleOptions](type-aliases/CacheModuleOptions.md) | Options for configuring the Cache module. |
| [CacheOptions](type-aliases/CacheOptions.md) | Cache options combining cache manager options with store-specific configuration. |
| [CacheTTLFactory](type-aliases/CacheTTLFactory.md) | Factory function type for generating TTL (time-to-live) values dynamically. |

## Variables

| Variable | Description |
| ------ | ------ |
| [CACHE\_KEY\_METADATA](variables/CACHE_KEY_METADATA.md) | Metadata key for cache key configuration. |
| [CACHE\_MANAGER](variables/CACHE_MANAGER.md) | Injection token for the CacheManager provider. |
| [CACHE\_MODULE\_OPTIONS](variables/CACHE_MODULE_OPTIONS.md) | Re-export of MODULE_OPTIONS_TOKEN for convenience. |
| [CACHE\_TTL\_METADATA](variables/CACHE_TTL_METADATA.md) | Metadata key for cache TTL configuration. |
