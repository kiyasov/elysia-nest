import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import { AmqpConnection } from "../src/amqp/connection";
import type { LoggerService } from "nestelia";

// Silent logger to keep test output clean.
const silentLogger: LoggerService = {
  log() {},
  error() {},
  warn() {},
  debug() {},
  verbose() {},
} as unknown as LoggerService;

/**
 * Builds an AmqpConnection without connecting to a broker and injects a fake
 * managed channel whose `addSetup` behaviour is controlled by the test.
 */
function buildConnection(addSetup: (fn: (channel: unknown) => unknown) => unknown) {
  const conn = new AmqpConnection({
    uri: "amqp://localhost",
    logger: silentLogger,
  });

  // Inject a fake managed channel — selectManagedChannel() returns _managedChannel
  // when no channel name is supplied.
  (conn as unknown as { _managedChannel: unknown })._managedChannel = {
    name: "test",
    addSetup,
  };

  return conn;
}

/** Rejects after `ms` with a marker so a hung promise fails fast. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT_HANG")), ms),
    ),
  ]);
}

// ── BUG 2: consumerFactory must reject on setup failure ──────────────

describe("consumerFactory setup failure (BUG 2)", () => {
  it("rejects the createSubscriber promise when setup throws (does not hang)", async () => {
    // amqp-connection-manager runs the setup and observes (swallows) its rejection.
    const addSetup = (fn: (channel: unknown) => unknown) => {
      Promise.resolve()
        .then(() => fn(failingChannel))
        .catch(() => {});
      return Promise.resolve();
    };

    const failingChannel = {
      assertQueue: async () => {
        throw new Error("assertQueue failed");
      },
      bindQueue: async () => {},
      consume: async () => ({ consumerTag: "never" }),
    };

    const conn = buildConnection(addSetup);

    const promise = conn.createSubscriber(
      async () => {},
      { queue: "q", exchange: "", routingKey: "" },
      "handler",
    );

    let caught: Error | undefined;
    try {
      await withTimeout(promise, 500);
    } catch (e) {
      caught = e as Error;
    }

    expect(caught).toBeDefined();
    // If it hung, the marker would surface here — that must NOT happen.
    expect(caught!.message).not.toBe("TIMEOUT_HANG");
    expect(caught!.message).toBe("assertQueue failed");
  });
});

// ── BUG 1: consumer registry must not leak on reconnect replay ───────

describe("consumer registry on reconnect (BUG 1)", () => {
  it("keeps a single live entry per queue+handler across setup replays", async () => {
    let capturedSetup: ((channel: unknown) => unknown) | undefined;
    const addSetup = (fn: (channel: unknown) => unknown) => {
      capturedSetup = fn;
      return Promise.resolve();
    };

    const tags = ["tag-1", "tag-2"];
    let tagIndex = 0;
    const channel = {
      assertQueue: async () => ({ queue: "q" }),
      bindQueue: async () => {},
      consume: async () => ({ consumerTag: tags[tagIndex++] }),
      cancel: async () => {},
      ack: () => {},
      nack: () => {},
    };

    const conn = buildConnection(addSetup);

    const promise = conn.createSubscriber(
      async () => {},
      { queue: "q", exchange: "", routingKey: "" },
      "handler",
    );

    // First connect.
    await capturedSetup!(channel);
    // Reconnect replay — same setup, new broker-generated consumerTag.
    await capturedSetup!(channel);

    await promise;

    // Only ONE live entry should remain (the newest tag), not two.
    expect(conn.consumerTags).toEqual(["tag-2"]);
  });

  it("unregisters the consumer entry after cancelConsumer", async () => {
    let capturedSetup: ((channel: unknown) => unknown) | undefined;
    const addSetup = (fn: (channel: unknown) => unknown) => {
      capturedSetup = fn;
      return Promise.resolve();
    };

    const channel = {
      assertQueue: async () => ({ queue: "q" }),
      bindQueue: async () => {},
      consume: async () => ({ consumerTag: "tag-1" }),
      cancel: async () => {},
      ack: () => {},
      nack: () => {},
    };

    const conn = buildConnection(addSetup);

    const promise = conn.createSubscriber(
      async () => {},
      { queue: "q", exchange: "", routingKey: "" },
      "handler",
    );

    await capturedSetup!(channel);
    await promise;

    expect(conn.consumerTags).toEqual(["tag-1"]);

    await conn.cancelConsumer("tag-1");

    expect(conn.consumerTags).toEqual([]);
  });
});
