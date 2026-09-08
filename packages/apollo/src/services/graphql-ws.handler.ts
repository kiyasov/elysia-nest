import type { Elysia } from "elysia";
import type { ElysiaWS } from "elysia/ws";
import * as graphql from "graphql";
import {
  execute,
  parse,
  validate,
  type ExecutionArgs,
  type ExecutionResult,
  type GraphQLError,
  type GraphQLSchema,
} from "graphql";
import {
  CloseCode,
  type ConnectionInitMessage,
  type SubscribeMessage,
} from "graphql-ws";

import type {
  ApolloContext,
  ApolloOptions,
  GraphQLWsContext,
  GraphQLWsSubscriptionsOptions,
} from "../interfaces";

/** Elysia instance with WebSocket support. */
interface ElysiaWithWs {
  /** Registers a WebSocket handler at the given path. */
  ws(path: string, options: WsHandlerOptions): unknown;
}

/** WebSocket connection context. */
interface WsContext {
  /** HTTP request object. */
  request?: Request;
}

type WsSocket = ElysiaWS<WsContext>;

/** WebSocket handler options forwarded to Elysia's `ws()`. */
interface WsHandlerOptions {
  /** Callback when a connection is opened. */
  open?: (socket: WsSocket) => void;
  /** Callback when a message is received. */
  message?: (socket: WsSocket, message: unknown) => void | Promise<void>;
  /** Callback when a connection is closed. */
  close?: (socket: WsSocket) => void;
  /**
   * Transport-level idle timeout in seconds. Bun's uWS closes the socket
   * when both directions are silent for this duration — the native
   * dead-peer detector.
   */
  idleTimeout?: number;
}

/** Handle for a single active subscription within a connection. */
interface SubscriptionHandle {
  /** Controller used to abort the subscription loop. */
  abortController: AbortController;
  /** The upstream async iterator — stored so handleClose can call return(). */
  iterator?: AsyncIterator<unknown>;
}

/** State for a WebSocket connection. */
interface ConnectionState {
  /** WebSocket socket instance. */
  socket: WsSocket;
  /** GraphQL context for this connection. */
  context: GraphQLWsContext;
  /** Whether the connection has been initialized. */
  isInitialized: boolean;
  /** Active subscriptions for this connection. */
  subscriptions: Map<string, SubscriptionHandle>;
  /** Timer for connectionInitWaitTimeout (cleared after init). */
  initTimer?: ReturnType<typeof setTimeout>;
  /** Interval for server-side keepalive pings (cleared on close). */
  keepAliveInterval?: ReturnType<typeof setInterval>;
  /**
   * Last time we saw any message from the client (ms since epoch).
   * Used by the keepAlive watchdog to detect dirty disconnects where
   * the TCP layer hasn't torn down the socket yet.
   */
  lastActivityAt: number;
  /** Whether the connection has been torn down (prevents double-cleanup). */
  closed: boolean;
}

/** Default timeout to wait for connection_init before closing (ms). */
const DEFAULT_INIT_TIMEOUT_MS = 3_000;

/** Default server-side keep-alive interval (ms). */
const DEFAULT_KEEP_ALIVE_MS = 12_000;

/**
 * Multiplier applied to `keepAlive` to derive the default pong watchdog
 * timeout. Two missed pings = assume dead peer.
 */
const DEFAULT_KEEP_ALIVE_TIMEOUT_MULTIPLIER = 2;

/** Close code used when the keep-alive watchdog detects a dead peer. */
const KEEP_ALIVE_TIMEOUT_CLOSE_CODE = 4408;

/**
 * Handler for GraphQL WebSocket subscriptions using the graphql-ws protocol.
 * Manages connections, message processing, and subscription execution.
 */
export class GraphQLWsHandler {
  private readonly connections = new Map<string, ConnectionState>();
  private readonly schema: GraphQLSchema;
  private readonly wsOptions: GraphQLWsSubscriptionsOptions;
  private readonly apolloOptions: ApolloOptions;
  private readonly elysiaApp: Elysia & ElysiaWithWs;

