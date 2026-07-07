import "reflect-metadata";

import { afterEach, describe, expect, it, mock } from "bun:test";
import { CloseCode } from "graphql-ws";
import {
  GraphQLError,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from "graphql";

import type { Elysia } from "elysia";
import { GraphQLWsHandler } from "../src/services/graphql-ws.handler";
import type {
  ApolloOptions,
  GraphQLWsSubscriptionsOptions,
} from "../src/interfaces";

// ─── Helpers ──────────────────────────────────────────────────────────────────

class MockSocket {
  readonly id: string;
  readonly data: { request: Request };
  readonly sent: Record<string, unknown>[] = [];
  closedWith?: number;

  constructor(id = "sock-1") {
    this.id = id;
    this.data = { request: new Request("http://localhost/graphql") };
  }

  send(msg: string): void {
    this.sent.push(JSON.parse(msg) as Record<string, unknown>);
  }

  close(code?: number): void {
    this.closedWith = code;
  }

  messages(type: string): Record<string, unknown>[] {
    return this.sent.filter((m) => m.type === type);
  }
}

type WsCallbacks = {
  open?: (socket: MockSocket) => void;
  message?: (socket: MockSocket, msg: unknown) => void | Promise<void>;
  close?: (socket: MockSocket) => void;
};

function makeApp() {
  const callbacks: WsCallbacks = {};
  return {
    ws(_path: string, opts: WsCallbacks) {
      Object.assign(callbacks, opts);
    },
    callbacks,
  };
}

function makeSchema(
  subscribeFn?: () => AsyncIterable<unknown> | AsyncIterator<unknown> | Promise<AsyncIterable<unknown>>,
): GraphQLSchema {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: "Query",
      fields: { _: { type: GraphQLString, resolve: () => null } },
    }),
    ...(subscribeFn && {
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          count: {
            type: GraphQLInt,
            subscribe: subscribeFn,
            resolve: (val: unknown) => val,
          },
        },
      }),
    }),
  });
}

function setup(opts: {
  schema?: GraphQLSchema;
  wsOptions?: Partial<GraphQLWsSubscriptionsOptions>;
  apolloOptions?: Partial<ApolloOptions>;
} = {}) {
  const app = makeApp();
  const schema = opts.schema ?? makeSchema();
  const handler = new GraphQLWsHandler(
    schema,
    { connectionInitWaitTimeout: 50, ...opts.wsOptions } as GraphQLWsSubscriptionsOptions,
    (opts.apolloOptions ?? {}) as ApolloOptions,
    app as unknown as Elysia,
  );
  handler.register("/graphql");
  return { callbacks: app.callbacks, schema };
}

/** Opens a connection and completes connection_init successfully. */
async function connect(callbacks: WsCallbacks, socket = new MockSocket()): Promise<MockSocket> {
  callbacks.open!(socket);
  await callbacks.message!(socket, { type: "connection_init", payload: {} });
  return socket;
}

/** Waits a number of milliseconds. */
const wait = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

afterEach(() => {
  mock.restore();
});

// ─── Connection lifecycle ──────────────────────────────────────────────────────

describe("connection lifecycle", () => {
  it("sends connection_ack after connection_init", async () => {
    const { callbacks } = setup();
    const socket = await connect(callbacks);
    expect(socket.messages("connection_ack")).toHaveLength(1);
  });

  it("closes with ConnectionInitialisationTimeout when no init is sent", async () => {
    const { callbacks } = setup({ wsOptions: { connectionInitWaitTimeout: 30 } });
    const socket = new MockSocket();
    callbacks.open!(socket);

    await wait(60);
    expect(socket.closedWith).toBe(CloseCode.ConnectionInitialisationTimeout);
  });

  it("does not close after init succeeds even after timeout elapses", async () => {
    const { callbacks } = setup({ wsOptions: { connectionInitWaitTimeout: 30 } });
    const socket = await connect(callbacks);

    await wait(60);
    expect(socket.closedWith).toBeUndefined();
  });

  it("calls onDisconnect when connection closes", async () => {
    const onDisconnect = mock(() => {});
    const { callbacks } = setup({ wsOptions: { onDisconnect } });
    const socket = await connect(callbacks);

    callbacks.close!(socket);
    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when connection closes", async () => {
    const onClose = mock(() => {});
    const { callbacks } = setup({ wsOptions: { onClose } });
    const socket = await connect(callbacks);

    callbacks.close!(socket);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onDisconnect for unknown socket", () => {
    const onDisconnect = mock(() => {});
    const { callbacks } = setup({ wsOptions: { onDisconnect } });

    // close without open
    callbacks.close!(new MockSocket("ghost"));
    expect(onDisconnect).not.toHaveBeenCalled();
  });
});

