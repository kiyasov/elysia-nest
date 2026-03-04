import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from "../cache.constants";
import { CacheKey, CacheTTL } from "../decorators";

describe("@CacheKey", () => {
  it("sets string metadata on the method", () => {
    class Ctrl {
      @CacheKey("my-key")
      handler() {}
    }
    // SetMetadata stores on target.constructor (the class), not the prototype
    const meta = Reflect.getMetadata(CACHE_KEY_METADATA, Ctrl, "handler");
    expect(meta).toBe("my-key");
  });

  it("sets factory metadata on the method", () => {
    const factory = () => "dynamic";
    class Ctrl {
      @CacheKey(factory)
      handler() {}
    }
    const meta = Reflect.getMetadata(CACHE_KEY_METADATA, Ctrl, "handler");
    expect(meta).toBe(factory);
  });
});

describe("@CacheTTL", () => {
  it("sets numeric TTL metadata on the method", () => {
    class Ctrl {
      @CacheTTL(5000)
      handler() {}
    }
    const meta = Reflect.getMetadata(CACHE_TTL_METADATA, Ctrl, "handler");
    expect(meta).toBe(5000);
  });

  it("sets factory TTL metadata on the method", () => {
    const factory = () => 3000;
    class Ctrl {
      @CacheTTL(factory)
      handler() {}
    }
    const meta = Reflect.getMetadata(CACHE_TTL_METADATA, Ctrl, "handler");
    expect(meta).toBe(factory);
  });
});
