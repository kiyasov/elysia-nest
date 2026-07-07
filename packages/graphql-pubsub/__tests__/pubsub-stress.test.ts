import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import { PubSubAsyncIterator } from "../src/pubsub-async-iterator";
import type { PubSubEngine, MessageHandler } from "../src/interfaces";

// ─── In-memory PubSub engine ─────────────────────────────────────────────────

class InMemoryPubSub implements PubSubEngine {
  private handlers = new Map<string, Map<number, MessageHandler>>();
  private counter = 0;

  async subscribe(
    trigger: string,
    handler: MessageHandler,
  ): Promise<number> {
    const id = ++this.counter;
    let map = this.handlers.get(trigger);
    if (!map) {
      map = new Map();
      this.handlers.set(trigger, map);
    }
    map.set(id, handler);
    return id;
  }

  unsubscribe(id: number): void {
    for (const map of this.handlers.values()) {
      map.delete(id);
    }
  }

  async publish(trigger: string, message: unknown): Promise<void> {
    const map = this.handlers.get(trigger);
    if (!map) return;
    for (const handler of map.values()) {
      handler(message);
    }
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    const arr = Array.isArray(triggers) ? triggers : [triggers];
    return new PubSubAsyncIterator<T>(this, arr);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const wait = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

// ─── Stress tests ────────────────────────────────────────────────────────────

describe("PubSubAsyncIterator stress tests", () => {
  it("receives ALL messages when published synchronously in a burst", async () => {
    const pubsub = new InMemoryPubSub();
    const iter = new PubSubAsyncIterator<number>(pubsub, ["burst"]);
    await wait(0); // let subscription resolve

    const TOTAL = 200;

    // Publish all messages synchronously (no await between publishes)
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("burst", i);
    }

    // Consume all
    const received: number[] = [];
    for (let i = 0; i < TOTAL; i++) {
      const result = await iter.next();
      expect(result.done).toBe(false);
      received.push(result.value);
    }

    expect(received).toEqual(Array.from({ length: TOTAL }, (_, i) => i));
    await iter.return();
  });

  it("receives ALL messages when publish and consume interleave", async () => {
    const pubsub = new InMemoryPubSub();
    const iter = new PubSubAsyncIterator<number>(pubsub, ["interleave"]);
    await wait(0);

    const TOTAL = 200;
    const received: number[] = [];

    // Start consumer loop in background
    const consumer = (async () => {
      for (let i = 0; i < TOTAL; i++) {
        const result = await iter.next();
        if (result.done) break;
        received.push(result.value);
      }
    })();

    // Publish messages with tiny delays to interleave with consumption
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("interleave", i);
      if (i % 10 === 0) await wait(0); // yield to let consumer process
    }

    await consumer;

    expect(received).toEqual(Array.from({ length: TOTAL }, (_, i) => i));
    await iter.return();
  });

  it("receives ALL messages under rapid fire publish while consuming", async () => {
    const pubsub = new InMemoryPubSub();
    const iter = new PubSubAsyncIterator<number>(pubsub, ["rapid"]);
    await wait(0);

    const TOTAL = 500;
    const received: number[] = [];

    // Start consumer
    const consumer = (async () => {
      for (let i = 0; i < TOTAL; i++) {
        const result = await iter.next();
        if (result.done) break;
        received.push(result.value);
      }
    })();

    // Publish all at once (synchronous burst)
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("rapid", i);
    }

    await consumer;

    expect(received.length).toBe(TOTAL);
    // Verify no gaps
    for (let i = 0; i < TOTAL; i++) {
      expect(received[i]).toBe(i);
    }
    await iter.return();
  });

  it("multiple iterators on the same trigger each get ALL messages", async () => {
    const pubsub = new InMemoryPubSub();
    const iter1 = new PubSubAsyncIterator<number>(pubsub, ["fan"]);
    const iter2 = new PubSubAsyncIterator<number>(pubsub, ["fan"]);
    await wait(0);

    const TOTAL = 100;

    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("fan", i);
    }

    const received1: number[] = [];
    const received2: number[] = [];

    for (let i = 0; i < TOTAL; i++) {
      const r1 = await iter1.next();
      const r2 = await iter2.next();
      received1.push(r1.value);
      received2.push(r2.value);
    }

    expect(received1).toEqual(Array.from({ length: TOTAL }, (_, i) => i));
    expect(received2).toEqual(Array.from({ length: TOTAL }, (_, i) => i));
    await iter1.return();
    await iter2.return();
  });

  it("handles publish during await subscribePromise without losing messages", async () => {
    // This tests the race window where publish happens before the first
    // next() call completes its `await subscribePromise`.
    const pubsub = new InMemoryPubSub();
    const iter = new PubSubAsyncIterator<number>(pubsub, ["race"]);

    // Don't wait for subscription — publish immediately
    // The subscription should still be in-flight
    await wait(0); // subscribePromise resolves

    // Publish before any next() call
    pubsub.publish("race", 42);
    pubsub.publish("race", 43);

    const r1 = await iter.next();
    const r2 = await iter.next();

    expect(r1.value).toBe(42);
    expect(r2.value).toBe(43);
    await iter.return();
  });
});

