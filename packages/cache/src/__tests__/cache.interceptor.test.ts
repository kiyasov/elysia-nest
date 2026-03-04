import "reflect-metadata";

import { describe, expect, it, mock } from "bun:test";
import { firstValueFrom, of } from "rxjs";

import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from "../cache.constants";
import { CacheInterceptor } from "../interceptors/cache.interceptor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = any;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCacheManager(cachedValue: unknown = undefined) {
  return {
    get: mock(() => Promise.resolve(cachedValue)),
    set: mock(() => Promise.resolve()),
  };
}

/**
 * Reflector mock: returns cacheKey for CACHE_KEY_METADATA,
 * cacheTtl for CACHE_TTL_METADATA, null otherwise.
 */
function makeReflector(
  cacheKey: string | Function | null = null,
  cacheTtl: number | Function | null = null,
) {
  return {
    get: mock((key: string) => {
      if (key === CACHE_KEY_METADATA) return cacheKey;
      if (key === CACHE_TTL_METADATA) return cacheTtl;
      return null;
    }),
  };
}

function makeContext(method = "GET"): Ctx {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    getArgByIndex: () => ({ method, url: "/items" }),
    switchToHttp: () => ({
      getRequest: () => ({ method }),
      getResponse: () => ({}),
    }),
  } as unknown as Ctx;
}

function makeCallHandler(value: unknown) {
  return { handle: mock(() => of(value)) };
}

/** Exposes protected trackBy for unit testing. */
class InspectableInterceptor extends CacheInterceptor {
  public trackByPublic(ctx: Ctx) {
    return this.trackBy(ctx);
  }
}

// ---------------------------------------------------------------------------
// trackBy
// ---------------------------------------------------------------------------

