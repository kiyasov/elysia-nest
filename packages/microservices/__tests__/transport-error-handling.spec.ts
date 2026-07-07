import "reflect-metadata";

import { afterEach, describe, expect, it } from "bun:test";

import { RedisClient } from "../src/client/redis.client";
import { ElysiaNestApplication } from "../src/elysia-nest-application";
import { Transport } from "../src/enums/transport.enum";
import type { Server } from "../src/interfaces";
import { TcpServer } from "../src/transports/tcp.server";

/**
 * Regression tests for two HIGH-severity crash bugs:
 *
 *  BUG 1 — Transport servers emit `"error"` with zero listeners, which throws
 *          `ERR_UNHANDLED_ERROR` and crashes the whole process. The framework
 *          must attach a default `"error"` listener when starting a
 *          microservice.
 *
 *  BUG 2 — `RedisClient.connect()` never attaches `"error"` listeners nor a
 *          bounded retry strategy, so a down Redis both crashes the process
 *          (unhandled `"error"`) and hangs bootstrap forever (the connect
 *          promise never settles).
 */
describe("Transport error handling", () => {
  // ─── BUG 1 ────────────────────────────────────────────────────────────────
  describe("BUG 1 — server 'error' events must not crash the process", () => {
    let app: ElysiaNestApplication;

    afterEach(async () => {
      await app?.close();
    });

    it("does not throw when a started TCP server emits 'error' with no user listener", async () => {
      app = new ElysiaNestApplication();
      // Ephemeral port — no external services required.
      app.connectMicroservice({
        transport: Transport.TCP,
        options: { port: 0 },
      });

      await app.startAllMicroservices();

      const [{ server }] = app.getMicroservices();
      const tcp = server as TcpServer;

      // Before the fix, emitting "error" with zero listeners throws
      // ERR_UNHANDLED_ERROR synchronously and crashes the process.
      expect(() =>
        (tcp as unknown as Server & { emit: (e: string, ...a: unknown[]) => boolean }).emit(
          "error",
          new Error("simulated client ECONNRESET"),
        ),
      ).not.toThrow();
    });
  });

  // ─── BUG 2 ────────────────────────────────────────────────────────────────
  describe("BUG 2 — RedisClient.connect() must reject (not hang) when Redis is down", () => {
    it("rejects within a short timeout instead of hanging when the port is closed", async () => {
      // 127.0.0.1:1 is a privileged/unused port → connection is refused.
      const client = new RedisClient({
        host: "127.0.0.1",
        port: 1,
        retryAttempts: 1,
        retryDelay: 50,
      });

      const HANG_GUARD_MS = 3000;

      // If connect() hangs (the bug), the guard wins with "timeout" and the
      // assertion fails fast instead of the test running forever.
      const outcome = await Promise.race([
        client
          .connect()
          .then(() => "resolved" as const)
          .catch(() => "rejected" as const),
        new Promise<"timeout">((resolve) =>
          setTimeout(() => resolve("timeout"), HANG_GUARD_MS),
        ),
      ]);

      // Always tear the client down so a stray connection cannot keep the
      // process (or its EventEmitter) alive between tests.
      client.close();

      expect(outcome).toBe("rejected");
    });
  });
});
