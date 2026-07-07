import "reflect-metadata";

import { EventEmitter } from "events";

import { describe, expect, it } from "bun:test";

import { RedisClient } from "../src/client/redis.client";
import { RedisServer } from "../src/transports/redis.server";

describe("RedisServer — MS1 concurrent sendMessage on same channel", () => {
  it("resolves both concurrent requests with their own reply", async () => {
    const subscribed = new Set<string>();
    const fakeSub = new EventEmitter() as EventEmitter & {
      subscribe(ch: string): void;
      unsubscribe(ch: string): void;
      disconnect(): void;
    };
    fakeSub.subscribe = (ch) => void subscribed.add(ch);
    fakeSub.unsubscribe = (ch) => void subscribed.delete(ch);
    fakeSub.disconnect = () => {};

    const fakePub = new EventEmitter() as EventEmitter & {
      publish(channel: string, msg: string): Promise<number>;
      disconnect(): void;
    };
    fakePub.disconnect = () => {};
    fakePub.publish = (channel, msg) => {
      const parsed = JSON.parse(msg) as { id: string; data: unknown };
      const replyCh = `${channel}.reply`;
      // Simulate a remote replier answering asynchronously, but only while the
      // reply channel is still subscribed.
      queueMicrotask(() => {
        if (subscribed.has(replyCh)) {
          fakeSub.emit(
            "message",
            replyCh,
            JSON.stringify({ id: parsed.id, data: `echo:${String(parsed.data)}` }),
          );
        }
      });
      return Promise.resolve(1);
    };

    const server = new RedisServer({ host: "localhost" });
    (server as unknown as { subClient: unknown }).subClient = fakeSub;
    (server as unknown as { pubClient: unknown }).pubClient = fakePub;
    // Wire the persistent message listener (normally attached in listen()).
    fakeSub.on("message", (ch: string, m: string) =>
      (server as unknown as { handleRedisMessage(c: string, r: string): void })
        .handleRedisMessage(ch, m),
    );

    const both = Promise.all([
      server.sendMessage("foo", "one"),
      server.sendMessage("foo", "two"),
    ]);

    const outcome = await Promise.race([
      both.then((r) => ({ ok: true as const, r })),
      new Promise<{ ok: false }>((resolve) =>
        setTimeout(() => resolve({ ok: false }), 1000),
      ),
    ]);

    server.close();

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.r).toContain("echo:one");
      expect(outcome.r).toContain("echo:two");
    }
  });
});

describe("RedisServer — MS4 handler error publishes an error reply", () => {
  it("publishes { id, error } to the reply channel on handler failure", async () => {
    const published: Array<{ channel: string; msg: string }> = [];
    const fakeSub = new EventEmitter() as EventEmitter & {
      subscribe(ch: string): void;
      unsubscribe(ch: string): void;
      disconnect(): void;
    };
    fakeSub.subscribe = () => {};
    fakeSub.unsubscribe = () => {};
    fakeSub.disconnect = () => {};
    const fakePub = new EventEmitter() as EventEmitter & {
      publish(channel: string, msg: string): Promise<number>;
      disconnect(): void;
    };
    fakePub.disconnect = () => {};
    fakePub.publish = (channel, msg) => {
      published.push({ channel, msg });
      return Promise.resolve(1);
    };

    const server = new RedisServer({ host: "localhost" });
    (server as unknown as { subClient: unknown }).subClient = fakeSub;
    (server as unknown as { pubClient: unknown }).pubClient = fakePub;
    server.addMessageHandler("cmd", () => {
      throw new Error("boom");
    });

    await (
      server as unknown as {
        handleRedisMessage(c: string, r: string): Promise<void>;
      }
    ).handleRedisMessage("cmd", JSON.stringify({ id: "req-9", data: {} }));

    server.close();

    const reply = published.find((p) => p.channel === "cmd.reply");
    expect(reply).toBeDefined();
    const parsed = JSON.parse(reply!.msg) as { id: string; error: string };
    expect(parsed.id).toBe("req-9");
    expect(parsed.error).toBe("boom");
  });
});

describe("RedisClient — MS4 rejects on error reply", () => {
  it("errors the observable when the reply carries an error field", async () => {
    const client = new RedisClient({ host: "localhost" });
    const published: Array<{ id: string }> = [];
    const fakePub = {
      publish: (_ch: string, msg: string) => {
        published.push(JSON.parse(msg) as { id: string });
        return Promise.resolve(1);
      },
      removeAllListeners: () => {},
      disconnect: () => {},
    };
    const fakeSub = {
      subscribe: () => {},
      unsubscribe: () => {},
      removeAllListeners: () => {},
      disconnect: () => {},
    };
    (client as unknown as { pubClient: unknown }).pubClient = fakePub;
    (client as unknown as { subClient: unknown }).subClient = fakeSub;
    (client as unknown as { isConnected: boolean }).isConnected = true;

    const outcome = await new Promise<string>((resolve) => {
      client.send("cmd", {}).subscribe({
        next: () => resolve("next"),
        error: (e: Error) => resolve(`error:${e.message}`),
      });

      const { id } = published[0]!;
      (
        client as unknown as {
          handleReplyMessage(ch: string, raw: string): void;
        }
      ).handleReplyMessage("cmd.reply", JSON.stringify({ id, error: "boom" }));
    });

    client.close();

    expect(outcome).toBe("error:boom");
  });
});
