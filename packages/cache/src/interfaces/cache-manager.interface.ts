import { CreateCacheOptions } from "cache-manager";
import type { Cacheable } from "cacheable";
import { Keyv, KeyvStoreAdapter } from "keyv";

/**
 * Interface defining Cache Manager configuration options.
 *
 * This interface extends cache-manager's CreateCacheOptions and adds
 * support for multiple stores, namespace configuration, and additional
 * caching behaviors.
 *
 * @example
 * Basic in-memory cache:
 * ```typescript
 * const options: CacheManagerOptions = {
 *   ttl: 60000, // 1 minute
 * };
 * ```
 *
 * @example
 * With Redis store:
 * ```typescript
 * const options: CacheManagerOptions = {
 *   stores: [new Keyv({ store: redisStore })],
 *   ttl: 300000,
 *   namespace: 'my-app',
 * };
 * ```
 *
 */
export interface CacheManagerOptions extends Omit<
  CreateCacheOptions,
  "stores"
> {
  /**
   * Cache storage configuration.
   *
   * Supports single store or array of stores for multi-tier caching.
   * Default is in-memory store if not specified.
   *
   * Available store types:
   * - Keyv instances
   * - KeyvStoreAdapter implementations
   * - Cacheable instances (for multi-tier caching)
   *
   * @example
   * Single store:
   * ```typescript
   * stores: new Keyv({ store: redisStore })
   * ```
   *
   * @example
   * Multiple stores (multi-tier):
   * ```typescript
   * stores: [
   *   new Keyv({ store: new Cacheable({ l1: memoryStore, l2: redisStore }) }),
   * ]
   * ```
   */
  stores?:
    | Keyv
    | KeyvStoreAdapter
    | Cacheable
    | (Keyv | KeyvStoreAdapter | Cacheable)[];

  /**
   * Cache storage namespace.
   *
   * Used to prefix all keys in the cache to avoid collisions
   * between different applications or modules sharing the same store.
   *
   * @default "keyv"
   *
   * @example
   * ```typescript
   * namespace: 'user-service'
   * // Keys will be prefixed: "user-service:key"
   * ```
   */
  namespace?: string;

  /**
   * Default time-to-live in milliseconds.
   *
   * Maximum duration an item can remain in the cache before being removed.
   * Can be overridden per-operation using @CacheTTL decorator.
   *
   * @default undefined (no expiration)
   *
   * @example
   * ```typescript
   * ttl: 60000 // 1 minute
   * ```
   */
  ttl?: number;

  /**
   * Maximum number of entries kept in the built-in default in-memory store.
   *
   * This bound only applies when no custom {@link CacheManagerOptions.stores}
   * are provided. The default store is an LRU-backed in-memory Keyv store, so
   * once this many entries exist the least-recently-used ones are evicted.
   * This prevents unbounded heap growth (and eventual OOM) when distinct cache
   * keys — e.g. one per unique request URL — accumulate without a TTL.
   *
   * Set to `0` to disable the LRU bound (unbounded — not recommended).
   *
   * Ignored when you supply your own `stores`; in that case you are fully
   * responsible for bounding memory yourself.
   *
   * @default 5000
   *
   * @example
   * ```typescript
   * lruSize: 10000 // keep at most 10k entries in the default store
   * ```
   */
  lruSize?: number;

  /**
   * Threshold for background refresh of cached values.
   *
   * When set, if a cached value is retrieved and its remaining TTL
   * is less than this threshold, the value will be refreshed
   * asynchronously in the background.
   *
   * @default undefined (no background refresh)
   *
   * @example
   * ```typescript
   * ttl: 60000,           // Cache for 1 minute
   * refreshThreshold: 10000 // Refresh if less than 10 seconds remaining
   * ```
   */
  refreshThreshold?: number;

  /**
   * Whether to use non-blocking mode for multiple stores.
   *
   * When `true`, operations on secondary stores will not block
   * the main thread. This improves performance but may result
   * in stale reads from secondary stores.
   *
   * @default false
   *
   * @see [cache-manager documentation](https://www.npmjs.com/package/cache-manager#options)
   */
  nonBlocking?: boolean;
}
