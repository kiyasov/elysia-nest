import type { Redis } from "ioredis";

import {
  type AsyncIteratorOptions,
  type MessageHandler,
  type PubSubEngine,
  type RedisPubSubOptions,
  type SubscriptionMap,
  type SubscriptionOptions,
  type SubsRefsMap,
} from "./interfaces";
import { packageLogger } from "./logger";
import { PubSubAsyncIterator } from "./pubsub-async-iterator";

/**
 * Redis-backed implementation of the {@link PubSubEngine} contract.
 *
 * Uses two separate ioredis connections — one for publishing (`PUBLISH`) and
 * one dedicated to blocking subscribe commands (`SUBSCRIBE` / `PSUBSCRIBE`).
 * This separation is required because a Redis client in subscribe mode can
 * only issue subscribe/unsubscribe commands.
 *
 * Construct via {@link GraphQLPubSubModule.forRoot} or
 * {@link GraphQLPubSubModule.forRootAsync} in module-based apps.
 *
 * @example
 * ```typescript
 * const pubsub = new RedisPubSub({ connection: { host: "localhost", port: 6379 } });
 *
 * // Publish
 * await pubsub.publish("ORDER_CREATED", { id: 1 });
 *
 * // Subscribe
 * const subId = await pubsub.subscribe("ORDER_CREATED", (payload) => {
 *   console.log(payload);
 * });
 *
 * // Later…
 * pubsub.unsubscribe(subId);
 * await pubsub.close();
 * ```
 */
export class RedisPubSub implements PubSubEngine {
  /** Dedicated Redis client for `PUBLISH` commands. */
  private readonly redisPublisher: Redis;
  /** Dedicated Redis client for `SUBSCRIBE` / `PSUBSCRIBE` commands. */
  private readonly redisSubscriber: Redis;
  /** Optional key prefix prepended to every channel name. */
  private readonly keyPrefix: string;
  /** Maps a trigger name to the Redis channel key. */
  private readonly triggerTransform: (
    trigger: string,
    options: SubscriptionOptions,
  ) => string;
  /** Optional `JSON.parse` reviver (used when no custom `deserializer` is set). */
  private readonly reviver?: (key: string, value: unknown) => unknown;
  /** Custom serializer for outgoing payloads. Defaults to `JSON.stringify`. */
  private readonly serializer?: (payload: unknown) => string;
  /** Custom deserializer for incoming payloads. Defaults to `JSON.parse`. */
  private readonly deserializer?: (payload: string) => unknown;

  /** `subId → SubscriptionEvent` map. */
  private readonly subscriptionMap: SubscriptionMap = new Map();
  /** `channel → [subId, …]` map for fan-out dispatch. */
  private readonly subsRefsMap: SubsRefsMap = new Map();
  /** In-flight Redis (P)SUBSCRIBE promises keyed by trigger name. */
  private readonly pendingSubscribes = new Map<string, Promise<void>>();
  /** Monotonically increasing counter used to generate subscription IDs. */
  private currentSubscriptionId = 0;

  constructor(options: RedisPubSubOptions = {}) {
    const {
      triggerTransform,
      connection,
      connectionListener,
      subscriber,
      publisher,
      reviver,
      serializer,
      deserializer,
      keyPrefix = "",
    } = options;

    this.triggerTransform = triggerTransform ?? ((trigger) => trigger);
    this.keyPrefix = keyPrefix;
    this.reviver = reviver;
    this.serializer = serializer;
    this.deserializer = deserializer;

    if (subscriber && publisher) {
      this.redisSubscriber = subscriber;
      this.redisPublisher = publisher;
    } else {
      let IORedis: new (opts?: unknown) => Redis;
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ({ default: IORedis } = require("ioredis") as {
          default: new (opts?: unknown) => Redis;
        });
      } catch {
        throw new Error(
          "No publisher/subscriber instances were provided and 'ioredis' is not installed. " +
            "Install it with: bun add ioredis",
        );
      }

      this.redisPublisher = new IORedis(connection);
      this.redisSubscriber = new IORedis(connection);

      if (connectionListener) {
        this.redisPublisher
          .on("connect", () => connectionListener(undefined))
          .on("error", connectionListener);
        this.redisSubscriber
          .on("connect", () => connectionListener(undefined))
          .on("error", connectionListener);
      } else {
        this.redisPublisher.on("error", (error) =>
          packageLogger.error("[RedisPubSub] Publisher error:", error),
        );
        this.redisSubscriber.on("error", (error) =>
          packageLogger.error("[RedisPubSub] Subscriber error:", error),
        );
      }
    }

