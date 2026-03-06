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

  publish(trigger: string, message: unknown): void {
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
});
