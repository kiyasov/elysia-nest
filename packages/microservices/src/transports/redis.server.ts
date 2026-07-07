import { randomUUID } from "node:crypto";

import type RedisType from "ioredis";

import type { MessageHandler, RedisOptions } from "../interfaces";
import { BaseServer } from "./server";

type RedisClientType = RedisType;

// eslint-disable-next-line @typescript-eslint/no-require-imports
let Redis: typeof RedisType | undefined;

try {
  // Dynamic import keeps ioredis an optional peer dependency.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Redis = require("ioredis").default;
} catch {
  // ioredis not installed – error is thrown lazily in the constructor.
}

/**
 * Transport server that uses Redis Pub/Sub for message passing.
 *
 * - Request-response: client publishes to `<pattern>`, server publishes the
 *   response to `<pattern>.reply` with the originating request `id`.
 * - Fire-and-forget: client publishes to `<pattern>` without an `id` field.
 *
 * Requires the optional peer dependency `ioredis`.
 */
export class RedisServer extends BaseServer {
  private subClient?: RedisClientType;
  private pubClient?: RedisClientType;

  /** Tracks Redis channels the subscriber is already subscribed to. */
  private readonly subscribedChannels = new Set<string>();

  /** Pending server-initiated RPC id → settle callback. */
  private readonly pendingRequests = new Map<
    string,
    (reply: Record<string, unknown>) => void
  >();

  /**
   * Reference counts per reply channel. A reply channel stays subscribed while
   * at least one waiter needs it, so concurrent {@link sendMessage} calls on the
   * same pattern never unsubscribe each other's replies.
   */
  private readonly replyChannelRefCounts = new Map<string, number>();

  private isConnected = false;

  constructor(private readonly options: RedisOptions) {
    super();
    if (!Redis) {
      throw new Error(
        "ioredis is required to use the Redis transport. " +
          "Install it with: bun add ioredis",
      );
    }
  }

  /**
   * Establishes Redis subscriber and publisher connections then subscribes to
   * all registered pattern channels.
   */
  public listen(callback?: (err?: unknown) => void): void {
    try {
      const baseOptions: RedisType["options"] = {
        host: this.options.host ?? "localhost",
        port: this.options.port ?? 6379,
        password: this.options.password,
        db: this.options.db ?? 0,
        retryStrategy: (times: number) => {
          const maxRetries = this.options.retryAttempts ?? 3;
          const delay = this.options.retryDelay ?? 1000;
          return times > maxRetries ? null : delay * times;
        },
      };

      const RedisCtor = Redis!;

      this.subClient = this.options.url
        ? new RedisCtor(this.options.url, baseOptions)
        : new RedisCtor(baseOptions);

      this.pubClient = this.options.url
        ? new RedisCtor(this.options.url, baseOptions)
        : new RedisCtor(baseOptions);

      this.subClient.on("message", (channel: string, message: string) => {
        void this.handleRedisMessage(channel, message);
      });

      this.subClient.on("error", (err: Error) => this.emitError(err));
      this.pubClient.on("error", (err: Error) => this.emitError(err));

      this.subClient.on("connect", () => {
        this.isConnected = true;
        this.subscribeToRegisteredPatterns();
        this.emit("ready");
        callback?.();
      });
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  }

  /**
   * Subscribes the sub-client to all currently registered handler patterns.
   * Must only be called after the client is connected.
   */
  private subscribeToRegisteredPatterns(): void {
    for (const pattern of this.messageHandlers.keys()) {
      this.subscribeChannel(pattern);
    }
    for (const pattern of this.eventHandlers.keys()) {
      this.subscribeChannel(pattern);
    }
  }

  /** Subscribes to `channel` if not already subscribed. */
  private subscribeChannel(channel: string): void {
    if (!this.subscribedChannels.has(channel)) {
      this.subClient!.subscribe(channel);
      this.subscribedChannels.add(channel);
    }
  }

  public override addMessageHandler(
    pattern: string,
    callback: MessageHandler,
  ): void {
    super.addMessageHandler(pattern, callback);
    if (this.isConnected) {
      this.subscribeChannel(pattern);
    }
  }

  public override addEventHandler(
    pattern: string,
    callback: MessageHandler,
  ): void {
    super.addEventHandler(pattern, callback);
    if (this.isConnected) {
      this.subscribeChannel(pattern);
    }
  }

  private async handleRedisMessage(
    channel: string,
    rawMessage: string,
  ): Promise<void> {
    // Reply channels are routed to the correlation-id map, never to handlers.
    if (this.replyChannelRefCounts.has(channel)) {
      this.routeReply(rawMessage);
      return;
    }

    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(rawMessage) as Record<string, unknown>;
    } catch {
      this.emitError(new Error(`Invalid JSON on channel "${channel}"`));
      return;
    }

    const ctx: Record<string, unknown> = {
      pattern: channel,
      channel,
      transport: "redis",
    };

    try {
      if (this.messageHandlers.has(channel)) {
        const response = await this.handleMessage(
          channel,
          parsed.data ?? parsed,
          ctx,
        );

        // Only reply when the request carries a correlation id.
        if (typeof parsed.id === "string" && this.pubClient) {
          await this.pubClient.publish(
            `${channel}.reply`,
            JSON.stringify({ id: parsed.id, data: response }),
          );
        }
      } else if (this.eventHandlers.has(channel)) {
        await this.handleEvent(channel, parsed.data ?? parsed, ctx);
      }
    } catch (err) {
      this.emitError(err);

      // When the request carries a correlation id, round-trip the error to the
      // caller so it fails fast instead of hanging until its request timeout.
      if (typeof parsed.id === "string" && this.pubClient) {
        const message = err instanceof Error ? err.message : String(err);
        await this.pubClient.publish(
          `${channel}.reply`,
          JSON.stringify({ id: parsed.id, error: message }),
        );
      }
    }
  }

