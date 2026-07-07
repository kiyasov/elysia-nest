import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import { PubSubAsyncIterator } from "../src/pubsub-async-iterator";
import type { PubSubEngine } from "../src/interfaces";

// In-memory PubSub engine stub
class MockPubSub implements PubSubEngine {
  private handlers = new Map<number, (msg: unknown) => void>();
  private counter = 0;

  subscribe(trigger: string, handler: (msg: unknown) => void): Promise<number> {
    const id = ++this.counter;
    this.handlers.set(id, handler);
    return Promise.resolve(id);
  }

  unsubscribe(id: number): void {
    this.handlers.delete(id);
  }

  async publish(trigger: string, message: unknown): Promise<void> {
    for (const handler of this.handlers.values()) {
      handler(message);
    }
  }

  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, Array.isArray(triggers) ? triggers : [triggers]);
  }
}

describe("PubSubAsyncIterator", () => {
  it("yields messages published after next() is called", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["test"]);

    // Wait for subscription to be set up
    await new Promise((r) => setTimeout(r, 0));

    const nextPromise = iter.next();
    pubsub.publish("test", "hello");

    const result = await nextPromise;
    expect(result.done).toBe(false);
    expect(result.value).toBe("hello");

    await iter.return();
  });

  it("buffers messages published before next() is called", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<number>(pubsub, ["nums"]);

    await new Promise((r) => setTimeout(r, 0));

    pubsub.publish("nums", 1);
    pubsub.publish("nums", 2);

    const r1 = await iter.next();
    const r2 = await iter.next();

    expect(r1.value).toBe(1);
    expect(r2.value).toBe(2);

    await iter.return();
  });

  it("return() resolves with done=true", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["ch"]);

    await new Promise((r) => setTimeout(r, 0));

    const result = await iter.return();
    expect(result.done).toBe(true);
  });

  it("next() after return() resolves with done=true", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["ch"]);

    await new Promise((r) => setTimeout(r, 0));
    await iter.return();

    const result = await iter.next();
    expect(result.done).toBe(true);
  });

  it("throw() rejects with the given error", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["ch"]);

    await new Promise((r) => setTimeout(r, 0));
    await expect(iter.throw(new Error("boom"))).rejects.toThrow("boom");
  });

  it("is usable with Symbol.asyncIterator", () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["ch"]);
    expect(iter[Symbol.asyncIterator]()).toBe(iter);
  });

  it("pending next() resolves with done=true when return() is called", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["ch"]);

    await new Promise((r) => setTimeout(r, 0));

    const pending = iter.next();
    await iter.return();

    const result = await pending;
    expect(result.done).toBe(true);
  });

  it("self-closes after idleTimeoutMs when no message arrives", async () => {
    const pubsub = new MockPubSub();
    const unsubscribes: number[] = [];
    const originalUnsubscribe = pubsub.unsubscribe.bind(pubsub);
    pubsub.unsubscribe = (id: number): void => {
      unsubscribes.push(id);
      originalUnsubscribe(id);
    };

    const iter = new PubSubAsyncIterator<string>(pubsub, ["idle"], {
      idleTimeoutMs: 30,
    });

    await new Promise((r) => setTimeout(r, 0));

    // Nothing is published → idle watchdog fires → iterator auto-returns.
    const pending = iter.next();
    await new Promise((r) => setTimeout(r, 60));
    const result = await pending;

    expect(result.done).toBe(true);
    expect(unsubscribes.length).toBe(1);
  });

  it("idleTimeoutMs resets on every inbound message", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<number>(pubsub, ["beat"], {
      idleTimeoutMs: 40,
    });

    await new Promise((r) => setTimeout(r, 0));

    // Publish every 20ms — well inside the 40ms window — so the
    // iterator keeps receiving events and never times out.
    for (let i = 0; i < 5; i++) {
      pubsub.publish("beat", i);
      await new Promise((r) => setTimeout(r, 20));
    }

    // The iterator should still be live — collect the five events.
    const collected: number[] = [];
    for (let i = 0; i < 5; i++) {
      const res = await iter.next();
      if (res.done) break;
      collected.push(res.value);
    }
    expect(collected).toEqual([0, 1, 2, 3, 4]);

    await iter.return();
  });

  it("idleTimeoutMs = 0 disables the watchdog (default)", async () => {
    const pubsub = new MockPubSub();
    const iter = new PubSubAsyncIterator<string>(pubsub, ["off"], {
      idleTimeoutMs: 0,
    });

    await new Promise((r) => setTimeout(r, 0));

    // Wait "a long time" — no auto-close should happen.
    await new Promise((r) => setTimeout(r, 80));

    pubsub.publish("off", "still-alive");
    const res = await iter.next();
    expect(res.done).toBe(false);
    expect(res.value).toBe("still-alive");

    await iter.return();
  });

  it("unsubscribeAll survives a throwing unsubscribe and still settles pending next()", async () => {
    const unsubscribed: number[] = [];
    let counter = 0;

    // Engine whose unsubscribe THROWS for the first id (mirrors
    // RedisPubSub.unsubscribe throwing on inconsistent state).
    const throwingPubSub: PubSubEngine = {
      subscribe(_trigger: string, _handler: (msg: unknown) => void): Promise<number> {
        return Promise.resolve(++counter);
      },
      unsubscribe(id: number): void {
        if (id === 1) throw new Error("inconsistent state");
        unsubscribed.push(id);
      },
      async publish(): Promise<void> {},
      asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
        return new PubSubAsyncIterator<T>(this, Array.isArray(triggers) ? triggers : [triggers]);
      },
    };

    const iter = new PubSubAsyncIterator<string>(throwingPubSub, ["A", "B", "C"]);
    // Let subscribeAll() settle → ids [1, 2, 3].
    await new Promise((r) => setTimeout(r, 0));

    // A pending consumer that must be released when we return().
    const pending = iter.next();

    // return() must not throw even though id 1's unsubscribe does.
    await iter.return();

    // ids 2 and 3 were still unsubscribed despite id 1 throwing.
    expect(unsubscribed).toContain(2);
    expect(unsubscribed).toContain(3);

    // The pending next() settled with done=true instead of hanging forever.
    const res = await pending;
    expect(res.done).toBe(true);
  });

  it("return() during pending subscribeAll() still unsubscribes", async () => {
    let subscribeResolve: ((id: number) => void) | undefined;
    const unsubscribed: number[] = [];

    const slowPubSub: PubSubEngine = {
      subscribe(_trigger: string, _handler: (msg: unknown) => void): Promise<number> {
        return new Promise((resolve) => {
          subscribeResolve = resolve;
        });
      },
      unsubscribe(id: number): void {
        unsubscribed.push(id);
      },
      async publish(): Promise<void> {},
      asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
        return new PubSubAsyncIterator<T>(this, Array.isArray(triggers) ? triggers : [triggers]);
      },
    };

    const iter = new PubSubAsyncIterator<string>(slowPubSub, ["ch"]);

    // Call return() while subscribeAll() is still pending
    const returnPromise = iter.return();

    // Now let subscribe complete
    subscribeResolve!(42);

    await returnPromise;
    expect(unsubscribed).toEqual([42]);
  });
});