  /**
   * Creates a new GraphQLWsHandler.
   * @param schema - The GraphQL schema.
   * @param wsOptions - WebSocket subscription options.
   * @param apolloOptions - Apollo server options.
   * @param elysiaApp - Elysia application instance.
   */
  constructor(
    schema: GraphQLSchema,
    wsOptions: GraphQLWsSubscriptionsOptions,
    apolloOptions: ApolloOptions,
    elysiaApp: Elysia,
  ) {
    this.schema = schema;
    this.wsOptions = wsOptions;
    this.apolloOptions = apolloOptions;
    this.elysiaApp = elysiaApp as Elysia & ElysiaWithWs;
  }

  /**
   * Registers the WebSocket handler at the given path.
   * @param path - WebSocket endpoint path.
   */
  register(path: string): void {
    const idleTimeout = this.resolveTransportIdleTimeout();
    this.elysiaApp.ws(path, {
      open: (socket) => this.handleOpen(socket),
      message: (socket, message) => this.handleMessage(socket, message),
      close: (socket) => this.handleClose(socket),
      ...(idleTimeout !== undefined && { idleTimeout }),
    });
  }

  /**
   * Resolves the transport-level idle timeout (in seconds) that is
   * forwarded to Bun's `ws.idleTimeout`. Derives a sensible default from
   * the app-level `keepAliveTimeout` so the transport closes shortly
   * after our watchdog would have fired — defense-in-depth against a
   * broken app-level timer. Returns `undefined` to keep Bun's default.
   */
  private resolveTransportIdleTimeout(): number | undefined {
    const explicit = this.wsOptions.transportIdleTimeout;
    if (typeof explicit === "number") {
      return Math.max(0, Math.min(explicit, 960));
    }
    const keepAlive = this.wsOptions.keepAlive;
    const keepAliveMs =
      keepAlive === false || keepAlive === 0
        ? 0
        : typeof keepAlive === "number"
          ? keepAlive
          : DEFAULT_KEEP_ALIVE_MS;
    if (keepAliveMs === 0) return undefined;

    const configuredTimeout = this.wsOptions.keepAliveTimeout;
    if (configuredTimeout === false || configuredTimeout === 0) {
      return undefined;
    }
    const appTimeoutMs =
      typeof configuredTimeout === "number"
        ? configuredTimeout
        : keepAliveMs * DEFAULT_KEEP_ALIVE_TIMEOUT_MULTIPLIER;

    // Add a 5 s grace so the app-level watchdog fires *first*, giving us
    // a clean close + cleanup path; the transport timeout is the safety
    // net for environments where the app-level timer is disabled.
    const derivedSeconds = Math.ceil(appTimeoutMs / 1000) + 5;
    return Math.min(Math.max(derivedSeconds, 10), 960);
  }

  /**
   * Disposes all active connections, clearing keepalive timers and aborting
   * every active subscription. Call this when the server is shutting down
   * to prevent leaked timers and iterators.
   */
  dispose(): void {
    for (const state of this.connections.values()) {
      this.cleanupConnection(state);
    }
    this.connections.clear();
  }

  /**
   * Tears down a connection's subscriptions and timers. Safe to call
   * more than once on the same state — subsequent calls are no-ops.
   */
  private cleanupConnection(state: ConnectionState): void {
    if (state.closed) return;
    state.closed = true;
    clearTimeout(state.initTimer);
    clearInterval(state.keepAliveInterval);
    state.initTimer = undefined;
    state.keepAliveInterval = undefined;
    for (const handle of state.subscriptions.values()) {
      handle.abortController.abort();
      if (handle.iterator) {
        void this.callReturnWithTimeout(handle.iterator);
      }
    }
    state.subscriptions.clear();
  }

  private handleOpen(socket: WsSocket): void {
    const timeoutMs =
      this.wsOptions.connectionInitWaitTimeout ?? DEFAULT_INIT_TIMEOUT_MS;

    const initTimer = setTimeout(() => {
      const state = this.connections.get(socket.id);
      if (state && !state.isInitialized) {
        socket.close(CloseCode.ConnectionInitialisationTimeout);
      }
    }, timeoutMs);

    this.connections.set(socket.id, {
      socket,
      context: {
        connectionParams: {},
        headers: {},
        request: undefined,
      },
      isInitialized: false,
      subscriptions: new Map(),
      initTimer,
      lastActivityAt: Date.now(),
      closed: false,
    });
  }

