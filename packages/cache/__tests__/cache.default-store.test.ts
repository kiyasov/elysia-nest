import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import type { Cache } from "cache-manager";
import Keyv from "keyv";

import type { FactoryProvider } from "nestelia";
import {
  createCacheManager,
  DEFAULT_CACHE_LRU_SIZE,
} from "../src/cache.providers";
import type { CacheManagerOptions } from "../src/interfaces/cache-manager.interface";

/**
 * Builds a cache-manager instance directly from the DI provider factory,
 * bypassing the module machinery so we can assert on the raw store behaviour.
 */
async function buildCache(options: CacheManagerOptions = {}): Promise<Cache> {
  const provider = createCacheManager() as FactoryProvider;
  return provider.useFactory(options) as Promise<Cache>;
}

describe("CacheModule default store bounding", () => {
  it("evicts oldest entries once defaults exceed the LRU bound", async () => {
    const cache = await buildCache();

    const overflow = 50;
    const total = DEFAULT_CACHE_LRU_SIZE + overflow;

    for (let i = 0; i < total; i++) {
      await cache.set(`k${i}`, i);
    }

    // The most recently written entry must survive.
    expect(await cache.get<number>(`k${total - 1}`)).toBe(total - 1);

    // The oldest entry must have been evicted. An unbounded Map would keep it,
    // so this assertion fails against the pre-fix default store.
    const oldest = await cache.get<number>("k0");
    expect(oldest ?? null).toBeNull();
  });

  it("honours a custom lruSize option", async () => {
    const cache = await buildCache({ lruSize: 5 });

    for (let i = 0; i < 20; i++) {
      await cache.set(`k${i}`, i);
    }

    expect(await cache.get<number>("k19")).toBe(19);
    expect((await cache.get<number>("k0")) ?? null).toBeNull();
  });

  it("leaves an explicit user-provided store untouched", async () => {
    const userStore = new Keyv();
    const cache = await buildCache({ stores: userStore });

    // The exact instance the user passed is used verbatim — no wrapping,
    // no substitution with the bounded default.
    expect(cache.stores[0]).toBe(userStore);

    // And it retains everything, because the user opted out of the default bound.
    for (let i = 0; i < 100; i++) {
      await cache.set(`u${i}`, i);
    }
    expect(await cache.get<number>("u0")).toBe(0);
    expect(await cache.get<number>("u99")).toBe(99);
  });
});
