import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import type { Redis } from "ioredis";

import { RedisPubSub } from "../src/redis-pubsub";

type MessageListener = (channel: string, message: string) => void;
type PatternListener = (pattern: string, channel: string, message: string) => void;

/**
 * Minimal in-memory stand-in for ioredis's `Redis` that supports just
 * enough of the API for `RedisPubSub` to function: SUBSCRIBE / UNSUBSCRIBE
 * and the `message` event. It is deliberately NOT a network client —
 * we only care about exercising `subscriptionMap` / `subsRefsMap` paths.
 */
class FakeRedis {
  public status = "ready";
  private readonly listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  public readonly subscribed = new Set<string>();
  public readonly psubscribed = new Set<string>();
  public readonly published: Array<{ channel: string; message: string }> = [];

  on(event: string, cb: (...args: unknown[]) => void): this {
    const arr = this.listeners.get(event) ?? [];
    arr.push(cb);
    this.listeners.set(event, arr);
    return this;
  }

  once(event: string, cb: (...args: unknown[]) => void): this {
    const wrapped = (...args: unknown[]): void => {
      this.removeListener(event, wrapped);
      cb(...args);
    };
    return this.on(event, wrapped);
  }

  removeListener(event: string, cb: (...args: unknown[]) => void): this {
    const arr = this.listeners.get(event);
    if (!arr) return this;
    const i = arr.indexOf(cb);
    if (i !== -1) arr.splice(i, 1);
    return this;
  }

  async subscribe(channel: string): Promise<void> {
    this.subscribed.add(channel);
  }

  async psubscribe(pattern: string): Promise<void> {
    this.psubscribed.add(pattern);
  }

  async unsubscribe(channel: string): Promise<void> {
    this.subscribed.delete(channel);
  }

  async punsubscribe(pattern: string): Promise<void> {
    this.psubscribed.delete(pattern);
  }

  async publish(channel: string, message: string): Promise<number> {
    this.published.push({ channel, message });
    return 1;
  }

  async quit(): Promise<"OK"> {
    return "OK";
  }

  /** Emulate an incoming message from Redis. */
  emitMessage(channel: string, message: string): void {
    const msgListeners = this.listeners.get("message") as MessageListener[] | undefined;
    msgListeners?.forEach((cb) => cb(channel, message));
  }

  emitPMessage(pattern: string, channel: string, message: string): void {
    const pListeners = this.listeners.get("pmessage") as PatternListener[] | undefined;
    pListeners?.forEach((cb) => cb(pattern, channel, message));
  }
}

function makeRedisPubSub(): { pubsub: RedisPubSub; subscriber: FakeRedis; publisher: FakeRedis } {
  const subscriber = new FakeRedis();
  const publisher = new FakeRedis();
  const pubsub = new RedisPubSub({
    subscriber: subscriber as unknown as Redis,
    publisher: publisher as unknown as Redis,
  });
  return { pubsub, subscriber, publisher };
}