  private async handleMessage(
    socket: WsSocket,
    rawMessage: unknown,
  ): Promise<void> {
    const state = this.connections.get(socket.id);
    if (!state) {
      return;
    }

    // Any message — including pong — counts as liveness. Update BEFORE
    // parsing so malformed messages from a live client still reset the
    // watchdog.
    state.lastActivityAt = Date.now();

    const message = this.parseMessage(rawMessage);
    if (!message) {
      socket.close(CloseCode.BadRequest);
      return;
    }

    await this.processMessage(message, state, socket);
  }

  private handleClose(socket: WsSocket): void {
    const state = this.connections.get(socket.id);
    if (state) {
      this.cleanupConnection(state);
      this.wsOptions.onDisconnect?.(state.context);
      this.wsOptions.onClose?.(state.context);
      this.connections.delete(socket.id);
    }
  }

  private parseMessage(
    rawMessage: unknown,
  ): { type: string; [key: string]: unknown } | undefined {
    try {
      if (
        typeof rawMessage === "object" &&
        rawMessage !== null &&
        "type" in rawMessage
      ) {
        return rawMessage as { type: string; [key: string]: unknown };
      }
      const text =
        typeof rawMessage === "string" ? rawMessage : String(rawMessage);
      // Windows clients (.NET Encoding.UTF8 preamble, PowerShell) often
      // prepend a UTF-8 BOM, which JSON.parse rejects.
      return JSON.parse(
        text.charCodeAt(0) === 0xfeff ? text.slice(1) : text,
      );
    } catch {
      return undefined;
    }
  }

  private async processMessage(
    message: { type: string; [key: string]: unknown },
    state: ConnectionState,
    socket: WsSocket,
  ): Promise<void> {
    switch (message.type) {
      case "connection_init": {
        // graphql-ws spec: only ONE connection_init is allowed per socket.
        // A repeated init on an already-initialized connection is a protocol
        // violation. Reject it with 4429 instead of re-initializing —
        // re-initializing would orphan a keep-alive setInterval (one per
        // duplicate init) that fires for the process lifetime, pinning the
        // closed-over connection state (socket, context, subscriptions) alive.
        if (state.isInitialized) {
          socket.close(CloseCode.TooManyInitialisationRequests);
          break;
        }
        await this.handleConnectionInit(
          message as unknown as ConnectionInitMessage,
          state,
          socket,
        );
        break;
      }

      case "subscribe": {
        await this.handleSubscribe(
          message as unknown as SubscribeMessage,
          state,
          socket,
        );
        break;
      }

      case "complete": {
        const id = String(message.id);
        const handle = state.subscriptions.get(id);
        if (handle) {
          handle.abortController.abort();
          if (handle.iterator) {
            void this.callReturnWithTimeout(handle.iterator);
          }
          state.subscriptions.delete(id);
        }
        break;
      }

      case "ping": {
        const payload = (message as { payload?: unknown }).payload;
        const pong = payload !== undefined ? { type: "pong", payload } : { type: "pong" };
        this.safeSend(socket, JSON.stringify(pong));
        break;
      }

      case "pong":
        // Client response to server-sent ping — no action needed.
        break;

      default:
        socket.close(CloseCode.BadRequest);
    }
  }

  private async handleConnectionInit(
    initMsg: ConnectionInitMessage,
    state: ConnectionState,
    socket: WsSocket,
  ): Promise<void> {
    const connectionParams = this.isRecord(initMsg.payload)
      ? initMsg.payload
      : {};

    state.context.connectionParams = connectionParams;
    state.context.request = socket.data?.request;
    state.context.headers = socket.data?.request
      ? Object.fromEntries(socket.data.request.headers.entries())
      : {};

    if (this.wsOptions.onConnect) {
      try {
        await this.wsOptions.onConnect(state.context);
      } catch {
        socket.close(CloseCode.Forbidden);
        return;
      }
      // The socket may have been torn down while we awaited the async
      // onConnect hook. Bail before sending connection_ack or installing
      // the keep-alive interval on a dead connection — otherwise we would
      // leak a timer that cleanupConnection() has already run past.
      if (state.closed) {
        return;
      }
    }

    clearTimeout(state.initTimer);
    state.isInitialized = true;
    this.safeSend(socket, JSON.stringify({ type: "connection_ack" }));
    this.startKeepAlive(state);
  }

