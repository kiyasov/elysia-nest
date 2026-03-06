import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { CacheModule } from "../src/cache.module";

describe("CacheModule", () => {
  describe("register", () => {
    it("returns a DynamicModule shape", () => {
      const mod = CacheModule.register();
      expect(mod).toHaveProperty("module");
      expect(Array.isArray(mod.providers)).toBe(true);
    });

    it("isGlobal maps to global: true", () => {
      const mod = CacheModule.register({ isGlobal: true });
      expect(mod.global).toBe(true);
    });

    it("isGlobal defaults to false", () => {
      const mod = CacheModule.register();
      expect(mod.global).toBe(false);
    });
  });

  describe("registerAsync", () => {
    it("returns a DynamicModule with imports array", () => {
      const mod = CacheModule.registerAsync({
        useFactory: async () => ({ ttl: 1000 }),
      });
      expect(mod).toHaveProperty("module");
      expect(Array.isArray(mod.providers)).toBe(true);
      expect(Array.isArray(mod.imports)).toBe(true);
    });

    it("isGlobal maps to global: true", () => {
      const mod = CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async () => ({}),
      });
      expect(mod.global).toBe(true);
    });

    it("useClass produces a provider for that class", () => {
      class FakeConfig {
        createCacheOptions() {
          return {};
        }
      }
      const mod = CacheModule.registerAsync({ useClass: FakeConfig as any });
      const hasClassProvider = mod.providers?.some(
        (p) => typeof p === "object" && "useClass" in p && p.useClass === FakeConfig,
      );
      expect(hasClassProvider).toBe(true);
    });
  });

  describe("forRoot", () => {
    it("behaves like register — returns DynamicModule", () => {
      const a = CacheModule.register();
      const b = CacheModule.forRoot();
      expect(Object.keys(b)).toEqual(Object.keys(a));
    });

    it("isGlobal maps to global: true", () => {
      expect(CacheModule.forRoot({ isGlobal: true }).global).toBe(true);
    });
  });

  describe("forRootAsync", () => {
    it("behaves like registerAsync — returns DynamicModule", () => {
      const a = CacheModule.registerAsync({ useFactory: async () => ({}) });
      const b = CacheModule.forRootAsync({ useFactory: async () => ({}) });
      expect(Object.keys(b)).toEqual(Object.keys(a));
    });

    it("isGlobal maps to global: true", () => {
      const mod = CacheModule.forRootAsync({
        isGlobal: true,
        useFactory: async () => ({}),
      });
      expect(mod.global).toBe(true);
    });
  });
});
