import { randomUUID } from "node:crypto";

import { Observable, type Observer } from "rxjs";

import type { RabbitMQOptions } from "../interfaces";
import { packageLogger } from "../logger";
import { ClientProxy } from "./client-proxy";

// ─── Minimal amqplib types ────────────────────────────────────────────────────
// Defined locally so that @types/amqplib is not required as a dependency.

interface AmqpConsumeMessage {
  content: Buffer;
  fields: { routingKey: string };
  properties: {
    correlationId?: string;
    replyTo?: string;
    headers?: Record<string, unknown>;
  };
}

interface AmqpChannel {
  assertQueue(
    queue: string,
    options?: Record<string, unknown>,
  ): Promise<{ queue: string }>;
  consume(
    queue: string,
    onMessage: (msg: AmqpConsumeMessage | null) => void,
    options?: Record<string, unknown>,
  ): Promise<{ consumerTag: string }>;
  cancel(consumerTag: string): Promise<void>;
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

// ─── Client ───────────────────────────────────────────────────────────────────

/**
 * Client proxy that communicates over RabbitMQ (AMQP via amqplib).
 *
 * - {@link send}: publishes a message with `replyTo` and `correlationId` set,
 *   then waits for a reply on an exclusive per-client queue.
 * - {@link emit}: publishes without `replyTo`.
 *
 * Requires the optional peer dependency `amqplib`.
 */
export class RabbitMQClient extends ClientProxy {
  private connection?: AmqpConnection;
  private channel?: AmqpChannel;

  /** Exclusive reply queue name for this client instance. */
  private replyQueue?: string;

  /** Correlation id → settle callback for pending requests. */
  private readonly pendingRequests = new Map<
    string,
    (content: unknown, isError: boolean) => void
  >();

  private isConnected = false;
  private consumerTag?: string;

  constructor(private readonly options: RabbitMQOptions) {
    super();
    if (!amqp) {
      throw new Error(
        "amqplib is required to use the RabbitMQ transport. " +
          "Install it with: bun add amqplib",
      );
    }
  }

  /** Connects to RabbitMQ and sets up the exclusive reply queue. */
  async connect(): Promise<void> {
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

    const replyQueueInfo = await this.channel.assertQueue("", {
      exclusive: true,
    });
    this.replyQueue = replyQueueInfo.queue;

    const consumer = await this.channel.consume(
      this.replyQueue,
      (msg: AmqpConsumeMessage | null) => {
        if (msg) this.handleReplyMessage(msg);
      },
      { noAck: true },
    );
    this.consumerTag = consumer.consumerTag;

    // amqplib Connection/Channel are EventEmitters that emit "error"/"close".
    // Without listeners an "error" throws and crashes the process on a broker
    // blip. We LOG and mark the client not-connected so the failure is visible.
    // NOTE: automatic reconnection is intentionally out of scope here.
    this.connection.on("error", (err: unknown) => {
      this.isConnected = false;
      packageLogger.error("RabbitMQ connection error:", err);
    });
    this.connection.on("close", () => {
      this.isConnected = false;
      packageLogger.warn("RabbitMQ connection closed");
    });
    this.channel.on("error", (err: unknown) => {
      this.isConnected = false;
      packageLogger.error("RabbitMQ channel error:", err);
    });
    this.channel.on("close", () => {
      this.isConnected = false;
      packageLogger.warn("RabbitMQ channel closed");
    });

    this.isConnected = true;
  }

  private handleReplyMessage(msg: AmqpConsumeMessage): void {
    try {
      const content = JSON.parse(msg.content.toString()) as unknown;
      const { correlationId } = msg.properties;
      // An `error: true` header marks a failed remote handler. Using the header
      // (not the payload) keeps a legitimate response with an `error` field from
      // being misinterpreted as a failure.
      const isError = msg.properties.headers?.error === true;
      if (correlationId) {
        const settle = this.pendingRequests.get(correlationId);
        if (settle) {
          this.pendingRequests.delete(correlationId);
          settle(content, isError);
        }
      }
    } catch {
      // Discard malformed reply messages.
    }
  }

  /**
   * Sends a request to `pattern` and returns an Observable that emits the
   * server's response then completes. Times out after **5 seconds**.
   */
  send<T = unknown, R = unknown>(pattern: string, data: T): Observable<R> {
    return new Observable((observer: Observer<R>) => {
      if (!this.isConnected || !this.channel || !this.replyQueue) {
        observer.error(new Error("RabbitMQ client is not connected"));
        return;
      }

      const correlationId = randomUUID();
      const buffer = Buffer.from(JSON.stringify({ pattern, data }));
      const exchange = this.options.exchange ?? "";
      const routingKey = this.options.exchange
        ? (this.options.routingKey ?? pattern)
        : pattern;

      const timer = setTimeout(() => {
        this.pendingRequests.delete(correlationId);
        observer.error(new Error(`Request timeout for pattern: "${pattern}"`));
      }, 5_000);

      this.pendingRequests.set(correlationId, (content, isError) => {
        clearTimeout(timer);
        if (isError) {
          const message =
            (content as { error?: string } | null)?.error ??
            "Remote handler error";
          observer.error(new Error(message));
        } else {
          observer.next(content as R);
          observer.complete();
        }
      });

      const published = this.channel!.publish(exchange, routingKey, buffer, {
        replyTo: this.replyQueue,
        correlationId,
        headers: { pattern },
        persistent: this.options.persistent !== false,
      });

      if (!published) {
        clearTimeout(timer);
        this.pendingRequests.delete(correlationId);
        observer.error(new Error("Failed to publish message to RabbitMQ"));
      }
    });
  }

  /** Publishes a fire-and-forget event to `pattern`. */
  emit<T = unknown>(pattern: string, data: T): void {
    if (!this.isConnected || !this.channel) {
      throw new Error("RabbitMQ client is not connected");
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

  /** Cancels the consumer, closes channel and connection. */
  close(): void {
    if (this.consumerTag) {
      this.channel?.cancel(this.consumerTag);
    }
    this.pendingRequests.clear();

    void this.channel?.close().catch(() => void 0);
    void this.connection?.close().catch(() => void 0);
    this.isConnected = false;
  }
}