    // Bind message handlers using explicit arrow functions for clarity.
    this.redisSubscriber.on("pmessage", (pattern, channel, message) =>
      this.onMessage(pattern, channel, message),
    );
    this.redisSubscriber.on("message", (channel, message) =>
      this.onMessage(undefined, channel, message),
    );
  }

  /**
   * Publishes `payload` to the Redis channel derived from `trigger`.
   *
   * The payload is serialised with the custom {@link RedisPubSubOptions.serializer}
   * when provided, otherwise `JSON.stringify`.
   */
  public async publish(trigger: string, payload: unknown): Promise<void> {
    const prefixed = `${this.keyPrefix}${trigger}`;
    const channelName = this.triggerTransform(prefixed, {});
    const message = this.serializer
      ? this.serializer(payload)
      : JSON.stringify(payload);
    await this.redisPublisher.publish(channelName, message);
  }

  /**
   * Subscribes to `trigger` and invokes `onMessage` for every incoming message.
   *
   * If another subscriber already holds a subscription for the same resolved
   * channel, the existing Redis subscription is reused — no additional
   * `SUBSCRIBE` command is issued.
   *
   * @returns A numeric subscription ID used with {@link unsubscribe}.
   */
  public async subscribe<T = unknown>(
    trigger: string,
    onMessage: MessageHandler<T>,
    options: SubscriptionOptions = {},
  ): Promise<number> {
    const prefixed = `${this.keyPrefix}${trigger}`;
    const triggerName = this.triggerTransform(prefixed, options);
    const isPattern = options.pattern ?? false;
    const id = this.currentSubscriptionId++;

    this.subscriptionMap.set(id, {
      id,
      trigger: triggerName,
      handler: onMessage as MessageHandler,
      isPattern,
    });

    const refs = this.subsRefsMap.get(triggerName);

    if (refs && refs.length > 0) {
      // Channel already has listeners — piggyback on the existing entry.
      this.subsRefsMap.set(triggerName, [...refs, id]);
      // If the initial Redis SUBSCRIBE is still in-flight, wait for it so
      // the caller doesn't start publishing before the channel is active.
      const pending = this.pendingSubscribes.get(triggerName);
      if (pending) {
        try {
          await pending;
        } catch (error) {
          // The shared (P)SUBSCRIBE rejected. Roll back this waiter's state
          // so it leaves no dangling refs and a later subscribe issues a
          // fresh real Redis SUBSCRIBE.
          this.rollbackSubscription(id, triggerName);
          throw error;
        }
      }
      return id;
    }

    // First subscriber — issue the Redis (P)SUBSCRIBE command.
    this.subsRefsMap.set(triggerName, [id]);
    const subscribePromise = this.performSubscribe(triggerName, isPattern);
    this.pendingSubscribes.set(triggerName, subscribePromise);

    try {
      await subscribePromise;
    } catch (error) {
      // The (P)SUBSCRIBE (or readiness wait) rejected. Roll back all state
      // for this subscription so the end state is identical to never having
      // called subscribe for this trigger — otherwise the leaked refs entry
      // makes every subsequent subscribe silently piggyback on a channel
      // that was never actually subscribed on Redis.
      this.rollbackSubscription(id, triggerName);
      throw error;
    } finally {
      this.pendingSubscribes.delete(triggerName);
    }

    return id;
  }

  /**
   * Removes all bookkeeping for a single subscription id after a failed
   * (P)SUBSCRIBE.
   *
   * Deletes the `subscriptionMap` entry and drops the id from the trigger's
   * `subsRefsMap` list, removing the trigger key entirely once its last
   * reference is gone so a later subscribe re-issues a real Redis SUBSCRIBE.
   */
  private rollbackSubscription(id: number, triggerName: string): void {
    this.subscriptionMap.delete(id);

    const refs = this.subsRefsMap.get(triggerName);
    if (!refs) return;

    const index = refs.indexOf(id);
    if (index !== -1) refs.splice(index, 1);

    if (refs.length === 0) {
      this.subsRefsMap.delete(triggerName);
    }
  }

  /**
   * Issues a `SUBSCRIBE` or `PSUBSCRIBE` command to Redis.
   *
   * Waits for the connection to be ready before issuing the command so callers
   * don't need to worry about connection state.
   */
  private async performSubscribe(
    triggerName: string,
    pattern: boolean,
  ): Promise<void> {
    if (this.redisSubscriber.status !== "ready") {
      await this.waitForReady();
    }

    if (pattern) {
      await this.redisSubscriber.psubscribe(triggerName);
    } else {
      await this.redisSubscriber.subscribe(triggerName);
    }
  }

  /** Resolves once the subscriber connection reaches the `ready` state. */
  private waitForReady(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const onReady = () => {
        clearTimeout(timer);
        this.redisSubscriber.removeListener("error", onError);
        resolve();
      };

      const onError = (err: Error) => {
        clearTimeout(timer);
        this.redisSubscriber.removeListener("ready", onReady);
        reject(err);
      };

      const timer = setTimeout(() => {
        this.redisSubscriber.removeListener("ready", onReady);
        this.redisSubscriber.removeListener("error", onError);
        reject(new Error("Timeout waiting for Redis subscriber to be ready"));
      }, 10_000);

      this.redisSubscriber.once("ready", onReady);
      this.redisSubscriber.once("error", onError);
    });
  }

  /**
   * Cancels the subscription identified by `subId`.
   *
   * When the cancelled subscription was the last one for its Redis channel,
   * the corresponding `UNSUBSCRIBE` / `PUNSUBSCRIBE` command is issued.
   *
   * @throws {Error} If `subId` is not a known subscription.
   */
  public unsubscribe(subId: number): void {
    const subscription = this.subscriptionMap.get(subId);

    if (!subscription) {
      throw new Error(`No subscription found with id "${subId}"`);
    }

    const { trigger: triggerName, isPattern } = subscription;
    const refs = this.subsRefsMap.get(triggerName);

    if (!refs) {
      throw new Error(`No subscriptions found for trigger "${triggerName}"`);
    }

    if (refs.length === 1) {
      // Last subscriber — release the Redis channel.
      const unsubscribeCmd = isPattern
        ? this.redisSubscriber.punsubscribe(triggerName)
        : this.redisSubscriber.unsubscribe(triggerName);

      unsubscribeCmd.catch((err: unknown) => {
        packageLogger.error(
          `[RedisPubSub] Failed to unsubscribe from "${triggerName}":`,
          err,
        );
      });

      this.subsRefsMap.delete(triggerName);
    } else {
      const index = refs.indexOf(subId);
      if (index !== -1) refs.splice(index, 1);
    }

    this.subscriptionMap.delete(subId);
  }

  /**
   * Creates an `AsyncIterator` over the given `triggers` for use in
   * GraphQL subscription resolvers.
   *
   * @example
   * ```typescript
   * // In a GraphQL resolver:
   * subscribe() {
   *   return pubsub.asyncIterator<OrderCreatedEvent>("ORDER_CREATED");
   * }
   * ```
   */
  public asyncIterator<T>(
    triggers: string | string[],
    options?: AsyncIteratorOptions,
  ): AsyncIterator<T> {
    const triggersArray = Array.isArray(triggers) ? triggers : [triggers];
    return new PubSubAsyncIterator<T>(this, triggersArray, options);
  }

  /**
   * Returns the underlying subscriber Redis client.
   *
   * @warning Do **not** issue regular Redis commands on this client — it is
   *   in subscribe mode and only accepts `(P)SUBSCRIBE` / `(P)UNSUBSCRIBE`.
   */
  public getSubscriber(): Redis {
    return this.redisSubscriber;
  }

  /** Returns the underlying publisher Redis client. */
  public getPublisher(): Redis {
    return this.redisPublisher;
  }

  /**
   * Number of active per-iterator subscriptions currently held in memory.
   *
   * Useful for exporting as a metric — steady growth here when client
   * churn is normal is a sign that subscription iterators aren't being
   * returned on disconnect (typically a dirty-WebSocket-close issue).
   */
  public get subscriptionCount(): number {
    return this.subscriptionMap.size;
  }

  /**
   * Number of distinct Redis channels (after `triggerTransform`) that
   * this instance is currently subscribed to.
   */
  public get channelCount(): number {
    return this.subsRefsMap.size;
  }

  /**
   * Snapshot of the subscription state for observability.
   *
   * The returned structure is a copy — mutating it does not affect the
   * internal maps. Intended for `/health` endpoints, metric collectors,
   * and regression tests for leak detection. Preferable to reaching into
   * `subscriptionMap` via `as unknown as { subscriptionMap }`.
   */
  public debug(): {
    subscriptionCount: number;
    channelCount: number;
    channels: Array<{ trigger: string; subscribers: number }>;
  } {
    const channels: Array<{ trigger: string; subscribers: number }> = [];
    for (const [trigger, refs] of this.subsRefsMap.entries()) {
      channels.push({ trigger, subscribers: refs.length });
    }
    return {
      subscriptionCount: this.subscriptionMap.size,
      channelCount: this.subsRefsMap.size,
      channels,
    };
  }

  /**
   * Gracefully closes both Redis connections.
   *
   * Call this during application shutdown to allow open sockets to drain.
   */
  public async close(): Promise<void> {
    await Promise.all([
      this.redisPublisher.quit(),
      this.redisSubscriber.quit(),
    ]);
  }

  /**
   * Handles an incoming message from the Redis subscriber.
   *
   * - `pmessage` events provide `(pattern, channel, message)`.
   * - `message` events provide `(channel, message)`; `pattern` is `undefined`.
   *
   * The lookup key is the pattern (for `PSUBSCRIBE`) or the channel
   * (for `SUBSCRIBE`).
   */
  private onMessage(
    pattern: string | undefined,
    channel: string,
    message: string,
  ): void {
    const lookupKey = pattern ?? channel;
    const subscribers = this.subsRefsMap.get(lookupKey);

    if (!subscribers || subscribers.length === 0) return;

    let parsedMessage: unknown;
    try {
      parsedMessage = this.deserializer
        ? this.deserializer(message)
        : JSON.parse(message, this.reviver);
    } catch {
      // Treat non-JSON payloads as raw strings.
      parsedMessage = message;
    }

    for (const subId of subscribers) {
      const subscription = this.subscriptionMap.get(subId);
      if (subscription) {
        subscription.handler(parsedMessage);
      }
    }
  }
}
