import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { RabbitMQClient } from "../src/client/rabbitmq.client";
import { RabbitMQServer } from "../src/transports/rabbitmq.server";

interface FakeMsg {
  content: Buffer;
  fields: { routingKey: string; deliveryTag: number; redelivered: boolean };
  properties: {
    correlationId?: string;
    replyTo?: string;
    headers?: Record<string, unknown>;
  };
}

function makeMsg(opts: {
  pattern: string;
  data?: unknown;
  redelivered?: boolean;
  replyTo?: string;
  correlationId?: string;
}): FakeMsg {
  return {
    content: Buffer.from(JSON.stringify(opts.data ?? {})),
    fields: {
      routingKey: opts.pattern,
      deliveryTag: 1,
      redelivered: opts.redelivered ?? false,
    },
    properties: {
      correlationId: opts.correlationId,
      replyTo: opts.replyTo,
      headers: { pattern: opts.pattern },
    },
  };
}

function makeFakeChannel() {
  const calls = {
    ack: [] as FakeMsg[],
    nack: [] as Array<{ requeue?: boolean }>,
    sentToQueue: [] as Array<{ queue: string; content: string; opts: any }>,
  };
  let consumeCb: ((msg: FakeMsg | null) => void | Promise<void>) | undefined;

  const channel = {
    prefetch: async () => {},
    consume: async (
      _queue: string,
      cb: (msg: FakeMsg | null) => void | Promise<void>,
    ) => {
      consumeCb = cb;
      return { consumerTag: "tag" };
    },
    ack: (msg: FakeMsg) => calls.ack.push(msg),
    nack: (_msg: FakeMsg, _allUpTo?: boolean, requeue?: boolean) =>
      calls.nack.push({ requeue }),
    sendToQueue: (queue: string, content: Buffer, opts: any) => {
      calls.sentToQueue.push({ queue, content: content.toString(), opts });
      return true;
    },
    publish: () => true,
  };

  return {
    channel,
    calls,
    invoke: (msg: FakeMsg) => consumeCb!(msg),
  };
}

describe("RabbitMQServer — MS2 unmatched pattern must not requeue forever", () => {
  it("nacks with requeue=false when the message was already redelivered", async () => {
    const server = new RabbitMQServer({ urls: ["amqp://x"], queue: "q" });
    const { channel, calls, invoke } = makeFakeChannel();
    (server as unknown as { channel: unknown }).channel = channel;

    await (
      server as unknown as { startConsuming(): Promise<void> }
    ).startConsuming();

    await invoke(makeMsg({ pattern: "unknown", redelivered: true }));

    expect(calls.nack).toHaveLength(1);
    expect(calls.nack[0]!.requeue).toBe(false);
  });

  it("nacks with requeue=true on the first delivery of an unmatched message", async () => {
    const server = new RabbitMQServer({ urls: ["amqp://x"], queue: "q" });
    const { channel, calls, invoke } = makeFakeChannel();
    (server as unknown as { channel: unknown }).channel = channel;

    await (
      server as unknown as { startConsuming(): Promise<void> }
    ).startConsuming();

    await invoke(makeMsg({ pattern: "unknown", redelivered: false }));

    expect(calls.nack[0]!.requeue).toBe(true);
  });
});

describe("RabbitMQServer — MS3 event handler must be awaited before ack", () => {
  it("does not ack when an async event handler rejects", async () => {
    const server = new RabbitMQServer({ urls: ["amqp://x"], queue: "q" });
    const { channel, calls, invoke } = makeFakeChannel();
    (server as unknown as { channel: unknown }).channel = channel;

    let handlerRan = false;
    server.addEventHandler("evt", async () => {
      handlerRan = true;
      throw new Error("handler failed");
    });

    await (
      server as unknown as { startConsuming(): Promise<void> }
    ).startConsuming();

    await invoke(makeMsg({ pattern: "evt" }));

    expect(handlerRan).toBe(true);
    // The message must NOT be acked when the handler threw.
    expect(calls.ack).toHaveLength(0);
    expect(calls.nack.length).toBeGreaterThan(0);
  });
});

describe("RabbitMQServer — MS4 handler error publishes an error reply", () => {
  it("sends { error } to replyTo when a message handler throws", async () => {
    const server = new RabbitMQServer({ urls: ["amqp://x"], queue: "q" });
    const { channel, calls, invoke } = makeFakeChannel();
    (server as unknown as { channel: unknown }).channel = channel;

    server.addMessageHandler("cmd", () => {
      throw new Error("boom");
    });

    await (
      server as unknown as { startConsuming(): Promise<void> }
    ).startConsuming();

    await invoke(
      makeMsg({ pattern: "cmd", replyTo: "reply-q", correlationId: "c-1" }),
    );

    expect(calls.sentToQueue).toHaveLength(1);
    const sent = calls.sentToQueue[0]!;
    expect(sent.queue).toBe("reply-q");
    const body = JSON.parse(sent.content) as { error: string };
    expect(body.error).toBe("boom");
    expect(sent.opts.headers.error).toBe(true);
  });
});

describe("RabbitMQClient — MS4 rejects on error reply", () => {
  it("errors the observable when the reply carries the error header", async () => {
    const client = new RabbitMQClient({ urls: ["amqp://x"], queue: "q" });
    const published: Array<{ correlationId?: string }> = [];
    const fakeChannel = {
      publish: (_ex: string, _rk: string, _buf: Buffer, opts: any) => {
        published.push(opts);
        return true;
      },
      cancel: async () => {},
      close: async () => {},
    };
    (client as unknown as { channel: unknown }).channel = fakeChannel;
    (client as unknown as { replyQueue: string }).replyQueue = "rq";
    (client as unknown as { isConnected: boolean }).isConnected = true;

    const outcome = await new Promise<string>((resolve) => {
      client.send("cmd", {}).subscribe({
        next: () => resolve("next"),
        error: (e: Error) => resolve(`error:${e.message}`),
      });

      const correlationId = published[0]!.correlationId;
      (
        client as unknown as { handleReplyMessage(msg: FakeMsg): void }
      ).handleReplyMessage({
        content: Buffer.from(JSON.stringify({ error: "boom" })),
        fields: { routingKey: "", deliveryTag: 1, redelivered: false },
        properties: { correlationId, headers: { error: true } },
      });
    });

    client.close();

    expect(outcome).toBe("error:boom");
  });
});
