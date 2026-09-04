import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import { GraphQLWsHandler } from "../src/services/graphql-ws.handler";
import type {
  ApolloOptions,
  GraphQLWsSubscriptionsOptions,
} from "../src/interfaces";

interface Tracker {
  /** Number of distinct iterators that were created. */
  iterators: number;
  /** Set of iterator IDs for which return() has been called at least once. */
  returned: Set<number>;
}

let nextPort = 39100;

function getTestPort(): number {
  return nextPort++;
}

function makeSchema(): { schema: GraphQLSchema; track: Tracker } {
  const track: Tracker = { iterators: 0, returned: new Set() };
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
          subscribe: () => {
            const iterId = track.iterators++;
            let resolveHang: (() => void) | undefined;
            return {
              [Symbol.asyncIterator]() {
                return {
                  async next() {
                    await new Promise<void>((r) => { resolveHang = r; });
                    return { value: undefined as unknown as number, done: true };
                  },
                  async return() {
                    track.returned.add(iterId);
                    resolveHang?.();
                    return { value: undefined as unknown as number, done: true };
                  },
                };
              },
            };
          },
          resolve: (v: unknown) => v,
        },
      },
    }),
  });
  return { schema, track };
}

async function startServer(
  opts: Partial<GraphQLWsSubscriptionsOptions> = {},
): Promise<{
  url: string;
  track: Tracker;
  handler: GraphQLWsHandler;
  stop: () => void;
}> {
  const { schema, track } = makeSchema();
  const app = new Elysia();
  const handler = new GraphQLWsHandler(
    schema,
    {
      connectionInitWaitTimeout: 500,
      keepAlive: 100,
      keepAliveTimeout: 200,
      ...opts,
    },
    {} as ApolloOptions,
    app,
  );
  handler.register("/graphql");

  const port = getTestPort();
  const server = app.listen(port);
  await new Promise((r) => setTimeout(r, 30));
  const url = `ws://localhost:${port}/graphql`;
  return {
    url,
    track,
    handler,
    stop: () => {
      handler.dispose();
      (server as unknown as { stop: (active?: boolean) => void }).stop(true);
    },
  };
}

function openWs(url: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url, "graphql-transport-ws");
    const to = setTimeout(() => reject(new Error("WS open timeout")), 2_000);
    ws.addEventListener("open", () => {
      clearTimeout(to);
      resolve(ws);
    });
    ws.addEventListener("error", (e) => {
      clearTimeout(to);
      reject(e);
    });
  });
}

function send(ws: WebSocket, msg: object): void {
  ws.send(JSON.stringify(msg));
}

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

describe("GraphQLWsHandler e2e (real Bun WS)", () => {
  it("cleans up iterator on client.complete() message", async () => {
    const { url, track, stop } = await startServer({ keepAliveTimeout: false });
    try {
      const ws = await openWs(url);
      send(ws, { type: "connection_init", payload: {} });
      await sleep(30);
      send(ws, {
        type: "subscribe",
        id: "1",
        payload: { query: "subscription { counter }" },
      });
      await sleep(30);
      expect(track.iterators).toBe(1);

      send(ws, { type: "complete", id: "1" });
      await sleep(50);
      expect(track.returned.size).toBe(1);
      ws.close();
    } finally {
      stop();
    }
  });

  it("cleans up iterator on WebSocket close without GraphQL complete", async () => {
    const { url, track, stop } = await startServer({ keepAliveTimeout: false });
    try {
      const ws = await openWs(url);
      send(ws, { type: "connection_init", payload: {} });
      await sleep(30);
      send(ws, {
        type: "subscribe",
        id: "dirty",
        payload: { query: "subscription { counter }" },
      });
      await sleep(30);
      expect(track.iterators).toBe(1);

      // Disconnect without sending a GraphQL `complete` message. Code 1006 is
      // reserved and cannot be sent in a WebSocket close frame (RFC 6455).
      ws.close();
      await sleep(100);
      expect(track.returned.size).toBe(1);
    } finally {
      stop();
    }
  });

  it("cleans up iterator on keepAlive timeout when client stops ponging", async () => {
    // Short watchdog; client NEVER pongs back.
    const { url, track, stop } = await startServer({
      keepAlive: 50,
      keepAliveTimeout: 120,
    });
    try {
      const ws = await openWs(url);
      // Swallow all server-sent frames — in particular never pong.
      ws.addEventListener("message", () => {});
      send(ws, { type: "connection_init", payload: {} });
      await sleep(30);
      send(ws, {
        type: "subscribe",
        id: "dead",
        payload: { query: "subscription { counter }" },
      });
      await sleep(30);
      expect(track.iterators).toBe(1);

      // Watchdog should fire within ~120ms; wait with generous margin.
      await sleep(400);
      expect(track.returned.size).toBe(1);

      try { ws.close(); } catch { /* already closed by server */ }
    } finally {
      stop();
    }
  });

  it("does not leak when client reconnects rapidly (50 cycles)", async () => {
    const { url, track, stop } = await startServer({ keepAliveTimeout: false });
    try {
      for (let i = 0; i < 50; i++) {
        const ws = await openWs(url);
        send(ws, { type: "connection_init", payload: {} });
        await sleep(5);
        send(ws, {
          type: "subscribe",
          id: `r${i}`,
          payload: { query: "subscription { counter }" },
        });
        await sleep(5);
        ws.close();
        await sleep(5);
      }

      await sleep(100);
      // Every iterator that was created must have been returned.
      expect(track.iterators).toBe(50);
      expect(track.returned.size).toBe(50);
    } finally {
      stop();
    }
  });
});