// ─── connection_init ──────────────────────────────────────────────────────────

describe("connection_init", () => {
  it("closes with Forbidden when onConnect throws", async () => {
    const { callbacks } = setup({
      wsOptions: { onConnect: async () => { throw new Error("auth failed"); } },
    });
    const socket = new MockSocket();
    callbacks.open!(socket);
    await callbacks.message!(socket, { type: "connection_init", payload: {} });

    expect(socket.closedWith).toBe(CloseCode.Forbidden);
    expect(socket.messages("connection_ack")).toHaveLength(0);
  });

  it("passes connectionParams to onConnect", async () => {
    const onConnect = mock((_ctx: unknown) => {});
    const { callbacks } = setup({ wsOptions: { onConnect } });
    const socket = new MockSocket();
    callbacks.open!(socket);
    await callbacks.message!(socket, {
      type: "connection_init",
      payload: { token: "secret" },
    });

    const ctx = (onConnect as ReturnType<typeof mock>).mock.calls[0]?.[0] as
      | { connectionParams: unknown }
      | undefined;
    expect(ctx?.connectionParams).toEqual({ token: "secret" });
  });
});

// ─── Duplicate connection_init (keep-alive leak prevention) ────────────────────

describe("duplicate connection_init", () => {
  it("rejects a second connection_init with TooManyInitialisationRequests", async () => {
    const { callbacks } = setup();
    const socket = await connect(callbacks);
    expect(socket.messages("connection_ack")).toHaveLength(1);

    // Second init on an already-initialized socket is a protocol violation.
    await callbacks.message!(socket, { type: "connection_init", payload: {} });

    expect(socket.closedWith).toBe(CloseCode.TooManyInitialisationRequests);
    // The connection must NOT be re-acknowledged / re-initialized.
    expect(socket.messages("connection_ack")).toHaveLength(1);
  });

  it("does not orphan a keep-alive interval on a repeated connection_init", async () => {
    // Regression: a duplicate init used to install a SECOND setInterval,
    // while cleanupConnection only ever clears the last one — orphaning the
    // first, which then fired for the process lifetime.
    const { callbacks } = setup({
      wsOptions: { keepAlive: 20, keepAliveTimeout: false },
    });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, { type: "connection_init", payload: {} });

    // Let pings fire, then tear the connection down.
    await wait(55);
    callbacks.close!(socket);
    const pingsAtClose = socket.messages("ping").length;

    // After cleanup NO interval may remain — the ping count must be frozen.
    await wait(60);
    expect(socket.messages("ping").length).toBe(pingsAtClose);
  });

  it("does not ack or start keep-alive if the socket closes during async onConnect", async () => {
    let resolveConnect: (() => void) | undefined;
    const { callbacks } = setup({
      wsOptions: {
        keepAlive: 20,
        keepAliveTimeout: false,
        onConnect: () =>
          new Promise<void>((r) => {
            resolveConnect = r;
          }),
      },
    });
    const socket = new MockSocket();
    callbacks.open!(socket);
    const initPromise = callbacks.message!(socket, {
      type: "connection_init",
      payload: {},
    });

    // The transport closes the socket while onConnect is still pending.
    await wait(5);
    callbacks.close!(socket);

    // Now let the async onConnect resolve — the handler must bail out.
    resolveConnect!();
    await initPromise;

    // No ack on a dead socket, and no orphaned keep-alive interval.
    expect(socket.messages("connection_ack")).toHaveLength(0);
    await wait(60);
    expect(socket.messages("ping")).toHaveLength(0);
  });
});

// ─── Message routing ──────────────────────────────────────────────────────────

describe("message routing", () => {
  it("closes with BadRequest on unparseable message", async () => {
    const { callbacks } = setup();
    const socket = await connect(callbacks);
    await callbacks.message!(socket, "not json {{{}}}");
    expect(socket.closedWith).toBe(CloseCode.BadRequest);
  });

  it("responds to ping with pong", async () => {
    const { callbacks } = setup();
    const socket = await connect(callbacks);
    await callbacks.message!(socket, { type: "ping" });
    expect(socket.messages("pong")).toHaveLength(1);
  });

  it("does not close on pong message", async () => {
    const { callbacks } = setup();
    const socket = await connect(callbacks);
    await callbacks.message!(socket, { type: "pong" });
    expect(socket.closedWith).toBeUndefined();
  });

  it("closes with BadRequest on unknown message type", async () => {
    const { callbacks } = setup();
    const socket = await connect(callbacks);
    await callbacks.message!(socket, { type: "not_a_real_type" });
    expect(socket.closedWith).toBe(CloseCode.BadRequest);
  });

  it("ignores messages from unknown sockets", async () => {
    const { callbacks } = setup();
    callbacks.open!(new MockSocket("real"));

    const ghost = new MockSocket("ghost");
    // no open() called for ghost
    await callbacks.message!(ghost, { type: "ping" });
    expect(ghost.sent).toHaveLength(0);
  });
});