// ─── GraphQL WS Handler integration stress test ─────────────────────────────

describe("GraphQL WS handler subscription stress", () => {
  it("delivers ALL messages through the full handler pipeline", async () => {
    // Import handler dynamically to keep this test file focused
    const { GraphQLWsHandler } = await import(
      "../../apollo/src/services/graphql-ws.handler"
    );
    const {
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLString,
      GraphQLInt,
    } = await import("graphql");

    const pubsub = new InMemoryPubSub();
    const TOTAL = 100;

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          counter: {
            type: GraphQLInt,
            subscribe: () => pubsub.asyncIterator("COUNTER"),
            resolve: (val: unknown) => val,
          },
        },
      }),
    });

    // Mock Elysia app
    type WsCb = {
      open?: (s: MockSock) => void;
      message?: (s: MockSock, msg: unknown) => void | Promise<void>;
      close?: (s: MockSock) => void;
    };
    const cbs: WsCb = {};
    const app = {
      ws(_path: string, opts: WsCb) {
        Object.assign(cbs, opts);
      },
    };

    // Mock socket
    class MockSock {
      readonly id = "stress-sock";
      readonly data = { request: new Request("http://localhost/graphql") };
      readonly sent: Array<{ type: string; id?: string; payload?: unknown }> = [];
      closedWith?: number;

      send(msg: string) {
        this.sent.push(JSON.parse(msg));
      }
      close(code?: number) {
        this.closedWith = code;
      }
    }

    const handler = new GraphQLWsHandler(
      schema,
      { connectionInitWaitTimeout: 5000, keepAlive: false } as any,
      {} as any,
      app as any,
    );
    handler.register("/graphql");

    const socket = new MockSock();
    cbs.open!(socket);
    await cbs.message!(socket, { type: "connection_init", payload: {} });

    // Start subscription
    await cbs.message!(socket, {
      type: "subscribe",
      id: "s1",
      payload: { query: "subscription { counter }" },
    });

    // Let subscription set up
    await wait(10);

    // Publish TOTAL messages in rapid succession
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("COUNTER", i);
    }

    // Wait for all messages to be processed through the pipeline
    // (execute() is called for each message, so give it time)
    await wait(200);

    // Close subscription
    cbs.close!(socket);

    // Count "next" messages
    const nextMessages = socket.sent.filter((m) => m.type === "next");

    // Extract values
    const values = nextMessages.map(
      (m) => (m.payload as { data: { counter: number } }).data.counter,
    );

    // Verify ALL messages were delivered
    expect(values.length).toBe(TOTAL);
    for (let i = 0; i < TOTAL; i++) {
      expect(values[i]).toBe(i);
    }
  });

  it("delivers ALL messages when resolver is slow (async execute)", async () => {
    const { GraphQLWsHandler } = await import(
      "../../apollo/src/services/graphql-ws.handler"
    );
    const {
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLString,
      GraphQLInt,
    } = await import("graphql");

    const pubsub = new InMemoryPubSub();
    const TOTAL = 30;

    // Slow resolve that simulates DB access
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          counter: {
            type: GraphQLInt,
            subscribe: () => pubsub.asyncIterator("SLOW"),
            resolve: async (val: unknown) => {
              // Simulate slow resolver (1-3ms)
              await new Promise((r) => setTimeout(r, Math.random() * 3 + 1));
              return val;
            },
          },
        },
      }),
    });

    type WsCb = {
      open?: (s: any) => void;
      message?: (s: any, msg: unknown) => void | Promise<void>;
      close?: (s: any) => void;
    };
    const cbs: WsCb = {};
    const app = {
      ws(_path: string, opts: WsCb) {
        Object.assign(cbs, opts);
      },
    };

    class MockSock {
      readonly id = "slow-sock";
      readonly data = { request: new Request("http://localhost/graphql") };
      readonly sent: Array<{ type: string; id?: string; payload?: unknown }> = [];
      send(msg: string) { this.sent.push(JSON.parse(msg)); }
      close() {}
    }

    const handler = new GraphQLWsHandler(
      schema,
      { connectionInitWaitTimeout: 5000, keepAlive: false } as any,
      {} as any,
      app as any,
    );
    handler.register("/graphql");

    const socket = new MockSock();
    cbs.open!(socket);
    await cbs.message!(socket, { type: "connection_init", payload: {} });
    await cbs.message!(socket, {
      type: "subscribe",
      id: "s1",
      payload: { query: "subscription { counter }" },
    });

    await wait(10);

    // Publish all at once — many will buffer while execute() is running
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("SLOW", i);
    }

    // Wait enough for all slow resolvers to complete (30 * 4ms max = 120ms, add margin)
    await wait(500);
    cbs.close!(socket);

    const nextMessages = socket.sent.filter((m) => m.type === "next");
    const values = nextMessages.map(
      (m) => (m.payload as { data: { counter: number } }).data.counter,
    );

    expect(values.length).toBe(TOTAL);
    for (let i = 0; i < TOTAL; i++) {
      expect(values[i]).toBe(i);
    }
  });

  it("delivers ALL messages with keepalive pings interleaved", async () => {
    const { GraphQLWsHandler } = await import(
      "../../apollo/src/services/graphql-ws.handler"
    );
    const {
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLString,
      GraphQLInt,
    } = await import("graphql");

    const pubsub = new InMemoryPubSub();
    const TOTAL = 50;

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          counter: {
            type: GraphQLInt,
            subscribe: () => pubsub.asyncIterator("PING_TEST"),
            resolve: (val: unknown) => val,
          },
        },
      }),
    });

    type WsCb = {
      open?: (s: any) => void;
      message?: (s: any, msg: unknown) => void | Promise<void>;
      close?: (s: any) => void;
    };
    const cbs: WsCb = {};
    const app = {
      ws(_path: string, opts: WsCb) {
        Object.assign(cbs, opts);
      },
    };

    class MockSock {
      readonly id = "ping-sock";
      readonly data = { request: new Request("http://localhost/graphql") };
      readonly sent: Array<{ type: string; id?: string; payload?: unknown }> = [];
      send(msg: string) { this.sent.push(JSON.parse(msg)); }
      close() {}
    }

    // Enable keepalive with short interval. Disable the pong watchdog
    // explicitly — the mock socket does not pong, and the test is
    // isolating ping-interleave behavior from dead-peer detection.
    const handler = new GraphQLWsHandler(
      schema,
      {
        connectionInitWaitTimeout: 5000,
        keepAlive: 15,
        keepAliveTimeout: false,
      } as any,
      {} as any,
      app as any,
    );
    handler.register("/graphql");

    const socket = new MockSock();
    cbs.open!(socket);
    await cbs.message!(socket, { type: "connection_init", payload: {} });
    await cbs.message!(socket, {
      type: "subscribe",
      id: "s1",
      payload: { query: "subscription { counter }" },
    });

    await wait(10);

    // Publish with delays to let pings fire between messages
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("PING_TEST", i);
      if (i % 10 === 0) await wait(20); // allow keepalive pings to fire
    }

    await wait(200);
    cbs.close!(socket);

    const nextMessages = socket.sent.filter((m) => m.type === "next");
    const values = nextMessages.map(
      (m) => (m.payload as { data: { counter: number } }).data.counter,
    );

    expect(values.length).toBe(TOTAL);
    for (let i = 0; i < TOTAL; i++) {
      expect(values[i]).toBe(i);
    }
  });

  it("delivers ALL messages when published with micro-delays", async () => {
    const { GraphQLWsHandler } = await import(
      "../../apollo/src/services/graphql-ws.handler"
    );
    const {
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLString,
      GraphQLInt,
    } = await import("graphql");

    const pubsub = new InMemoryPubSub();
    const TOTAL = 50;

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          counter: {
            type: GraphQLInt,
            subscribe: () => pubsub.asyncIterator("COUNTER2"),
            resolve: (val: unknown) => val,
          },
        },
      }),
    });

    type WsCb = {
      open?: (s: any) => void;
      message?: (s: any, msg: unknown) => void | Promise<void>;
      close?: (s: any) => void;
    };
    const cbs: WsCb = {};
    const app = {
      ws(_path: string, opts: WsCb) {
        Object.assign(cbs, opts);
      },
    };

    class MockSock {
      readonly id = "stress-sock-2";
      readonly data = { request: new Request("http://localhost/graphql") };
      readonly sent: Array<{ type: string; id?: string; payload?: unknown }> = [];
      closedWith?: number;
      send(msg: string) { this.sent.push(JSON.parse(msg)); }
      close(code?: number) { this.closedWith = code; }
    }

    const handler = new GraphQLWsHandler(
      schema,
      { connectionInitWaitTimeout: 5000, keepAlive: false } as any,
      {} as any,
      app as any,
    );
    handler.register("/graphql");

    const socket = new MockSock();
    cbs.open!(socket);
    await cbs.message!(socket, { type: "connection_init", payload: {} });
    await cbs.message!(socket, {
      type: "subscribe",
      id: "s1",
      payload: { query: "subscription { counter }" },
    });

    await wait(10);

    // Publish with micro-delays to simulate realistic timing
    for (let i = 0; i < TOTAL; i++) {
      pubsub.publish("COUNTER2", i);
      if (i % 5 === 0) await wait(1);
    }

    await wait(500);
    cbs.close!(socket);

    const nextMessages = socket.sent.filter((m) => m.type === "next");
    const values = nextMessages.map(
      (m) => (m.payload as { data: { counter: number } }).data.counter,
    );

    expect(values.length).toBe(TOTAL);
    for (let i = 0; i < TOTAL; i++) {
      expect(values[i]).toBe(i);
    }
  });
});