  private startKeepAlive(state: ConnectionState): void {
    // Defensive guard: never install a second interval on the same
    // connection (a duplicate would never be cleared by cleanupConnection,
    // which only tracks the last one), and never install one on a socket
    // that has already been torn down.
    if (state.closed || state.keepAliveInterval) {
      return;
    }
    const intervalMs = this.wsOptions.keepAlive;
    // Disabled explicitly with `false` or `0`.
    if (intervalMs === false || intervalMs === 0) {
      return;
    }
    const ms = typeof intervalMs === "number" ? intervalMs : DEFAULT_KEEP_ALIVE_MS;
    const timeoutMs = this.resolveKeepAliveTimeout(ms);

    state.keepAliveInterval = setInterval(() => {
      // Dead-peer detection: if the client hasn't sent ANY message
      // (pong, ping, complete, subscribe, …) within `timeoutMs`, assume
      // the TCP connection is half-open and force-close. This triggers
      // handleClose() which releases every subscription iterator held by
      // this connection — the primary defense against subscriptionMap
      // growth under dirty disconnects.
      if (
        timeoutMs > 0 &&
        Date.now() - state.lastActivityAt > timeoutMs
      ) {
        try {
          state.socket.close(KEEP_ALIVE_TIMEOUT_CLOSE_CODE);
        } catch {
          // socket already closed
        }
        // Some transports don't fire the `close` callback when the
        // server initiates the close. Run cleanup proactively; the
        // subsequent handleClose() (if any) is a no-op thanks to
        // cleanupConnection()'s idempotency guard.
        this.handleClose(state.socket);
        return;
      }
      this.safeSend(state.socket, JSON.stringify({ type: "ping" }));
    }, ms);
  }

  private resolveKeepAliveTimeout(intervalMs: number): number {
    const configured = this.wsOptions.keepAliveTimeout;
    if (configured === false || configured === 0) return 0;
    if (typeof configured === "number") return configured;
    return intervalMs * DEFAULT_KEEP_ALIVE_TIMEOUT_MULTIPLIER;
  }

  private async handleSubscribe(
    subscribeMsg: SubscribeMessage,
    state: ConnectionState,
    socket: WsSocket,
  ): Promise<void> {
    if (!state.isInitialized) {
      socket.close(CloseCode.Unauthorized);
      return;
    }

    if (state.subscriptions.has(subscribeMsg.id)) {
      socket.close(CloseCode.SubscriberAlreadyExists);
      return;
    }

    try {
      await this.executeSubscription(subscribeMsg, state);
    } catch (err) {
      this.sendError(socket, subscribeMsg.id, [{ message: String(err) }]);
    }
  }