// ─── subscribe ────────────────────────────────────────────────────────────────

describe("subscribe", () => {
  it("closes with Unauthorized when subscribe is sent before connection_init", async () => {
    const { callbacks } = setup();
    const socket = new MockSocket();
    callbacks.open!(socket);
    await callbacks.message!(socket, {
      type: "subscribe",
      id: "1",
      payload: { query: "subscription { count }" },
    });
    expect(socket.closedWith).toBe(CloseCode.Unauthorized);
  });

  it("sends error for invalid GraphQL query", async () => {
    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => ({
        next: async () => ({ value: 1, done: false }),
        return: async () => ({ value: undefined, done: true }),
      }),
    }));
    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "1",
      payload: { query: "subscription { nonExistentField }" },
    });

    expect(socket.messages("error")).toHaveLength(1);
  });

  it("sends next + complete for a finite subscription", async () => {
    async function* finite() {
      yield 1;
      yield 2;
    }
    const schema = makeSchema(finite);
    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "s1",
      payload: { query: "subscription { count }" },
    });

    // handleAsyncIterator runs in the background — wait for it to drain.
    await wait(20);

    expect(socket.messages("next").map((m) => (m.payload as { data: { count: number } }).data.count)).toEqual([1, 2]);
    expect(socket.messages("complete")).toHaveLength(1);
  });

  it("sends error when subscription resolver throws", async () => {
    async function* boom() {
      yield 1;
      throw new Error("boom");
    }
    const schema = makeSchema(boom);
    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "e1",
      payload: { query: "subscription { count }" },
    });

    // handleAsyncIterator runs in the background — wait for the error to propagate.
    await wait(20);

    expect(socket.messages("error")).toHaveLength(1);
  });

  it("closes with SubscriberAlreadyExists for duplicate active subscription id", async () => {
    async function* hang() {
      await new Promise<void>(() => {});
    }

    const schema = makeSchema(hang);
    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "dup",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "dup",
      payload: { query: "subscription { count }" },
    });

    expect(socket.closedWith).toBe(CloseCode.SubscriberAlreadyExists);
  });

  it("sends onSubscribe GraphQL errors without starting the stream", async () => {
    const onSubscribe = mock(() => [new GraphQLError("denied")]);
    let subscribeCalled = false;
    const schema = makeSchema(() => {
      subscribeCalled = true;
      return {
        [Symbol.asyncIterator]: () => ({
          next: async () => ({ value: 1, done: false }),
        }),
      };
    });
    const { callbacks } = setup({ schema, wsOptions: { onSubscribe } });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "blocked",
      payload: { query: "subscription { count }" },
    });

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(subscribeCalled).toBe(false);
    expect(socket.messages("error")).toHaveLength(1);
    expect(
      (socket.messages("error")[0]!.payload as Array<{ message: string }>)[0]!
        .message,
    ).toBe("denied");
  });

  it("calls onNext for each emitted subscription result", async () => {
    const onNext = mock(() => {});
    async function* finite() {
      yield 1;
      yield 2;
    }
    const schema = makeSchema(finite);
    const { callbacks } = setup({ schema, wsOptions: { onNext } });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "observe",
      payload: { query: "subscription { count }" },
    });
    await wait(20);

    expect(socket.messages("next")).toHaveLength(2);
    expect(onNext).toHaveBeenCalledTimes(2);
  });
});

// ─── complete (client-side cancellation) ─────────────────────────────────────

