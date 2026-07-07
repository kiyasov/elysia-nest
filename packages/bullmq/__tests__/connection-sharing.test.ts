import "reflect-metadata";
import { beforeEach, describe, expect, it, mock } from "bun:test";

/**
 * Regression guard for issue E1: BullMQ opens a fresh Redis socket for every
 * `Queue` and `Worker` when handed plain connection options, so an app with N
 * queues + N processors would exhaust managed-Redis connection caps.
 *
 * QueueService must instead build ONE shared ioredis client from the configured
 * options and pass that same client to every queue and worker (BullMQ then
 * `.duplicate()`s it only where a blocking connection is genuinely needed).
 *
 * bullmq and ioredis are both mocked so the test needs no live Redis.
 */

// ─── Mock bullmq: record the connection each Queue/Worker was handed ─────────

class MockQueue {
  static instances: MockQueue[] = [];
  add = mock(async () => ({ id: "1" }));
  close = mock(async () => {});
  constructor(
    public name: string,
    public options: { connection: unknown },
  ) {
    MockQueue.instances.push(this);
  }
}

class MockWorker {
  static instances: MockWorker[] = [];
  close = mock(async () => {});
  constructor(
    public name: string,
    public processor: unknown,
    public options: { connection: unknown },
  ) {
    MockWorker.instances.push(this);
  }
  on() {
    return this;
  }
}

mock.module("bullmq", () => ({ Queue: MockQueue, Worker: MockWorker }));

// ─── Mock ioredis: count how many base clients get constructed ───────────────

class MockIORedis {
  static instances: MockIORedis[] = [];
  quit = mock(async () => "OK" as const);
  disconnect = mock(() => {});
  // BullMQ duplicates the shared client for blocking connections; a real
  // duplicate is a *separate* socket, but it never counts as an extra *base*
  // client that the app itself constructed.
  duplicate = mock(() => this);
  constructor(public options: unknown) {
    MockIORedis.instances.push(this);
  }
}

mock.module("ioredis", () => ({ default: MockIORedis }));

// Import AFTER both mocks are registered.
const { QueueService } = await import("../src/bullmq.service");

const options = { connection: { host: "localhost", port: 6379 } };

beforeEach(() => {
  MockQueue.instances.length = 0;
  MockWorker.instances.length = 0;
  MockIORedis.instances.length = 0;
});

describe("QueueService — shared Redis connection (E1)", () => {
  it("builds exactly one base client for many queues and workers", () => {
    const service = new QueueService(options);

    for (let i = 0; i < 10; i++) {
      service.getQueue(`queue-${i}`);
      service.registerWorker(`queue-${i}`, async () => {});
    }

    expect(MockQueue.instances).toHaveLength(10);
    expect(MockWorker.instances).toHaveLength(10);

    // The whole point of the fix: NOT one client per instance (would be ~20),
    // just a single shared base connection.
    expect(MockIORedis.instances).toHaveLength(1);
  });

  it("hands the very same client instance to every queue and worker", () => {
    const service = new QueueService(options);

    service.getQueue("a");
    service.getQueue("b");
    service.registerWorker("a", async () => {});
    service.registerWorker("b", async () => {});

    const shared = MockIORedis.instances[0]!;

    for (const q of MockQueue.instances) {
      expect(q.options.connection).toBe(shared);
    }
    for (const w of MockWorker.instances) {
      expect(w.options.connection).toBe(shared);
    }
  });

  it("close() quits the shared client it constructed", async () => {
    const service = new QueueService(options);
    service.getQueue("email");
    service.registerWorker("email", async () => {});

    const shared = MockIORedis.instances[0]!;
    expect(shared.quit).not.toHaveBeenCalled();

    await service.close();

    expect(shared.quit).toHaveBeenCalledTimes(1);
  });

  it("reuses a caller-supplied client without constructing a new one, and does not quit it on close", async () => {
    const externalClient = new MockIORedis({ external: true });
    // Reset so we only count clients the service builds from here on.
    MockIORedis.instances.length = 0;

    const service = new QueueService({
      connection: externalClient as unknown as never,
    });
    service.getQueue("email");
    service.registerWorker("email", async () => {});

    // No new base client constructed — the caller's client was reused.
    expect(MockIORedis.instances).toHaveLength(0);
    expect(MockQueue.instances[0]!.options.connection).toBe(externalClient);
    expect(MockWorker.instances[0]!.options.connection).toBe(externalClient);

    await service.close();

    // A caller-owned client must NOT be quit by the service.
    expect(externalClient.quit).not.toHaveBeenCalled();
  });
});