describe("CacheInterceptor.trackBy", () => {
  it("returns undefined when no @CacheKey and no httpAdapterHost", () => {
    const interceptor = new InspectableInterceptor(
      makeCacheManager() as any,
      makeReflector() as any,
    );
    expect(interceptor.trackByPublic(makeContext())).toBeUndefined();
  });

  it("returns sanitized string from @CacheKey", () => {
    const interceptor = new InspectableInterceptor(
      makeCacheManager() as any,
      makeReflector("products-list") as any,
    );
    expect(interceptor.trackByPublic(makeContext())).toBe("products-list");
  });

  it("calls @CacheKey factory with context and returns result", () => {
    const factory = mock((_ctx: Ctx) => "dynamic-key");
    const interceptor = new InspectableInterceptor(
      makeCacheManager() as any,
      makeReflector(factory as any) as any,
    );
    const ctx = makeContext();
    expect(interceptor.trackByPublic(ctx)).toBe("dynamic-key");
    expect(factory).toHaveBeenCalledWith(ctx);
  });

  it("returns URL from httpAdapter for GET requests", () => {
    const httpAdapter = {
      getRequestMethod: (req: any) => req.method,
      getRequestUrl: (_req: any) => "/items",
    };
    const interceptor = new InspectableInterceptor(
      makeCacheManager() as any,
      makeReflector() as any,
      { httpAdapter } as any,
    );
    expect(interceptor.trackByPublic(makeContext("GET"))).toBe("/items");
  });

  it("returns undefined for non-GET when using httpAdapter", () => {
    const httpAdapter = {
      getRequestMethod: (req: any) => req.method,
      getRequestUrl: (_req: any) => "/items",
    };
    const interceptor = new InspectableInterceptor(
      makeCacheManager() as any,
      makeReflector() as any,
      { httpAdapter } as any,
    );
    expect(interceptor.trackByPublic(makeContext("POST"))).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Sanitization (tested through trackBy)
// ---------------------------------------------------------------------------

describe("cache key sanitization", () => {
  function sanitize(raw: string) {
    const interceptor = new InspectableInterceptor(
      makeCacheManager() as any,
      makeReflector(raw) as any,
    );
    return interceptor.trackByPublic(makeContext());
  }

  it("removes null bytes", () => {
    expect(sanitize("key\0value")).toBe("keyvalue");
  });

  it("replaces path traversal sequences", () => {
    // each `../` is an independent match → two `_` replacements
    expect(sanitize("../../etc/passwd")).toBe("__etc/passwd");
  });

  it("removes control characters", () => {
    expect(sanitize("key\x01\x1fvalue")).toBe("keyvalue");
  });

  it("replaces < > ' \" ` with _", () => {
    expect(sanitize("<script>")).toBe("_script_");
  });

  it("replaces unicode replacement character", () => {
    expect(sanitize("key\uFFFDvalue")).toBe("keyvalue");
  });

  it("truncates keys longer than 250 chars", () => {
    const long = "a".repeat(300);
    expect(sanitize(long)!.length).toBe(250);
  });
});

// ---------------------------------------------------------------------------
// intercept — cache hit
// ---------------------------------------------------------------------------

describe("CacheInterceptor.intercept — cache hit", () => {
  it("returns cached value without calling handler", async () => {
    const cacheManager = makeCacheManager({ data: "cached" });
    const handler = makeCallHandler("fresh");
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector("products") as any,
    );

    const observable = await interceptor.intercept(makeContext(), handler);
    const result = await firstValueFrom(observable);

    expect(result).toEqual({ data: "cached" });
    expect(handler.handle).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// intercept — cache miss
// ---------------------------------------------------------------------------

describe("CacheInterceptor.intercept — cache miss", () => {
  it("calls handler and stores result in cache", async () => {
    const cacheManager = makeCacheManager(undefined);
    const handler = makeCallHandler({ items: [] });
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector("items") as any,
    );

    const observable = await interceptor.intercept(makeContext(), handler);
    await firstValueFrom(observable);
    // give the async tap time to run
    await new Promise((r) => setTimeout(r, 10));

    expect(handler.handle).toHaveBeenCalledTimes(1);
    expect(cacheManager.set).toHaveBeenCalledWith("items", { items: [] });
  });

  it("stores result with TTL when @CacheTTL is set", async () => {
    const cacheManager = makeCacheManager(undefined);
    const handler = makeCallHandler("data");
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector("key", 5000) as any,
    );

    const observable = await interceptor.intercept(makeContext(), handler);
    await firstValueFrom(observable);
    await new Promise((r) => setTimeout(r, 10));

    expect(cacheManager.set).toHaveBeenCalledWith("key", "data", 5000);
  });

  it("evaluates TTL factory and stores with resulting value", async () => {
    const cacheManager = makeCacheManager(undefined);
    const handler = makeCallHandler("data");
    const ctx = makeContext();
    const ttlFactory = mock((_ctx: Ctx) => 3000);
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector("key", ttlFactory as any) as any,
    );

    const observable = await interceptor.intercept(ctx, handler);
    await firstValueFrom(observable);
    await new Promise((r) => setTimeout(r, 10));

    expect(ttlFactory).toHaveBeenCalledWith(ctx);
    expect(cacheManager.set).toHaveBeenCalledWith("key", "data", 3000);
  });
});

// ---------------------------------------------------------------------------
// intercept — no cache key
// ---------------------------------------------------------------------------

describe("CacheInterceptor.intercept — no cache key", () => {
  it("passes through to handler without touching cache", async () => {
    const cacheManager = makeCacheManager(undefined);
    const handler = makeCallHandler("result");
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector() as any, // no @CacheKey, no httpAdapterHost
    );

    const observable = await interceptor.intercept(makeContext(), handler);
    const result = await firstValueFrom(observable);

    expect(result).toBe("result");
    expect(cacheManager.get).not.toHaveBeenCalled();
    expect(cacheManager.set).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// intercept — cache error recovery
// ---------------------------------------------------------------------------

describe("CacheInterceptor.intercept — cache error", () => {
  it("falls through to handler when cacheManager.get throws", async () => {
    const cacheManager = {
      get: mock(() => Promise.reject(new Error("redis down"))),
      set: mock(() => Promise.resolve()),
    };
    const handler = makeCallHandler("fallback");
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector("key") as any,
    );

    const observable = await interceptor.intercept(makeContext(), handler);
    const result = await firstValueFrom(observable);

    expect(result).toBe("fallback");
  });
});

// ---------------------------------------------------------------------------
// intercept — StreamableFile not cached
// ---------------------------------------------------------------------------

describe("CacheInterceptor.intercept — StreamableFile", () => {
  it("does not cache StreamableFile responses", async () => {
    // Import StreamableFile at runtime to avoid circular dep issues
    const { StreamableFile } = await import("@kiyasov/elysia-nest");
    const streamable = new StreamableFile(new Uint8Array([1, 2, 3]));

    const cacheManager = makeCacheManager(undefined);
    const handler = makeCallHandler(streamable);
    const interceptor = new CacheInterceptor(
      cacheManager as any,
      makeReflector("stream-key") as any,
    );

    const observable = await interceptor.intercept(makeContext(), handler);
    await firstValueFrom(observable);
    await new Promise((r) => setTimeout(r, 10));

    expect(cacheManager.set).not.toHaveBeenCalled();
  });
});