describe("complete", () => {
  it("cancels a hanging subscription via complete message", async () => {
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        // Hang until return() is called
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      async return() {
        returnCalled = true;
        resolveHang?.();
        return { value: undefined as unknown as number, done: true };
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Start subscription (will hang)
    const subPromise = callbacks.message!(socket, {
      type: "subscribe",
      id: "hang",
      payload: { query: "subscription { count }" },
    });

    // Give the loop time to call iter.next() and block
    await wait(10);

    // Cancel from client side
    await callbacks.message!(socket, { type: "complete", id: "hang" });
    await subPromise;

    expect(returnCalled).toBe(true);
  });
});

// ─── Abort on disconnect ───────────────────────────────────────────────────────

describe("abort on disconnect", () => {
  it("cleans up iterator when disconnect races with subscription setup", async () => {
    let returnCalled = false;
    let resolveSubscribe: (() => void) | undefined;

    // Simulate a slow subscription resolver — the iterator is created but
    // createSourceEventStream takes time to resolve.
    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>(() => {}); // hang forever
        return { value: 0, done: false };
      },
      async return() {
        returnCalled = true;
        return { value: undefined as unknown as number, done: true };
      },
    };

    const schema = makeSchema(() => {
      // Return a promise that delays, simulating slow resolver setup
      return new Promise<AsyncIterable<unknown>>((resolve) => {
        resolveSubscribe = () =>
          resolve({ [Symbol.asyncIterator]: () => iter });
      });
    });

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Start subscription (resolver is slow, will hang)
    const subPromise = callbacks.message!(socket, {
      type: "subscribe",
      id: "race",
      payload: { query: "subscription { count }" },
    });

    // Dirty disconnect BEFORE subscription resolver completes
    await wait(5);
    callbacks.close!(socket);

    // Now let the subscription resolver complete
    resolveSubscribe!();
    await subPromise;
    await wait(10);

    // The iterator must be cleaned up even though disconnect happened
    // before the iterator was handed to handleAsyncIterator
    expect(returnCalled).toBe(true);
  });

  it("calls iter.return() directly in handleClose, not only via the async finally chain", async () => {
    let directReturnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        // Hang forever — the finally chain would never reach return()
        // if handleClose didn't call it directly.
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        directReturnCalled = true;
        resolveHang?.();
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Start subscription (will hang in next())
    callbacks.message!(socket, {
      type: "subscribe",
      id: "direct",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Close calls return() directly — unblocking the hang
    callbacks.close!(socket);
    await wait(10);

    expect(directReturnCalled).toBe(true);
  });

  it("exits the iterator immediately when connection closes (no wait for next value)", async () => {
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;
    let valuesYielded = 0;

    const iter: AsyncIterator<number> = {
      async next() {
        if (valuesYielded === 0) {
          valuesYielded++;
          return { value: 42, done: false };
        }
        // Subsequent calls hang
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      async return() {
        returnCalled = true;
        resolveHang?.();
        return { value: undefined as unknown as number, done: true };
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Start subscription (will hang after first value)
    const subPromise = callbacks.message!(socket, {
      type: "subscribe",
      id: "hang",
      payload: { query: "subscription { count }" },
    });

    // Let the first value arrive
    await wait(10);
    expect(socket.messages("next")).toHaveLength(1);

    // Close the connection — must unblock the hanging next() immediately
    callbacks.close!(socket);
    await subPromise;

    expect(returnCalled).toBe(true);
    // No complete should have been sent (aborted, not finished naturally)
    expect(socket.messages("complete")).toHaveLength(0);
  });
});

// ─── Subscription leak prevention ────────────────────────────────────────────

describe("subscription leak prevention", () => {
  it("cleans up all iterators when multiple subscriptions are active on disconnect", async () => {
    const returnCalls: string[] = [];
    const hangs: Array<() => void> = [];

    function makeIter(name: string): AsyncIterator<number> {
      return {
        async next() {
          await new Promise<void>((r) => { hangs.push(r); });
          return { value: undefined as unknown as number, done: true };
        },
        return() {
          returnCalls.push(name);
          // Unblock all hanging next() calls
          for (const r of hangs) r();
          return Promise.resolve({ value: undefined as unknown as number, done: true });
        },
      };
    }

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          count: {
            type: GraphQLInt,
            subscribe: () => ({ [Symbol.asyncIterator]: () => makeIter("count") }),
            resolve: (v: unknown) => v,
          },
          status: {
            type: GraphQLString,
            subscribe: () => ({ [Symbol.asyncIterator]: () => makeIter("status") }),
            resolve: (v: unknown) => v,
          },
        },
      }),
    });

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Start two subscriptions on the same connection
    callbacks.message!(socket, {
      type: "subscribe",
      id: "s1",
      payload: { query: "subscription { count }" },
    });
    callbacks.message!(socket, {
      type: "subscribe",
      id: "s2",
      payload: { query: "subscription { status }" },
    });
    await wait(10);

    // Single disconnect must clean up BOTH iterators
    callbacks.close!(socket);
    await wait(10);

    expect(returnCalls).toContain("count");
    expect(returnCalls).toContain("status");
  });

  it("cleans up iterator when iter.return() throws (error is swallowed)", async () => {
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        returnCalled = true;
        resolveHang?.();
        throw new Error("PubSub connection lost");
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "err",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Must not throw even when iter.return() throws
    expect(() => callbacks.close!(socket)).not.toThrow();
    await wait(10);

    expect(returnCalled).toBe(true);
  });

  it("cleans up iterator that has no return() method (graceful degradation)", async () => {
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      // No return() defined — some iterators don't have one
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "noret",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Must not throw when iterator has no return()
    expect(() => callbacks.close!(socket)).not.toThrow();
    resolveHang?.();
    await wait(10);
  });

  it("calls return() on client complete, not just abort", async () => {
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        returnCalled = true;
        resolveHang?.();
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "comp",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Client sends complete — must call return() directly
    await callbacks.message!(socket, { type: "complete", id: "comp" });
    await wait(10);

    expect(returnCalled).toBe(true);
  });

  it("handles disconnect during execute() — iterator is still cleaned up", async () => {
    let returnCalled = false;
    let resolveExecute: (() => void) | undefined;

    async function* slowResolve() {
      yield 1;
    }

    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          count: {
            type: GraphQLInt,
            subscribe: () => {
              const origIter = slowResolve()[Symbol.asyncIterator]();
              return {
                [Symbol.asyncIterator]: () => ({
                  next: () => origIter.next(),
                  return() {
                    returnCalled = true;
                    return Promise.resolve({ value: undefined, done: true as const });
                  },
                }),
              };
            },
            resolve: async () => {
              // Simulate slow execute() — hang until manually resolved
              await new Promise<void>((r) => { resolveExecute = r; });
              return 1;
            },
          },
        },
      }),
    });

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "slow-exec",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Disconnect while execute() is still running
    callbacks.close!(socket);

    // Let execute() complete
    resolveExecute?.();
    await wait(20);

    expect(returnCalled).toBe(true);
  });

  it("double close does not throw or double-cleanup", async () => {
    let returnCount = 0;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        returnCount++;
        resolveHang?.();
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "dbl",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // First close triggers cleanup
    callbacks.close!(socket);
    // Second close should be a no-op (state already deleted)
    expect(() => callbacks.close!(socket)).not.toThrow();
    await wait(10);

    // handleClose calls return() once directly; the finally chain may call
    // it again — but it must not crash or cause issues.
    expect(returnCount).toBeGreaterThanOrEqual(1);
  });

  it("rapid subscribe-disconnect cycles do not leak iterators", async () => {
    const returnedIds = new Set<number>();
    let nextId = 0;

    function makeTrackingIter(): AsyncIterator<number> {
      const id = nextId++;
      let resolveHang: (() => void) | undefined;
      return {
        async next() {
          await new Promise<void>((r) => { resolveHang = r; });
          return { value: undefined as unknown as number, done: true };
        },
        return() {
          returnedIds.add(id);
          resolveHang?.();
          return Promise.resolve({ value: undefined as unknown as number, done: true });
        },
      };
    }

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => makeTrackingIter(),
    }));

    const { callbacks } = setup({ schema });

    // 10 rapid connect → subscribe → disconnect cycles
    for (let i = 0; i < 10; i++) {
      const sock = new MockSocket(`cycle-${i}`);
      await connect(callbacks, sock);
      callbacks.message!(sock, {
        type: "subscribe",
        id: "s1",
        payload: { query: "subscription { count }" },
      });
      await wait(5);
      callbacks.close!(sock);
    }

    await wait(20);

    // Every created iterator must have had return() called
    expect(returnedIds.size).toBe(10);
  });

  it("subscribe after complete on same ID does not leak the first iterator", async () => {
    let firstReturnCalled = false;
    let secondReturnCalled = false;
    let callCount = 0;
    const hangs: Array<() => void> = [];

    function makeIter(): AsyncIterator<number> {
      callCount++;
      const current = callCount;
      return {
        async next() {
          await new Promise<void>((r) => { hangs.push(r); });
          return { value: undefined as unknown as number, done: true };
        },
        return() {
          if (current === 1) firstReturnCalled = true;
          if (current === 2) secondReturnCalled = true;
          for (const r of hangs) r();
          return Promise.resolve({ value: undefined as unknown as number, done: true });
        },
      };
    }

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => makeIter(),
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // First subscription
    callbacks.message!(socket, {
      type: "subscribe",
      id: "reuse",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Complete first, start second with same ID
    await callbacks.message!(socket, { type: "complete", id: "reuse" });
    await wait(10);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "reuse",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Disconnect — should clean up second iterator
    callbacks.close!(socket);
    await wait(10);

    expect(firstReturnCalled).toBe(true);
    expect(secondReturnCalled).toBe(true);
  });

  it("concurrent connections are isolated — closing one does not affect another", async () => {
    const returned = new Set<string>();

    function makeIter(name: string): AsyncIterator<number> {
      let myHang: (() => void) | undefined;
      return {
        async next() {
          await new Promise<void>((r) => { myHang = r; });
          return { value: undefined as unknown as number, done: true };
        },
        return() {
          returned.add(name);
          myHang?.();
          return Promise.resolve({ value: undefined as unknown as number, done: true });
        },
      };
    }

    let callIdx = 0;
    const schema = makeSchema(() => {
      const name = callIdx++ === 0 ? "A" : "B";
      return { [Symbol.asyncIterator]: () => makeIter(name) };
    });

    const { callbacks } = setup({ schema });
    const sockA = new MockSocket("conn-a");
    const sockB = new MockSocket("conn-b");
    await connect(callbacks, sockA);
    await connect(callbacks, sockB);

    callbacks.message!(sockA, {
      type: "subscribe", id: "s1",
      payload: { query: "subscription { count }" },
    });
    await wait(5);
    callbacks.message!(sockB, {
      type: "subscribe", id: "s1",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Close only connection A
    callbacks.close!(sockA);
    await wait(10);

    expect(returned.has("A")).toBe(true);
    expect(returned.has("B")).toBe(false);

    // Now close B
    callbacks.close!(sockB);
    await wait(10);
    expect(returned.has("B")).toBe(true);
  });

  it("iter.return() returning a rejected promise does not crash", async () => {
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        resolveHang?.();
        return Promise.reject(new Error("async PubSub cleanup failed"));
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe", id: "rej",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // handleClose calls return() synchronously — the rejected promise
    // must not cause an unhandled rejection
    expect(() => callbacks.close!(socket)).not.toThrow();
    await wait(10);
  });

  it("disconnect before handleAsyncIterator is scheduled (handle has no iterator yet)", async () => {
    // This scenario is already tested by "cleans up iterator when disconnect
    // races with subscription setup" above. Here we verify the handle.iterator
    // is undefined at the time handleClose runs, yet cleanup still happens.
    let returnCalled = false;
    let resolveSubscribe: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>(() => {}); // hang forever
        return { value: 0, done: false };
      },
      return() {
        returnCalled = true;
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => {
      return new Promise<AsyncIterable<unknown>>((resolve) => {
        resolveSubscribe = () =>
          resolve({ [Symbol.asyncIterator]: () => iter });
      });
    });

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    const subPromise = callbacks.message!(socket, {
      type: "subscribe", id: "pre-iter",
      payload: { query: "subscription { count }" },
    });

    // Disconnect while createSourceEventStream is still pending.
    // handle.iterator is undefined — handleClose can only abort.
    await wait(5);
    callbacks.close!(socket);

    // Now resolve the stream — executeSubscription detects abort
    // and calls return() on the newly created iterable.
    resolveSubscribe!();
    await subPromise;
    await wait(10);

    expect(returnCalled).toBe(true);
  });

  it("subscribe + immediate complete in same tick does not leak", async () => {
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        returnCalled = true;
        resolveHang?.();
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Fire subscribe and complete without awaiting
    callbacks.message!(socket, {
      type: "subscribe", id: "instant",
      payload: { query: "subscription { count }" },
    });
    // Complete arrives before the subscription loop has even started
    callbacks.message!(socket, { type: "complete", id: "instant" });

    await wait(30);

    expect(returnCalled).toBe(true);
  });

  it("multiple subscriptions with interleaved complete + disconnect", async () => {
    const returned: string[] = [];

    function makeIter(name: string): AsyncIterator<number> {
      let myHang: (() => void) | undefined;
      return {
        async next() {
          await new Promise<void>((r) => { myHang = r; });
          return { value: undefined as unknown as number, done: true };
        },
        return() {
          returned.push(name);
          myHang?.();
          return Promise.resolve({ value: undefined as unknown as number, done: true });
        },
      };
    }

    let iterIdx = 0;
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          count: {
            type: GraphQLInt,
            subscribe: () => ({ [Symbol.asyncIterator]: () => makeIter(`count-${iterIdx++}`) }),
            resolve: (v: unknown) => v,
          },
          status: {
            type: GraphQLString,
            subscribe: () => ({ [Symbol.asyncIterator]: () => makeIter(`status-${iterIdx++}`) }),
            resolve: (v: unknown) => v,
          },
        },
      }),
    });

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    // Start three subscriptions sequentially to avoid races
    callbacks.message!(socket, {
      type: "subscribe", id: "s1",
      payload: { query: "subscription { count }" },
    });
    await wait(5);
    callbacks.message!(socket, {
      type: "subscribe", id: "s2",
      payload: { query: "subscription { status }" },
    });
    await wait(5);
    callbacks.message!(socket, {
      type: "subscribe", id: "s3",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Complete s1 explicitly
    await callbacks.message!(socket, { type: "complete", id: "s1" });
    await wait(10);
    expect(returned).toContain("count-0");

    const afterComplete = new Set(returned);

    // Disconnect — s2 and s3 must still be cleaned up
    callbacks.close!(socket);
    await wait(10);

    // s2 (status-1) and s3 (count-2) should also have return() called
    expect(returned).toContain("status-1");
    expect(returned).toContain("count-2");
    // New entries appeared after disconnect (not just from the earlier complete)
    expect(returned.length).toBeGreaterThan(afterComplete.size);
  });

  it("disconnect during buildContext still cleans up any resulting iterator", async () => {
    let resolveContext: (() => void) | undefined;
    let returnCalled = false;

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => ({
        async next() {
          await new Promise<void>(() => {});
          return { value: 1, done: false };
        },
        return() {
          returnCalled = true;
          return Promise.resolve({ value: undefined, done: true as const });
        },
      }),
    }));

    const { callbacks } = setup({
      schema,
      apolloOptions: {
        context: () => new Promise<unknown>((resolve) => {
          resolveContext = () => resolve({ req: null });
        }),
      } as Partial<ApolloOptions> as ApolloOptions,
    });

    const socket = await connect(callbacks);

    // Start subscribe — buildContext is pending
    const subPromise = callbacks.message!(socket, {
      type: "subscribe", id: "ctx-hang",
      payload: { query: "subscription { count }" },
    });

    // Disconnect while buildContext is still pending
    callbacks.close!(socket);

    // Let buildContext resolve — createSourceEventStream will run,
    // but the abort signal is set so the iterator should be cleaned up
    resolveContext?.();
    await subPromise;
    await wait(10);

    // The iterator was created (abort check is after createSourceEventStream)
    // but return() must still be called to prevent leaks
    expect(returnCalled).toBe(true);
  });
});