  private async executeSubscription(
    message: SubscribeMessage,
    state: ConnectionState,
  ): Promise<void> {
    // Register the AbortController BEFORE any await so that handleClose()
    // can abort this subscription even if the connection drops during
    // createSourceEventStream() or buildContext().
    const abortController = new AbortController();
    const handle: SubscriptionHandle = { abortController };
    state.subscriptions.set(message.id, handle);

    let ownershipTransferred = false;
    try {
      const contextValue = await this.buildContext(
        state.context.request,
        state.context.connectionParams ?? {},
      );

      const document = parse(message.payload.query);
      const validationErrors = validate(this.schema, document);
      if (validationErrors.length > 0) {
        this.sendError(
          state.socket,
          message.id,
          validationErrors.map((e) => ({ message: e.message })),
        );
        return;
      }

      let subscribeArgs: ExecutionArgs = {
        schema: this.schema,
        document,
        contextValue,
        variableValues: message.payload.variables ?? undefined,
        operationName: message.payload.operationName ?? undefined,
      };

      if (this.wsOptions.onSubscribe) {
        const hookResult = await this.wsOptions.onSubscribe(
          state.context,
          message.id,
          message.payload,
        );

        if (Array.isArray(hookResult)) {
          this.sendError(
            state.socket,
            message.id,
            hookResult.map((error) => ({ message: error.message })),
          );
          return;
        }

        if (this.isExecutionArgs(hookResult)) {
          subscribeArgs = hookResult;
        }
      }

      // Use createSourceEventStream instead of subscribe() to get the raw
      // event stream without graphql-js's mapAsyncIterator wrapper.
      // This avoids a critical issue where mapAsyncIterator calls
      // iterator.return() (killing the subscription permanently) when
      // execute() throws for a single event.
      // GraphQL 17 requires validated arguments; GraphQL 16 validates internally.
      // Keep the version-specific types at this boundary so this compiles with
      // either version's declarations, without importing a missing v16 export.
      const subscriptionApi = graphql as unknown as {
        validateSubscriptionArgs?: (
          args: ExecutionArgs,
        ) => object | readonly GraphQLError[];
        createSourceEventStream: (
          args: object,
        ) =>
          | AsyncIterable<unknown>
          | ExecutionResult
          | Promise<AsyncIterable<unknown> | ExecutionResult>;
      };
      const sourceArgs = subscriptionApi.validateSubscriptionArgs
        ? subscriptionApi.validateSubscriptionArgs(subscribeArgs)
        : subscribeArgs;
      const resultOrStream = Array.isArray(sourceArgs)
        ? { errors: sourceArgs as GraphQLError[] }
        : await subscriptionApi.createSourceEventStream(sourceArgs);

      if (
        typeof resultOrStream === "object" &&
        resultOrStream !== null &&
        Symbol.asyncIterator in resultOrStream
      ) {
        // If the connection was closed while we were setting up, clean up
        // the iterable immediately instead of leaking it.
        if (abortController.signal.aborted) {
          const iter = (resultOrStream as AsyncIterable<unknown>)[Symbol.asyncIterator]();
          try {
            iter.return?.();
          } catch {
            // ignore
          }
          return;
        }

        // Run the subscription loop in the background so the message handler
        // is not blocked and can process subsequent messages (ping, complete,
        // new subscriptions) on the same connection.
        ownershipTransferred = true;
        void this.handleAsyncIterator(
          state,
          message.id,
          resultOrStream as AsyncIterable<unknown>,
          subscribeArgs,
          handle,
        );
        return;
      }

      // Error result from createSourceEventStream.
      this.sendNext(state.socket, message.id, resultOrStream);
      this.sendComplete(state.socket, message.id);
    } finally {
      // Clean up the registration for paths that did NOT hand off to
      // handleAsyncIterator (validation errors, non-iterable results,
      // exceptions, or early abort).
      if (!ownershipTransferred && state.subscriptions.get(message.id) === handle) {
        state.subscriptions.delete(message.id);
      }
    }
  }

  private async handleAsyncIterator(
    state: ConnectionState,
    id: string,
    iterable: AsyncIterable<unknown>,
    subscribeArgs: ExecutionArgs,
    handle: SubscriptionHandle,
  ): Promise<void> {
    const iter = iterable[Symbol.asyncIterator]();
    // Store the iterator so handleClose() can call return() directly.
    handle.iterator = iter;

    const { abortController } = handle;
    try {
      while (!abortController.signal.aborted) {
        // Race the next value against the abort signal so the loop exits
        // immediately on disconnect without waiting for the next event.
        const next = await this.nextOrAbort(iter, abortController.signal);
        if (next === null || abortController.signal.aborted) {
          break;
        }
        if (next.done) {
          this.sendComplete(state.socket, id);
          return;
        }

        // Map the source event to a GraphQL response by running execute().
        // Errors are sent to the client but do NOT kill the subscription —
        // unlike graphql-js's mapAsyncIterator which calls iterator.return()
        // on the first execute() error, permanently destroying the stream.
        try {
          const result = await execute({
            ...subscribeArgs,
            rootValue: next.value,
          });
          this.sendNext(state.socket, id, result);
          await this.wsOptions.onNext?.(
            state.context,
            id,
            next.value,
            subscribeArgs,
            result,
          );
        } catch (err) {
          if (!abortController.signal.aborted) {
            this.sendError(state.socket, id, [{ message: String(err) }]);
          }
        }
      }
    } catch (err) {
      if (!abortController.signal.aborted) {
        this.sendError(state.socket, id, [{ message: String(err) }]);
      }
    } finally {
      // Signal the upstream publisher to release resources, but bound
      // the wait — a misbehaving iterator whose return() never resolves
      // would otherwise pin this frame (and its captured `subscribeArgs`
      // / `contextValue`) alive forever.
      try {
        await this.callReturnWithTimeout(iter);
      } catch {
        // ignore errors from iterator cleanup
      }
      // Drop references held by the handle so they can be GC'd even if
      // another caller still retains the handle reference.
      handle.iterator = undefined;
      // Only delete if this is still OUR handle (guards against a race
      // where the client sent "complete" + re-subscribed with the same
      // ID before our finally block ran).
      if (state.subscriptions.get(id) === handle) {
        state.subscriptions.delete(id);
      }
    }
  }