describe("RedisPubSub observability", () => {
  it("exposes subscriptionCount that grows with each asyncIterator", async () => {
    const { pubsub } = makeRedisPubSub();
    expect(pubsub.subscriptionCount).toBe(0);

    const iterA = pubsub.asyncIterator("A");
    const iterB = pubsub.asyncIterator("B");
    // Wait for subscribeAll() to settle.
    await new Promise((r) => setTimeout(r, 0));

    expect(pubsub.subscriptionCount).toBe(2);

    await iterA.return!();
    await iterB.return!();
    expect(pubsub.subscriptionCount).toBe(0);
  });

  it("channelCount tracks distinct Redis channels", async () => {
    const { pubsub } = makeRedisPubSub();
    const iter1 = pubsub.asyncIterator("shared");
    const iter2 = pubsub.asyncIterator("shared");
    const iter3 = pubsub.asyncIterator("other");
    await new Promise((r) => setTimeout(r, 0));

    expect(pubsub.subscriptionCount).toBe(3);
    // Two distinct Redis channels even though three iterators subscribed.
    expect(pubsub.channelCount).toBe(2);

    await iter1.return!();
    await iter2.return!();
    await iter3.return!();
    expect(pubsub.channelCount).toBe(0);
  });

  it("debug() snapshot reports per-channel subscriber counts", async () => {
    const { pubsub } = makeRedisPubSub();
    const iter1 = pubsub.asyncIterator("X");
    const iter2 = pubsub.asyncIterator("X");
    const iter3 = pubsub.asyncIterator("Y");
    await new Promise((r) => setTimeout(r, 0));

    const snapshot = pubsub.debug();
    expect(snapshot.subscriptionCount).toBe(3);
    expect(snapshot.channelCount).toBe(2);

    const x = snapshot.channels.find((c) => c.trigger === "X");
    const y = snapshot.channels.find((c) => c.trigger === "Y");
    expect(x?.subscribers).toBe(2);
    expect(y?.subscribers).toBe(1);

    await iter1.return!();
    await iter2.return!();
    await iter3.return!();
  });

  it("subscriptionMap does not leak when iterators return() on disconnect", async () => {
    const { pubsub } = makeRedisPubSub();

    // Simulate N connect/subscribe/disconnect cycles — mirrors the
    // rapid-reconnect scenario that produced the production leak.
    for (let i = 0; i < 50; i++) {
      const iter = pubsub.asyncIterator(`channel-${i % 5}`);
      await new Promise((r) => setTimeout(r, 0));
      await iter.return!();
    }

    expect(pubsub.subscriptionCount).toBe(0);
    expect(pubsub.channelCount).toBe(0);
  });

  it("idleTimeoutMs self-closes the iterator and releases subscriptionMap slot", async () => {
    const { pubsub } = makeRedisPubSub();

    const iter = pubsub.asyncIterator<string>("idle", { idleTimeoutMs: 30 });
    await new Promise((r) => setTimeout(r, 0));
    expect(pubsub.subscriptionCount).toBe(1);

    // No messages arrive — the watchdog fires and frees the slot.
    await new Promise((r) => setTimeout(r, 70));
    expect(pubsub.subscriptionCount).toBe(0);

    // Subsequent next() resolves with done=true (iterator already closed).
    const res = await iter.next();
    expect(res.done).toBe(true);
  });

  it("uses triggerTransform for both subscribe and publish channels", async () => {
    const subscriber = new FakeRedis();
    const publisher = new FakeRedis();
    const pubsub = new RedisPubSub({
      subscriber: subscriber as unknown as Redis,
      publisher: publisher as unknown as Redis,
      triggerTransform: (trigger) => `tenant:${trigger}`,
    });

    const received: unknown[] = [];
    const subId = await pubsub.subscribe("orders", (message) => {
      received.push(message);
    });

    expect(subscriber.subscribed.has("tenant:orders")).toBe(true);

    await pubsub.publish("orders", { id: 1 });
    expect(publisher.published[0]?.channel).toBe("tenant:orders");

    subscriber.emitMessage("tenant:orders", JSON.stringify({ id: 1 }));
    expect(received).toEqual([{ id: 1 }]);

    pubsub.unsubscribe(subId);
  });

  it("uses keyPrefix before triggerTransform for subscribe and publish", async () => {
    const subscriber = new FakeRedis();
    const publisher = new FakeRedis();
    const seenTriggers: string[] = [];
    const pubsub = new RedisPubSub({
      subscriber: subscriber as unknown as Redis,
      publisher: publisher as unknown as Redis,
      keyPrefix: "app:",
      triggerTransform: (trigger) => {
        seenTriggers.push(trigger);
        return `tenant:${trigger}`;
      },
    });

    const subId = await pubsub.subscribe("orders", () => {});
    await pubsub.publish("orders", { id: 2 });

    expect(seenTriggers).toEqual(["app:orders", "app:orders"]);
    expect(subscriber.subscribed.has("tenant:app:orders")).toBe(true);
    expect(publisher.published[0]?.channel).toBe("tenant:app:orders");

    pubsub.unsubscribe(subId);
  });

  it("rolls back map state when the first SUBSCRIBE rejects and heals on retry", async () => {
    // Fake whose first `subscribe` call rejects, then succeeds afterwards.
    class FailFirstRedis extends FakeRedis {
      public subscribeCalls = 0;
      public failNext = true;
      override async subscribe(channel: string): Promise<void> {
        this.subscribeCalls++;
        if (this.failNext) {
          this.failNext = false;
          throw new Error("boom");
        }
        return super.subscribe(channel);
      }
    }

    const subscriber = new FailFirstRedis();
    const publisher = new FakeRedis();
    const pubsub = new RedisPubSub({
      subscriber: subscriber as unknown as Redis,
      publisher: publisher as unknown as Redis,
    });

    // First subscribe fails at the Redis SUBSCRIBE call.
    await expect(pubsub.subscribe("T", () => {})).rejects.toThrow("boom");

    // (1) No leftover map entries for the failed trigger.
    expect(pubsub.subscriptionCount).toBe(0);
    expect(pubsub.channelCount).toBe(0);
    expect(subscriber.subscribed.has("T")).toBe(false);

    // (2) A second subscribe issues a real Redis SUBSCRIBE again and works.
    const received: unknown[] = [];
    const subId = await pubsub.subscribe("T", (m) => received.push(m));

    expect(subscriber.subscribeCalls).toBe(2);
    expect(subscriber.subscribed.has("T")).toBe(true);

    subscriber.emitMessage("T", JSON.stringify({ ok: true }));
    expect(received).toEqual([{ ok: true }]);

    pubsub.unsubscribe(subId);
    expect(pubsub.subscriptionCount).toBe(0);
    expect(pubsub.channelCount).toBe(0);
  });

  it("rolls back piggybacked waiters when the shared SUBSCRIBE rejects", async () => {
    class FailFirstRedis extends FakeRedis {
      public subscribeCalls = 0;
      public failNext = true;
      override async subscribe(channel: string): Promise<void> {
        this.subscribeCalls++;
        if (this.failNext) {
          this.failNext = false;
          throw new Error("boom");
        }
        return super.subscribe(channel);
      }
    }

    const subscriber = new FailFirstRedis();
    const publisher = new FakeRedis();
    const pubsub = new RedisPubSub({
      subscriber: subscriber as unknown as Redis,
      publisher: publisher as unknown as Redis,
    });

    // First subscribe issues the real SUBSCRIBE (which rejects); the second
    // piggybacks on the still-in-flight pending promise. Handlers are attached
    // synchronously via allSettled so neither rejection is ever unhandled.
    const results = await Promise.allSettled([
      pubsub.subscribe("T", () => {}),
      pubsub.subscribe("T", () => {}),
    ]);

    expect(results[0]?.status).toBe("rejected");
    expect(results[1]?.status).toBe("rejected");

    // Only one real SUBSCRIBE was attempted, and all state is rolled back.
    expect(subscriber.subscribeCalls).toBe(1);
    expect(pubsub.subscriptionCount).toBe(0);
    expect(pubsub.channelCount).toBe(0);

    // A fresh subscribe heals and issues a new real SUBSCRIBE.
    const received: unknown[] = [];
    const subId = await pubsub.subscribe("T", (m) => received.push(m));
    expect(subscriber.subscribeCalls).toBe(2);
    expect(subscriber.subscribed.has("T")).toBe(true);

    subscriber.emitMessage("T", JSON.stringify({ ok: true }));
    expect(received).toEqual([{ ok: true }]);

    pubsub.unsubscribe(subId);
  });

  it("rolls back a successful sibling subscription when one trigger's SUBSCRIBE fails", async () => {
    // Fake whose SUBSCRIBE rejects only for channel "B".
    class FailChannelRedis extends FakeRedis {
      override async subscribe(channel: string): Promise<void> {
        if (channel === "B") throw new Error("boom B");
        return super.subscribe(channel);
      }
    }

    const subscriber = new FailChannelRedis();
    const publisher = new FakeRedis();
    const pubsub = new RedisPubSub({
      subscriber: subscriber as unknown as Redis,
      publisher: publisher as unknown as Redis,
    });

    // Multi-trigger iterator: "A" subscribes fine, "B" fails.
    const iter = pubsub.asyncIterator<string>(["A", "B"]);

    // next() awaits subscribeAll(), which propagates B's failure.
    await expect(iter.next()).rejects.toThrow("boom B");

    // "A" subscribed successfully but MUST have been rolled back — otherwise
    // it leaks in the engine forever after the partial failure.
    expect(pubsub.subscriptionCount).toBe(0);
    expect(pubsub.channelCount).toBe(0);
    expect(subscriber.subscribed.has("A")).toBe(false);
  });

  it("delivers transformed pattern subscriptions through pmessage", async () => {
    const subscriber = new FakeRedis();
    const publisher = new FakeRedis();
    const pubsub = new RedisPubSub({
      subscriber: subscriber as unknown as Redis,
      publisher: publisher as unknown as Redis,
      triggerTransform: (trigger, options) =>
        options.pattern ? `tenant:${trigger}:*` : `tenant:${trigger}`,
    });

    const received: unknown[] = [];
    const subId = await pubsub.subscribe(
      "orders",
      (message) => {
        received.push(message);
      },
      { pattern: true },
    );

    expect(subscriber.psubscribed.has("tenant:orders:*")).toBe(true);

    subscriber.emitPMessage(
      "tenant:orders:*",
      "tenant:orders:created",
      JSON.stringify({ id: 3 }),
    );
    expect(received).toEqual([{ id: 3 }]);

    pubsub.unsubscribe(subId);
    expect(subscriber.psubscribed.has("tenant:orders:*")).toBe(false);
  });
});