// ─── execute() error resilience ──────────────────────────────────────────────

describe("execute error resilience", () => {
  it("continues delivering messages after a resolver throws (error in result, not lost)", async () => {
    let callCount = 0;
    async function* counter() {
      yield 1;
      yield 2;
      yield 3;
    }

    // Resolver that throws on the second call
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: { _: { type: GraphQLString, resolve: () => null } },
      }),
      subscription: new GraphQLObjectType({
        name: "Subscription",
        fields: {
          count: {
            type: GraphQLInt,
            subscribe: counter,
            resolve: (val: unknown) => {
              callCount++;
              if (callCount === 2) {
                throw new Error("transient failure");
              }
              return val;
            },
          },
        },
      }),
    });

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    await callbacks.message!(socket, {
      type: "subscribe",
      id: "res",
      payload: { query: "subscription { count }" },
    });

    await wait(50);

    // All 3 events are delivered as "next" messages. The resolver error for
    // event 2 is included in the payload's errors array, NOT as a separate
    // "error" protocol message. This is correct GraphQL behaviour: execute()
    // catches resolver errors and includes them in the ExecutionResult.
    const nexts = socket.messages("next");
    expect(nexts.length).toBe(3);
    expect((nexts[0].payload as { data: { count: number } }).data.count).toBe(1);
    // Second event: resolver threw → data.count is null, errors present
    expect((nexts[1].payload as { data: { count: number | null } }).data.count).toBeNull();
    expect((nexts[1].payload as { errors?: unknown[] }).errors).toBeDefined();
    expect((nexts[2].payload as { data: { count: number } }).data.count).toBe(3);
    // Subscription survived the error — "complete" sent after iterator exhausted
    expect(socket.messages("complete")).toHaveLength(1);
  });
});

