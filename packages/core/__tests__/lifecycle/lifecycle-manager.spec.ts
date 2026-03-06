import { beforeEach, describe, expect, it } from "bun:test";

import type {
  BeforeApplicationShutdown,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from "~/src/interfaces/lifecycle.interface";
import {
  getLifecycleManager,
  LifecycleManager,
} from "~/src/lifecycle/lifecycle-manager";

describe("LifecycleManager", () => {
  let manager: LifecycleManager;

  beforeEach(() => {
    manager = new LifecycleManager();
  });

  describe("Registration", () => {
    it("should register a provider", () => {
      const provider = { name: "test" };

      manager.register(provider);

      // Provider is registered, no direct way to verify without triggering hooks
      expect(() => manager.triggerOnModuleInit()).not.toThrow();
    });

    it("should not throw when registering null/undefined", () => {
      expect(() => manager.register(null)).not.toThrow();
      expect(() => manager.register(undefined)).not.toThrow();
    });

    it("should register multiple providers", () => {
      const provider1 = { name: "test1" };
      const provider2 = { name: "test2" };

      manager.register(provider1);
      manager.register(provider2);

      expect(() => manager.triggerOnModuleInit()).not.toThrow();
    });
  });

  describe("OnModuleInit", () => {
    it("should call onModuleInit on registered providers", () => {
      let called = false;
      const provider: OnModuleInit = {
        onModuleInit() {
          called = true;
        },
      };

      manager.register(provider);
      manager.triggerOnModuleInit();

      expect(called).toBe(true);
    });

    it("should call onModuleInit on all registered providers", () => {
      const calls: string[] = [];

      const provider1: OnModuleInit = {
        onModuleInit() {
          calls.push("provider1");
        },
      };

      const provider2: OnModuleInit = {
        onModuleInit() {
          calls.push("provider2");
        },
      };

      manager.register(provider1);
      manager.register(provider2);
      manager.triggerOnModuleInit();

      expect(calls).toEqual(["provider1", "provider2"]);
    });

    it("should not throw for provider without onModuleInit", () => {
      const provider = { name: "test" };

      manager.register(provider);

      expect(() => manager.triggerOnModuleInit()).not.toThrow();
    });

    it("should handle mixed providers", () => {
      let called = false;

      const providerWithHook: OnModuleInit = {
        onModuleInit() {
          called = true;
        },
      };

      const providerWithoutHook = { name: "test" };

      manager.register(providerWithHook);
      manager.register(providerWithoutHook);
      manager.triggerOnModuleInit();

      expect(called).toBe(true);
    });
  });

  describe("OnApplicationBootstrap", () => {
    it("should call onApplicationBootstrap on registered providers", () => {
      let called = false;
      const provider: OnApplicationBootstrap = {
        onApplicationBootstrap() {
          called = true;
        },
      };

      manager.register(provider);
      manager.triggerOnApplicationBootstrap();

      expect(called).toBe(true);
    });

    it("should call onApplicationBootstrap on all registered providers", () => {
      const calls: string[] = [];

      const provider1: OnApplicationBootstrap = {
        onApplicationBootstrap() {
          calls.push("provider1");
        },
      };

      const provider2: OnApplicationBootstrap = {
        onApplicationBootstrap() {
          calls.push("provider2");
        },
      };

      manager.register(provider1);
      manager.register(provider2);
      manager.triggerOnApplicationBootstrap();

      expect(calls).toEqual(["provider1", "provider2"]);
    });
  });

  describe("OnModuleDestroy", () => {
    it("should call onModuleDestroy on registered providers", () => {
      let called = false;
      const provider: OnModuleDestroy = {
        onModuleDestroy() {
          called = true;
        },
      };

      manager.register(provider);
      manager.triggerOnModuleDestroy();

      expect(called).toBe(true);
    });

    it("should call onModuleDestroy on all registered providers", () => {
      const calls: string[] = [];

      const provider1: OnModuleDestroy = {
        onModuleDestroy() {
          calls.push("provider1");
        },
      };

      const provider2: OnModuleDestroy = {
        onModuleDestroy() {
          calls.push("provider2");
        },
      };

      manager.register(provider1);
      manager.register(provider2);
      manager.triggerOnModuleDestroy();

      expect(calls).toEqual(["provider1", "provider2"]);
    });
  });

  describe("BeforeApplicationShutdown", () => {
    it("should call beforeApplicationShutdown on registered providers", () => {
      let called = false;
      const provider: BeforeApplicationShutdown = {
        beforeApplicationShutdown() {
          called = true;
        },
      };

      manager.register(provider);
      manager.triggerBeforeApplicationShutdown();

      expect(called).toBe(true);
    });

    it("should call beforeApplicationShutdown on all registered providers", () => {
      const calls: string[] = [];

      const provider1: BeforeApplicationShutdown = {
        beforeApplicationShutdown() {
          calls.push("provider1");
        },
      };

      const provider2: BeforeApplicationShutdown = {
        beforeApplicationShutdown() {
          calls.push("provider2");
        },
      };

      manager.register(provider1);
      manager.register(provider2);
      manager.triggerBeforeApplicationShutdown();

      expect(calls).toEqual(["provider1", "provider2"]);
    });
  });

  describe("OnApplicationShutdown", () => {
    it("should call onApplicationShutdown on registered providers", () => {
      let called = false;
      const provider: OnApplicationShutdown = {
        onApplicationShutdown() {
          called = true;
        },
      };

      manager.register(provider);
      manager.triggerOnApplicationShutdown();

      expect(called).toBe(true);
    });

    it("should call onApplicationShutdown on all registered providers", () => {
      const calls: string[] = [];

      const provider1: OnApplicationShutdown = {
        onApplicationShutdown() {
          calls.push("provider1");
        },
      };

      const provider2: OnApplicationShutdown = {
        onApplicationShutdown() {
          calls.push("provider2");
        },
      };

      manager.register(provider1);
      manager.register(provider2);
      manager.triggerOnApplicationShutdown();

      expect(calls).toEqual(["provider1", "provider2"]);
    });
  });

  describe("Multiple hooks on single provider", () => {
    it("should support provider with multiple lifecycle hooks", () => {
      const calls: string[] = [];

      const provider: OnModuleInit & OnApplicationBootstrap & OnModuleDestroy =
        {
          onModuleInit() {
            calls.push("onModuleInit");
          },
          onApplicationBootstrap() {
            calls.push("onApplicationBootstrap");
          },
          onModuleDestroy() {
            calls.push("onModuleDestroy");
          },
        };

      manager.register(provider);
      manager.triggerOnModuleInit();
      manager.triggerOnApplicationBootstrap();
      manager.triggerOnModuleDestroy();

      expect(calls).toEqual([
        "onModuleInit",
        "onApplicationBootstrap",
        "onModuleDestroy",
      ]);
    });

    it("should support all lifecycle hooks on single provider", () => {
      const calls: string[] = [];

      const provider: OnModuleInit &
        OnApplicationBootstrap &
        OnModuleDestroy &
        BeforeApplicationShutdown &
        OnApplicationShutdown = {
        onModuleInit() {
          calls.push("onModuleInit");
        },
        onApplicationBootstrap() {
          calls.push("onApplicationBootstrap");
        },
        onModuleDestroy() {
          calls.push("onModuleDestroy");
        },
        beforeApplicationShutdown() {
          calls.push("beforeApplicationShutdown");
        },
        onApplicationShutdown() {
          calls.push("onApplicationShutdown");
        },
      };

      manager.register(provider);
      manager.triggerOnModuleInit();
      manager.triggerOnApplicationBootstrap();
      manager.triggerOnModuleDestroy();
      manager.triggerBeforeApplicationShutdown();
      manager.triggerOnApplicationShutdown();

      expect(calls).toEqual([
        "onModuleInit",
        "onApplicationBootstrap",
        "onModuleDestroy",
        "beforeApplicationShutdown",
        "onApplicationShutdown",
      ]);
    });
  });

  describe("Hook execution order", () => {
    it("should maintain registration order for hook execution", () => {
      const order: number[] = [];

      const provider1: OnModuleInit = {
        onModuleInit() {
          order.push(1);
        },
      };

      const provider2: OnModuleInit = {
        onModuleInit() {
          order.push(2);
        },
      };

      const provider3: OnModuleInit = {
        onModuleInit() {
          order.push(3);
        },
      };

      manager.register(provider1);
      manager.register(provider2);
      manager.register(provider3);
      manager.triggerOnModuleInit();

      expect(order).toEqual([1, 2, 3]);
    });
  });

  describe("getLifecycleManager", () => {
    it("should return the same instance (singleton)", () => {
      const manager1 = getLifecycleManager();
      const manager2 = getLifecycleManager();

      expect(manager1).toBe(manager2);
    });

    it("should be a LifecycleManager instance", () => {
      const manager = getLifecycleManager();

      expect(manager).toBeInstanceOf(LifecycleManager);
    });
  });

  describe("Provider with non-object type", () => {
    it("should handle primitive values gracefully", () => {
      manager.register("string" as any);
      manager.register(123 as any);
      manager.register(true as any);

      expect(() => manager.triggerOnModuleInit()).not.toThrow();
    });
  });

  describe("Multiple trigger calls", () => {
    it("should call hooks multiple times when triggered multiple times", () => {
      let count = 0;

      const provider: OnModuleInit = {
        onModuleInit() {
          count++;
        },
      };

      manager.register(provider);
      manager.triggerOnModuleInit();
      manager.triggerOnModuleInit();
      manager.triggerOnModuleInit();

      expect(count).toBe(3);
    });
  });
});
