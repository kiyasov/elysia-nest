import "reflect-metadata";

import { afterEach, describe, expect, it } from "bun:test";

import { getLifecycleManager, Injectable } from "nestelia";
import { Test } from "../src/test";

describe("TestingModule lifecycle", () => {
  afterEach(() => {
    // Reset the global lifecycle manager so cross-file assertions stay clean.
    getLifecycleManager().clear();
  });

  describe("BUG 1 — compile fires onModuleInit, close fires destroy hooks", () => {
    it("calls onModuleInit on compile and awaits async init", async () => {
      const events: string[] = [];

      @Injectable()
      class ConnectionService {
        initialized = false;

        async onModuleInit(): Promise<void> {
          // Simulate async connect (DB/Redis/RabbitMQ).
          await Promise.resolve();
          this.initialized = true;
          events.push("init");
        }
      }

      const moduleRef = await Test.createTestingModule({
        providers: [ConnectionService],
      }).compile();

      const service = moduleRef.get<ConnectionService>(ConnectionService);
      expect(service.initialized).toBe(true);
      expect(events).toEqual(["init"]);

      await moduleRef.close();
    });

    it("calls destroy hooks in NestJS order on close and awaits async destroy", async () => {
      const events: string[] = [];

      @Injectable()
      class ConnectionService {
        closed = false;

        onModuleInit(): void {
          events.push("init");
        }

        async onModuleDestroy(): Promise<void> {
          await Promise.resolve();
          this.closed = true;
          events.push("onModuleDestroy");
        }

        beforeApplicationShutdown(): void {
          events.push("beforeApplicationShutdown");
        }

        onApplicationShutdown(): void {
          events.push("onApplicationShutdown");
        }
      }

      const moduleRef = await Test.createTestingModule({
        providers: [ConnectionService],
      }).compile();

      const service = moduleRef.get<ConnectionService>(ConnectionService);

      await moduleRef.close();

      expect(service.closed).toBe(true);
      expect(events).toEqual([
        "init",
        "onModuleDestroy",
        "beforeApplicationShutdown",
        "onApplicationShutdown",
      ]);
    });

    it("is best-effort — a throwing destroy hook does not block the others", async () => {
      const destroyed: string[] = [];

      @Injectable()
      class BadService {
        onModuleInit(): void {}
        onModuleDestroy(): void {
          throw new Error("boom");
        }
      }

      @Injectable()
      class GoodService {
        onModuleInit(): void {}
        onModuleDestroy(): void {
          destroyed.push("good");
        }
      }

      const moduleRef = await Test.createTestingModule({
        providers: [BadService, GoodService],
      }).compile();

      await moduleRef.close();

      // GoodService.onModuleDestroy must still run despite BadService throwing.
      expect(destroyed).toEqual(["good"]);
    });
  });

  describe("BUG 2 — close() must not wipe process-global state", () => {
    it("leaves an unrelated global lifecycle registration intact", async () => {
      let sentinelDestroyed = false;

      // Simulate a real app that booted and registered a provider with the
      // process-global lifecycle manager.
      const sentinel = {
        onModuleDestroy() {
          sentinelDestroyed = true;
        },
      };
      getLifecycleManager().register(sentinel);

      // Compile and close a completely unrelated, isolated TestingModule.
      @Injectable()
      class IsolatedService {
        onModuleInit(): void {}
        onModuleDestroy(): void {}
      }

      const moduleRef = await Test.createTestingModule({
        providers: [IsolatedService],
      }).compile();
      await moduleRef.close();

      // The global registration must SURVIVE — closing the isolated test
      // module must not have cleared the global lifecycle manager.
      await getLifecycleManager().triggerOnModuleDestroy();
      expect(sentinelDestroyed).toBe(true);
    });
  });
});