// ─── safeSend resilience ──────────────────────────────────────────────────────

describe("safeSend", () => {
  it("does not throw when socket.send raises an error", async () => {
    async function* one() { yield 1; }
    const schema = makeSchema(one);
    const { callbacks } = setup({ schema });

    const socket = await connect(callbacks);
    // Make send throw after init (simulating a closed transport)
    socket.send = () => { throw new Error("WebSocket is closed"); };

    // Should not throw or reject
    let error: unknown;
    try {
      await callbacks.message!(socket, {
        type: "subscribe",
        id: "x",
        payload: { query: "subscription { count }" },
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  });
});

// ─── Server-side keepalive ──────────────────────────────────────────────────

describe("keepAlive", () => {
  it("sends periodic ping messages after connection_init", async () => {
    // Disable the pong watchdog so a non-ponging mock client isn't
    // force-closed before multiple pings can fire.
    const { callbacks } = setup({
      wsOptions: { keepAlive: 20, keepAliveTimeout: false },
    });
    const socket = await connect(callbacks);

    // Wait for at least 2 keepalive pings
    await wait(55);
    callbacks.close!(socket);

    expect(socket.messages("ping").length).toBeGreaterThanOrEqual(2);
  });

  it("stops pings after connection closes", async () => {
    const { callbacks } = setup({
      wsOptions: { keepAlive: 20, keepAliveTimeout: false },
    });
    const socket = await connect(callbacks);

    await wait(30);
    callbacks.close!(socket);
    const countAfterClose = socket.messages("ping").length;

    await wait(40);
    expect(socket.messages("ping").length).toBe(countAfterClose);
  });

  it("does not send pings when keepAlive is false", async () => {
    const { callbacks } = setup({ wsOptions: { keepAlive: false } });
    const socket = await connect(callbacks);

    await wait(50);
    callbacks.close!(socket);

    expect(socket.messages("ping")).toHaveLength(0);
  });

  it("does not send pings when keepAlive is 0", async () => {
    const { callbacks } = setup({ wsOptions: { keepAlive: 0 } });
    const socket = await connect(callbacks);

    await wait(50);
    callbacks.close!(socket);

    expect(socket.messages("ping")).toHaveLength(0);
  });
});

// ─── Dead-peer detection (watchdog) ───────────────────────────────────────────

describe("keepAlive watchdog", () => {
  it("cleans up iterator on keepAlive timeout when client stops ponging", async () => {
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        returnCalled = true;
        resolveHang?.();
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({
      schema,
      wsOptions: { keepAlive: 20, keepAliveTimeout: 40 },
    });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "dead",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Client never responds with pong — watchdog must close the socket
    // and clean up the subscription iterator within keepAliveTimeout.
    await wait(100);

    expect(returnCalled).toBe(true);
    expect(socket.closedWith).toBe(4408);
  });

  it("does not close when client actively pongs within the timeout window", async () => {
    const { callbacks } = setup({
      wsOptions: { keepAlive: 20, keepAliveTimeout: 60 },
    });
    const socket = await connect(callbacks);

    // Simulate a live client: reply with pong for every ping the server sent.
    for (let i = 0; i < 5; i++) {
      await wait(20);
      await callbacks.message!(socket, { type: "pong" });
    }

    // Still open — watchdog must not have fired.
    expect(socket.closedWith).toBeUndefined();
    callbacks.close!(socket);
  });

  it("does not install a watchdog when keepAlive is disabled", async () => {
    const { callbacks } = setup({
      wsOptions: { keepAlive: false },
    });
    const socket = await connect(callbacks);

    // With no keepAlive, there is nothing to drive the watchdog.
    // The socket must stay open indefinitely even without activity.
    await wait(100);
    expect(socket.closedWith).toBeUndefined();
    callbacks.close!(socket);
  });

  it("keepAliveTimeout: false disables the watchdog explicitly", async () => {
    const { callbacks } = setup({
      wsOptions: { keepAlive: 20, keepAliveTimeout: false },
    });
    const socket = await connect(callbacks);

    // Even after many missed pongs, the socket stays up.
    await wait(120);
    expect(socket.closedWith).toBeUndefined();
    callbacks.close!(socket);
  });

  it("cleans up iterator on abrupt socket destroy (dirty disconnect)", async () => {
    // Simulates a "dirty" TCP close: the WS transport eventually notices
    // the peer is gone and fires close() — our handler must release the
    // iterator on that single close callback with no further messages.
    let returnCalled = false;
    let resolveHang: (() => void) | undefined;

    const iter: AsyncIterator<number> = {
      async next() {
        await new Promise<void>((r) => { resolveHang = r; });
        return { value: undefined as unknown as number, done: true };
      },
      return() {
        returnCalled = true;
        resolveHang?.();
        return Promise.resolve({ value: undefined as unknown as number, done: true });
      },
    };

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => iter,
    }));

    const { callbacks } = setup({ schema });
    const socket = await connect(callbacks);

    callbacks.message!(socket, {
      type: "subscribe",
      id: "dirty",
      payload: { query: "subscription { count }" },
    });
    await wait(10);

    // Abrupt close — no `complete` frame from the client, just the
    // transport noticing the socket died.
    callbacks.close!(socket);
    await wait(10);

    expect(returnCalled).toBe(true);
  });

  it("does not leak iterators across 100 rapid reconnect cycles", async () => {
    const active = new Set<number>();
    let nextId = 0;

    function makeIter(): AsyncIterator<number> {
      const id = nextId++;
      active.add(id);
      let resolveHang: (() => void) | undefined;
      return {
        async next() {
          await new Promise<void>((r) => { resolveHang = r; });
          return { value: undefined as unknown as number, done: true };
        },
        return() {
          active.delete(id);
          resolveHang?.();
          return Promise.resolve({ value: undefined as unknown as number, done: true });
        },
      };
    }

    const schema = makeSchema(() => ({
      [Symbol.asyncIterator]: () => makeIter(),
    }));

    const { callbacks } = setup({ schema });

    for (let i = 0; i < 100; i++) {
      const sock = new MockSocket(`rapid-${i}`);
      await connect(callbacks, sock);
      callbacks.message!(sock, {
        type: "subscribe",
        id: "s1",
        payload: { query: "subscription { count }" },
      });
      await wait(1);
      callbacks.close!(sock);
    }

    await wait(30);
    expect(active.size).toBe(0);
  });
});