  /**
   * Calls `iter.return()` with a hard timeout. Prevents a hung
   * upstream publisher from pinning the caller's closure alive.
   */
  private async callReturnWithTimeout(
    iter: AsyncIterator<unknown>,
  ): Promise<void> {
    if (!iter.return) return;
    let returnResult: PromiseLike<IteratorResult<unknown>> | IteratorResult<unknown>;
    try {
      returnResult = iter.return();
    } catch {
      return;
    }
    const timeoutMs = 5_000;
    const returnPromise = Promise.resolve(returnResult).then(
      () => undefined,
      () => undefined,
    );
    const timeoutPromise = new Promise<void>((resolve) => {
      const t = setTimeout(resolve, timeoutMs);
      // Don't keep the event loop alive just for the timeout.
      (t as unknown as { unref?: () => void }).unref?.();
    });
    await Promise.race([returnPromise, timeoutPromise]);
  }

  /**
   * Returns the next iterator result or `null` if the abort signal fires first.
   */
  private nextOrAbort(
    iter: AsyncIterator<unknown>,
    signal: AbortSignal,
  ): Promise<IteratorResult<unknown> | null> {
    return new Promise<IteratorResult<unknown> | null>((resolve, reject) => {
      if (signal.aborted) {
        resolve(null);
        return;
      }

      const onAbort = (): void => resolve(null);
      signal.addEventListener("abort", onAbort, { once: true });

      iter.next().then(
        (result) => {
          signal.removeEventListener("abort", onAbort);
          resolve(result);
        },
        (err: unknown) => {
          signal.removeEventListener("abort", onAbort);
          reject(err as Error);
        },
      );
    });
  }

  private async buildContext(
    request: Request | undefined,
    connectionParams: Record<string, unknown>,
  ): Promise<unknown> {
    const baseContext: ApolloContext = {
      request: request ?? new Request("ws://localhost"),
      response: new Response(),
      params: {},
      store: {},
      elysiaContext: {
        connectionParams,
        headers: request ? Object.fromEntries(request.headers.entries()) : {},
        request,
      },
    };

    if (this.apolloOptions.context) {
      return this.apolloOptions.context(baseContext);
    }
    return { req: request, ctx: baseContext.elysiaContext };
  }

  /** Sends a raw string, silently ignoring errors if the socket is closed. */
  private safeSend(socket: WsSocket, data: string): void {
    try {
      socket.send(data);
    } catch {
      // socket already closed
    }
  }

  private sendNext(socket: WsSocket, id: string, payload: unknown): void {
    this.safeSend(socket, JSON.stringify({ type: "next", id, payload }));
  }

  private sendComplete(socket: WsSocket, id: string): void {
    this.safeSend(socket, JSON.stringify({ type: "complete", id }));
  }

  private sendError(
    socket: WsSocket,
    id: string,
    payload: Array<{ message: string }>,
  ): void {
    this.safeSend(socket, JSON.stringify({ type: "error", id, payload }));
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private isExecutionArgs(value: unknown): value is ExecutionArgs {
    return (
      typeof value === "object" &&
      value !== null &&
      "schema" in value &&
      "document" in value
    );
  }
}
