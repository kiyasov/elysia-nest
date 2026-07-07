import { type Cache as CacheManagerInstance, createCache } from "cache-manager";
import { type Cacheable, createKeyv } from "cacheable";
import Keyv, { type KeyvStoreAdapter } from "keyv";

import type { Provider } from "nestelia";
import { CACHE_MANAGER } from "./cache.constants";
import { MODULE_OPTIONS_TOKEN } from "./cache.module-definition";
import { CacheManagerOptions } from "./interfaces/cache-manager.interface";

/**
 * Default maximum number of entries retained by the built-in in-memory store
 * when the user does not supply their own {@link CacheManagerOptions.stores}.
 *
 * Bounds the entry count of the default LRU store so that caching one value per
 * distinct key (for example, per unique request URL) cannot grow the heap
 * without limit. Override with {@link CacheManagerOptions.lruSize}.
 */
export const DEFAULT_CACHE_LRU_SIZE = 5000;

/**
 * Returns `true` when `store` is a `Cacheable` multi-tier instance
 * (identified structurally by its `primary`, `secondary`, and `nonBlocking`
 * properties).
 */
function isCacheable(store: unknown): store is Cacheable {
  return (
    typeof store === "object" &&
    store !== null &&
    "primary" in store &&
    "secondary" in store &&
    "nonBlocking" in store
  );
}

/**
 * Normalises a single store entry into the `Keyv | Cacheable` form expected
 * by `createCache`.
 *
 * - `Cacheable` instances are returned as-is (they act as store adapters).
 * - `Keyv` instances are returned as-is.
 * - Raw `KeyvStoreAdapter` implementations are wrapped in a new `Keyv`.
 */
function normaliseStore(
  store: Keyv | KeyvStoreAdapter | Cacheable,
  factoryOptions: Omit<CacheManagerOptions, "stores">,
): Keyv | Cacheable {
  if (isCacheable(store)) return store;
  if (store instanceof Keyv) return store;

  // Raw adapter — wrap it so cache-manager can use it uniformly.
  return new Keyv({
    store: store as KeyvStoreAdapter,
    ...(factoryOptions.ttl !== undefined && { ttl: factoryOptions.ttl }),
    ...(factoryOptions.namespace !== undefined && {
      namespace: factoryOptions.namespace,
    }),
  });
}

/**
 * Builds the built-in default in-memory store used when the caller does not
 * supply their own {@link CacheManagerOptions.stores}.
 *
 * Uses an LRU-backed `CacheableMemory` (via `createKeyv`) so the number of
 * retained entries is bounded by `lruSize`. Without this bound, cache-manager's
 * default store is an unbounded `Map`: caching one value per distinct key
 * (for example, per unique request URL) would grow the heap monotonically
 * until the process runs out of memory.
 *
 * The bound is overridable via {@link CacheManagerOptions.lruSize} and defaults
 * to {@link DEFAULT_CACHE_LRU_SIZE}. Setting `lruSize` to `0` disables the LRU
 * bound (unbounded — not recommended).
 */
function createDefaultStore(
  options: Omit<CacheManagerOptions, "stores">,
): Keyv {
  return createKeyv({
    lruSize: options.lruSize ?? DEFAULT_CACHE_LRU_SIZE,
    ...(options.ttl !== undefined && { ttl: options.ttl }),
    ...(options.namespace !== undefined && { namespace: options.namespace }),
  });
}

/**
 * Builds the `CACHE_MANAGER` provider that creates and configures a
 * `cache-manager` instance from the module options resolved by DI.
 *
 * Lifecycle: an `onModuleDestroy` hook is attached to the cache instance so
 * the DI container can cleanly disconnect stores on application shutdown.
 *
 * @returns A `Provider` object for use in the module's `providers` array.
 *
 * @example
 * ```typescript
 * // Used internally by CacheModule — you rarely need to call this directly.
 * const cacheManagerProvider = createCacheManager();
 * ```
 */
export function createCacheManager(): Provider {
  return {
    provide: CACHE_MANAGER,
    useFactory: async (
      options: CacheManagerOptions,
    ): Promise<CacheManagerInstance> => {
      const explicitStores: Array<Keyv | Cacheable> | undefined =
        Array.isArray(options.stores)
          ? options.stores.map((store) => normaliseStore(store, options))
          : options.stores
            ? [normaliseStore(options.stores, options)]
            : undefined;

      // When the caller provides no stores, fall back to a bounded LRU store
      // instead of cache-manager's unbounded default `Map`, so the default
      // configuration cannot grow the heap without limit.
      const stores: Array<Keyv | Cacheable> =
        explicitStores && explicitStores.length > 0
          ? explicitStores
          : [createDefaultStore(options)];

      const cacheManager: CacheManagerInstance & {
        onModuleDestroy?: () => Promise<void>;
      } = createCache({ ...options, stores: stores as Keyv[] });

      cacheManager.onModuleDestroy = async (): Promise<void> => {
        await Promise.all(
          stores.map(async (store) => {
            if (
              "disconnect" in store &&
              typeof store.disconnect === "function"
            ) {
              await (store as { disconnect(): Promise<void> }).disconnect();
            }
          }),
        );
      };

      return cacheManager;
    },
    inject: [MODULE_OPTIONS_TOKEN],
  };
}