  /** Routes a reply-channel message to its pending server-initiated request. */
  private routeReply(rawMessage: string): void {
    let reply: Record<string, unknown>;
    try {
      reply = JSON.parse(rawMessage) as Record<string, unknown>;
    } catch {
      return; // Discard malformed reply messages.
    }

    if (typeof reply.id === "string") {
      const settle = this.pendingRequests.get(reply.id);
      if (settle) {
        this.pendingRequests.delete(reply.id);
        settle(reply);
      }
    }
  }

  /** Subscribes to `channel`, incrementing its reference count. */
  private acquireReplyChannel(channel: string): void {
    const count = this.replyChannelRefCounts.get(channel) ?? 0;
    this.replyChannelRefCounts.set(channel, count + 1);
    if (count === 0) {
      this.subClient!.subscribe(channel);
      this.subscribedChannels.add(channel);
    }
  }

  /** Releases one reference; unsubscribes only when the last waiter is done. */
  private releaseReplyChannel(channel: string): void {
    const count = this.replyChannelRefCounts.get(channel) ?? 0;
    if (count <= 1) {
      this.replyChannelRefCounts.delete(channel);
      this.subClient?.unsubscribe(channel);
      this.subscribedChannels.delete(channel);
    } else {
      this.replyChannelRefCounts.set(channel, count - 1);
    }
  }

  /**
   * Sends a request to `pattern` and waits for a reply.
   * The default timeout is **5 seconds**.
   */
  public sendMessage<T = unknown>(pattern: string, data: T): Promise<unknown> {
    if (!this.pubClient || !this.subClient) {
      return Promise.reject(new Error("Redis client not initialized"));
    }

    const requestId = randomUUID();
    const replyChannel = `${pattern}.reply`;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.releaseReplyChannel(replyChannel);
        reject(new Error(`Request timeout for pattern: "${pattern}"`));
      }, 5_000);

      // Single correlation-id entry; the persistent subscriber listener routes
      // replies here. Reference-counted subscription keeps the reply channel
      // alive while other concurrent requests still need it.
      this.pendingRequests.set(requestId, (reply) => {
        clearTimeout(timer);
        this.releaseReplyChannel(replyChannel);
        if (typeof reply.error === "string") {
          reject(new Error(reply.error));
        } else {
          resolve(reply.data);
        }
      });

      this.acquireReplyChannel(replyChannel);

      void this.pubClient!.publish(
        pattern,
        JSON.stringify({ id: requestId, data }),
      );
    });
  }

  /** Publishes a fire-and-forget event to `pattern`. */
  public emitEvent<T = unknown>(pattern: string, data: T): void {
    if (!this.pubClient) {
      throw new Error("Redis client not initialized");
    }
    void this.pubClient.publish(pattern, JSON.stringify({ data }));
  }

  /** Disconnects both Redis clients and clears subscriptions. */
  public close(): void {
    this.subClient?.disconnect();
    this.pubClient?.disconnect();
    this.isConnected = false;
    this.subscribedChannels.clear();
    this.replyChannelRefCounts.clear();
    this.pendingRequests.clear();
    this.cleanup();
  }
}
