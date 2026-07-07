# Interface: CacheManagerOptions

Defined in: [packages/cache/src/interfaces/cache-manager.interface.ts:31](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L31)

Interface defining Cache Manager configuration options.

This interface extends cache-manager's CreateCacheOptions and adds
support for multiple stores, namespace configuration, and additional
caching behaviors.

## Examples

Basic in-memory cache:
```typescript
const options: CacheManagerOptions = {
  ttl: 60000, // 1 minute
};
```

With Redis store:
```typescript
const options: CacheManagerOptions = {
  stores: [new Keyv({ store: redisStore })],
  ttl: 300000,
  namespace: 'my-app',
};
```

## Extends

- `Omit`\<`CreateCacheOptions`, `"stores"`\>

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="cacheid"></a> `cacheId?` | `string` | - | - | `Omit.cacheId` | node\_modules/cache-manager/dist/index.d.ts:41 |
| <a id="lrusize"></a> `lruSize?` | `number` | Maximum number of entries kept in the built-in default in-memory store. This bound only applies when no custom [CacheManagerOptions.stores](#stores) are provided. The default store is an LRU-backed `CacheableMemory` cache, so once this many entries exist the least-recently-used ones are evicted. This prevents unbounded heap growth (and eventual OOM) when distinct cache keys — e.g. one per unique request URL — accumulate without a TTL. Set to `0` to disable the LRU bound (unbounded — not recommended). Ignored when you supply your own `stores`; in that case you are fully responsible for bounding memory yourself. **Default** `5000` **Example** `lruSize: 10000 // keep at most 10k entries in the default store` | - | - | [packages/cache/src/interfaces/cache-manager.interface.ts:118](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L118) |
| <a id="namespace"></a> `namespace?` | `string` | Cache storage namespace. Used to prefix all keys in the cache to avoid collisions between different applications or modules sharing the same store. **Default** `"keyv"` **Example** `namespace: 'user-service' // Keys will be prefixed: "user-service:key"` | - | - | [packages/cache/src/interfaces/cache-manager.interface.ts:80](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L80) |
| <a id="nonblocking"></a> `nonBlocking?` | `boolean` | Whether to use non-blocking mode for multiple stores. When `true`, operations on secondary stores will not block the main thread. This improves performance but may result in stale reads from secondary stores. **Default** `false` **See** [cache-manager documentation](https://www.npmjs.com/package/cache-manager#options) | `Omit.nonBlocking` | - | [packages/cache/src/interfaces/cache-manager.interface.ts:148](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L148) |
| <a id="refreshallstores"></a> `refreshAllStores?` | `boolean` | - | - | `Omit.refreshAllStores` | node\_modules/cache-manager/dist/index.d.ts:39 |
| <a id="refreshthreshold"></a> `refreshThreshold?` | `number` | Threshold for background refresh of cached values. When set, if a cached value is retrieved and its remaining TTL is less than this threshold, the value will be refreshed asynchronously in the background. **Default** `undefined (no background refresh)` **Example** `ttl: 60000, // Cache for 1 minute refreshThreshold: 10000 // Refresh if less than 10 seconds remaining` | `Omit.refreshThreshold` | - | [packages/cache/src/interfaces/cache-manager.interface.ts:135](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L135) |
| <a id="stores"></a> `stores?` | \| `Keyv`\<`any`\> \| `KeyvStoreAdapter` \| `Cacheable` \| (`Keyv`\<`any`\> \| `KeyvStoreAdapter` \| `Cacheable`)[] | Cache storage configuration. Supports single store or array of stores for multi-tier caching. Default is in-memory store if not specified. Available store types: - Keyv instances - KeyvStoreAdapter implementations - Cacheable instances (for multi-tier caching) **Examples** Single store: `stores: new Keyv({ store: redisStore })` Multiple stores (multi-tier): `stores: [ new Keyv({ store: new Cacheable({ l1: memoryStore, l2: redisStore }) }), ]` | - | - | [packages/cache/src/interfaces/cache-manager.interface.ts:60](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L60) |
| <a id="ttl"></a> `ttl?` | `number` | Default time-to-live in milliseconds. Maximum duration an item can remain in the cache before being removed. Can be overridden per-operation using **Cache TTL** decorator. **Default** `undefined (no expiration)` **Example** `ttl: 60000 // 1 minute` | `Omit.ttl` | - | [packages/cache/src/interfaces/cache-manager.interface.ts:95](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/interfaces/cache-manager.interface.ts#L95) |
