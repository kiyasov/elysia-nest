import { randomUUID } from "node:crypto";

import type { MessageHandler, RabbitMQOptions } from "../interfaces";
import { packageLogger } from "../logger";
import { BaseServer } from "./server";

// ─── Minimal amqplib types ────────────────────────────────────────────────────
// Defined locally so that @types/amqplib is not required as a dependency.

interface AmqpConsumeMessage {
  content: Buffer;
  fields: { routingKey: string; deliveryTag: number; redelivered: boolean };
  properties: {
    correlationId?: string;
    replyTo?: string;
    headers?: Record<string, unknown>;
    contentType?: string;
    contentEncoding?: string;
    deliveryMode?: number;
    priority?: number;
    expiration?: string;
    messageId?: string;
    timestamp?: number;
    type?: string;
    userId?: string;
    appId?: string;
  };
}

interface AmqpChannel {
  prefetch(count: number): Promise<void>;
  assertQueue(
    queue: string,
    options?: Record<string, unknown>,
  ): Promise<{ queue: string }>;
  assertExchange(
    exchange: string,
    type: string,
    options?: Record<string, unknown>,
  ): Promise<unknown>;
  bindQueue(
    queue: string,
    exchange: string,
    routingKey: string,
  ): Promise<void>;
  consume(
    queue: string,
    onMessage: (msg: AmqpConsumeMessage | null) => void,
    options?: Record<string, unknown>,
  ): Promise<{ consumerTag: string }>;
  cancel(consumerTag: string): Promise<void>;
  ack(msg: AmqpConsumeMessage): void;
  nack(msg: AmqpConsumeMessage, allUpTo?: boolean, requeue?: boolean): void;
  sendToQueue(
    queue: string,
    content: Buffer,
    options?: Record<string, unknown>,
  ): boolean;
  publish(
    exchange: string,
    routingKey: string,
    content: Buffer,
    options?: Record<string, unknown>,
  ): boolean;
  on(event: string, listener: (...args: unknown[]) => void): void;
  close(): Promise<void>;
}

interface AmqpConnection {
  createChannel(): Promise<AmqpChannel>;
  on(event: string, listener: (...args: unknown[]) => void): void;
  close(): Promise<void>;
}

interface AmqpLib {
  connect(url: string): Promise<AmqpConnection>;
}

// ─── Dynamic load ─────────────────────────────────────────────────────────────

let amqp: AmqpLib | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  amqp = require("amqplib") as AmqpLib;
} catch {
  // amqplib not installed – error is thrown lazily in the constructor.
}

// ─── Server ───────────────────────────────────────────────────────────────────

/**
 * Transport server that uses RabbitMQ (AMQP via amqplib).
 *
 * - Request-response: The client sends a message with `replyTo` and
 *   `correlationId` properties; the server publishes the response to the
 *   reply queue.
 * - Fire-and-forget: Message without `replyTo`; no response is sent.
 *
 * Requires the optional peer dependency `amqplib`.
 */
export class RabbitMQServer extends BaseServer {
  private connection?: AmqpConnection;
  private channel?: AmqpChannel;

  /** Exclusive reply queue for RPC responses consumed by this server. */
  private replyQueue?: string;

  /** Correlation id → resolve callback for pending server-initiated RPCs. */
  private readonly pendingReplies = new Map<string, (data: unknown) => void>();

  private isListening = false;
  private readonly consumerTags: string[] = [];

  constructor(private readonly options: RabbitMQOptions) {
    super();
    if (!amqp) {
      throw new Error(
        "amqplib is required to use the RabbitMQ transport. " +
          "Install it with: bun add amqplib",
      );
    }
  }

  /**
   * Connects to one of the configured AMQP URLs, declares the queue /
   * exchange, and immediately begins consuming messages.
   */
  public async listen(callback?: (err?: unknown) => void): Promise<void> {
    try {
      await this.connect();
      await this.startConsuming();

      this.isListening = true;
      this.emit("ready");
      callback?.();
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  }

  /** Establishes the AMQP connection and channel. */
  private async connect(): Promise<void> {
    const urls =
      this.options.urls.length > 0 ? this.options.urls : ["amqp://localhost"];

    for (const url of urls) {
      try {
        this.connection = await amqp!.connect(url);
        break;
      } catch {
        // Try the next URL.
      }
    }

    if (!this.connection) {
      throw new Error(
        "Failed to connect to any RabbitMQ server. " +
          `Tried: ${this.options.urls.join(", ")}`,
      );
    }

    this.channel = await this.connection.createChannel();

    // amqplib Connection/Channel are EventEmitters that emit "error"/"close".
    // Without listeners an "error" throws and crashes the process on a broker
    // blip. We LOG and mark the transport not-ready so the failure is visible.
    // NOTE: automatic reconnection is intentionally out of scope here.
    this.attachConnectionListeners();

    if (this.options.prefetchCount) {
      await this.channel.prefetch(this.options.prefetchCount);
    }

    // Declare the main queue.
    await this.channel.assertQueue(this.options.queue, {
      durable: true,
      ...(this.options.queueOptions as Record<string, unknown>),
    });

    // Declare exchange and bind queue when configured.
    if (this.options.exchange) {
      await this.channel.assertExchange(
        this.options.exchange,
        this.options.exchangeType ?? "topic",
        { durable: true },
      );
      await this.channel.bindQueue(
        this.options.queue,
        this.options.exchange,
        this.options.routingKey ?? "#",
      );
    }

    // Exclusive reply queue for server-initiated RPCs.
    const replyQueueInfo = await this.channel.assertQueue("", {
      exclusive: true,
    });
    this.replyQueue = replyQueueInfo.queue;

    const { consumerTag } = await this.channel.consume(
      this.replyQueue,
      (msg: AmqpConsumeMessage | null) => {
        if (msg) this.handleReplyMessage(msg);
      },
      { noAck: true },
    );
    this.consumerTags.push(consumerTag);
  }

  /**
   * Attaches `error`/`close` listeners on the connection and channel so a
   * broker-side failure is logged and marks the transport not-ready instead of
   * crashing the process. Automatic reconnection is intentionally out of scope.
   */
  private attachConnectionListeners(): void {
    this.connection?.on("error", (err: unknown) => {
      this.isListening = false;
      packageLogger.error("RabbitMQ connection error:", err);
    });
    this.connection?.on("close", () => {
      this.isListening = false;
      packageLogger.warn("RabbitMQ connection closed");
    });
    this.channel?.on("error", (err: unknown) => {
      this.isListening = false;
      packageLogger.error("RabbitMQ channel error:", err);
    });
    this.channel?.on("close", () => {
      this.isListening = false;
      packageLogger.warn("RabbitMQ channel closed");
    });
  }

  /** Begins consuming from the main queue and dispatching messages. */
  private async startConsuming(): Promise<void> {
    if (!this.channel) {
      throw new Error("AMQP channel is not initialized");
    }

    const { consumerTag } = await this.channel.consume(
      this.options.queue,
      async (msg: AmqpConsumeMessage | null) => {
        if (!msg) return;

        let content: Record<string, unknown>;
        try {
          content = JSON.parse(msg.content.toString()) as Record<
            string,
            unknown
          >;
        } catch {
          if (!this.options.noAck) {
            this.channel!.nack(msg, false, false);
          }
          return;
        }

        const pattern =
          (msg.properties.headers?.pattern as string | undefined) ??
          msg.fields.routingKey;

        const ctx: Record<string, unknown> = {
          pattern,
          queue: this.options.queue,
          transport: "rabbitmq",
          properties: msg.properties,
          fields: msg.fields,
        };

        try {
          if (this.messageHandlers.has(pattern)) {
            const response = await this.handleMessage(pattern, content, ctx);

            if (msg.properties.replyTo) {
              this.channel!.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(response ?? null)),
                {
                  correlationId: msg.properties.correlationId,
                  headers: { pattern },
                },
              );
            }

            if (!this.options.noAck) {
              this.channel!.ack(msg);
            }
          } else if (this.eventHandlers.has(pattern)) {
            // Await the (possibly async) event handler BEFORE acking so a
            // handler that throws or a crash mid-handler does not silently lose
            // the message despite manual-ack config.
            await this.handleEvent(pattern, content, ctx);

            if (!this.options.noAck) {
              this.channel!.ack(msg);
            }
          } else {
            // No handler found. Requeue once (on first delivery) then drop it,
            // so an unmatched pattern cannot spin server↔broker forever.
            if (!this.options.noAck) {
              this.channel!.nack(msg, false, !msg.fields.redelivered);
            }
          }
        } catch (err) {
          this.emitError(err);

          // Round-trip the error to a waiting caller so it fails fast instead
          // of hanging until its request timeout.
          if (msg.properties.replyTo) {
            const message = err instanceof Error ? err.message : String(err);
            this.channel!.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify({ error: message })),
              {
                correlationId: msg.properties.correlationId,
                headers: { pattern, error: true },
              },
            );
          }

          if (!this.options.noAck) {
            this.channel!.nack(msg, false, false);
          }
        }
      },
      { noAck: this.options.noAck ?? false },
    );

    this.consumerTags.push(consumerTag);
  }

  private handleReplyMessage(msg: AmqpConsumeMessage): void {
    try {
      const content = JSON.parse(msg.content.toString()) as unknown;
      const { correlationId } = msg.properties;

      if (correlationId) {
        const resolve = this.pendingReplies.get(correlationId);
        if (resolve) {
          resolve(content);
          this.pendingReplies.delete(correlationId);
        }
      }
    } catch (err) {
      this.emitError(err);
    }
  }

  public override addMessageHandler(
    pattern: string,
    callback: MessageHandler,
  ): void {
    super.addMessageHandler(pattern, callback);
    if (this.channel && this.isListening) {
      void this.bindPatternToExchange(pattern);
    }
  }

  public override addEventHandler(
    pattern: string,
    callback: MessageHandler,
  ): void {
    super.addEventHandler(pattern, callback);
    if (this.channel && this.isListening) {
      void this.bindPatternToExchange(pattern);
    }
  }

  private async bindPatternToExchange(pattern: string): Promise<void> {
    if (!this.channel || !this.options.exchange) return;

    await this.channel.bindQueue(
      this.options.queue,
      this.options.exchange,
      pattern,
    );
  }

  /**
   * Publishes a request to `pattern` and waits for a reply.
   * The default timeout is **5 seconds**.
   */
  public sendMessage<T = unknown>(pattern: string, data: T): Promise<unknown> {
    if (!this.channel || !this.replyQueue) {
      return Promise.reject(
        new Error("RabbitMQ channel is not initialized"),
      );
    }

    const correlationId = randomUUID();
    const buffer = Buffer.from(JSON.stringify({ pattern, data }));
    const exchange = this.options.exchange ?? "";
    const routingKey = this.options.exchange
      ? (this.options.routingKey ?? pattern)
      : pattern;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingReplies.delete(correlationId);
        reject(new Error(`Request timeout for pattern: "${pattern}"`));
      }, 5_000);

      this.pendingReplies.set(correlationId, (response: unknown) => {
        clearTimeout(timer);
        resolve(response);
      });

      const published = this.channel!.publish(exchange, routingKey, buffer, {
        replyTo: this.replyQueue,
        correlationId,
        headers: { pattern },
        persistent: this.options.persistent !== false,
      });

      if (!published) {
        clearTimeout(timer);
        this.pendingReplies.delete(correlationId);
        reject(new Error("Failed to publish message to RabbitMQ"));
      }
    });
  }

  /** Publishes a fire-and-forget event to `pattern`. */
  public emitEvent<T = unknown>(pattern: string, data: T): void {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    const buffer = Buffer.from(JSON.stringify({ pattern, data }));
    const exchange = this.options.exchange ?? "";
    const routingKey = this.options.exchange
      ? (this.options.routingKey ?? pattern)
      : pattern;

    this.channel.publish(exchange, routingKey, buffer, {
      headers: { pattern },
      persistent: this.options.persistent !== false,
    });
  }

  /** Cancels consumers, closes the channel and connection. */
  public close(): void {
    for (const tag of this.consumerTags) {
      this.channel?.cancel(tag);
    }
    this.consumerTags.length = 0;
    this.pendingReplies.clear();

    // Fire-and-forget async teardown to keep `close(): void` signature.
    void this.channel?.close().catch(() => void 0);
    void this.connection?.close().catch(() => void 0);
    this.isListening = false;
    this.cleanup();
  }
}
