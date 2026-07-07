import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Injectable } from "nestelia";
import { Container } from "nestelia";
import { RabbitMQModule, RabbitMQExplorer } from "../src/rabbitmq.module";
import { AmqpConnectionManager } from "../src/amqp/connectionManager";
import type { AmqpConnection } from "../src/amqp/connection";
import { RabbitSubscribe } from "../src/decorators/rabbitmq.decorators";

/**
 * Builds a fake AmqpConnection exposing only what the explorer touches:
 * `configuration` plus spying subscriber factories.
 */
function fakeConnection(name: string, overrides: Record<string, unknown> = {}) {
  const registered: unknown[] = [];
  const closed = { count: 0 };
  const connection = {
    configuration: {
      name,
      registerHandlers: true,
      enableDirectReplyTo: true,
      handlers: {},
      defaultHandler: "",
      ...overrides,
    },
    async createSubscriber(_handler: unknown, config: unknown) {
      registered.push(config);
      return { consumerTag: `${name}-tag` };
    },
    async createBatchSubscriber() {
      return { consumerTag: `${name}-batch` };
    },
    async createRpc() {
      return { consumerTag: `${name}-rpc` };
    },
    async close() {
      closed.count += 1;
    },
    __registered: registered,
    __closed: closed,
  };
  return connection as unknown as AmqpConnection & {
    __registered: unknown[];
    __closed: { count: number };
  };
}

/** Fake manager returning a fixed connection list and spying close(). */
function fakeManager(connections: AmqpConnection[]) {
  const closeCalls: string[] = [];
  const manager = {
    getConnections() {
      return connections;
    },
    async close() {
      for (const c of connections) {
        closeCalls.push((c as unknown as { configuration: { name: string } }).configuration.name);
        await (c as unknown as { close: () => Promise<void> }).close();
      }
    },
    __closeCalls: closeCalls,
  };
  return manager as unknown as AmqpConnectionManager & { __closeCalls: string[] };
}

describe("RabbitMQModule per-connection bootstrap guard (MS6)", () => {
  beforeEach(() => {
    RabbitMQModule.resetBootstrapGuard();
  });

  afterEach(() => {
    RabbitMQModule.resetBootstrapGuard();
  });

  it("guards each connection independently, not with a single boolean", () => {
    expect(RabbitMQModule.markConnectionBootstrapped("primary")).toBe(false);
    // Second call for the same connection is a no-op.
    expect(RabbitMQModule.markConnectionBootstrapped("primary")).toBe(true);
    // A DIFFERENT connection must still be allowed to bootstrap.
    expect(RabbitMQModule.markConnectionBootstrapped("secondary")).toBe(false);
    expect(RabbitMQModule.markConnectionBootstrapped("secondary")).toBe(true);
  });

  it("resetBootstrapGuard clears all connections", () => {
    RabbitMQModule.markConnectionBootstrapped("primary");
    RabbitMQModule.resetBootstrapGuard();
    expect(RabbitMQModule.markConnectionBootstrapped("primary")).toBe(false);
  });
});

describe("RabbitMQExplorer multi-connection bootstrap (MS6)", () => {
  beforeEach(() => {
    RabbitMQModule.resetBootstrapGuard();
    Container.instance.clear();
  });

  afterEach(() => {
    RabbitMQModule.resetBootstrapGuard();
    Container.instance.clear();
  });

  it("registers handlers for BOTH named connections, not just the first", async () => {
    @Injectable()
    class PrimaryHandler {
      @RabbitSubscribe({
        exchange: "ex",
        routingKey: "primary.key",
        queue: "primary-queue",
        connection: "primary",
      })
      handle() {}
    }

    @Injectable()
    class SecondaryHandler {
      @RabbitSubscribe({
        exchange: "ex",
        routingKey: "secondary.key",
        queue: "secondary-queue",
        connection: "secondary",
      })
      handle() {}
    }

    Container.instance.register([PrimaryHandler, SecondaryHandler]);

    const primary = fakeConnection("primary");
    const secondary = fakeConnection("secondary");
    const manager = fakeManager([primary, secondary]);

    const explorer = new RabbitMQExplorer(manager);
    await explorer.onModuleInit();

    // The bug: the second connection's handlers were never registered.
    expect(primary.__registered.length).toBe(1);
    expect(secondary.__registered.length).toBe(1);
  });
});

describe("RabbitMQExplorer shutdown closes ALL connections (MS6)", () => {
  beforeEach(() => {
    RabbitMQModule.resetBootstrapGuard();
  });

  afterEach(() => {
    RabbitMQModule.resetBootstrapGuard();
  });

  it("closes every managed connection on shutdown, not just the first", async () => {
    const primary = fakeConnection("primary");
    const secondary = fakeConnection("secondary");
    const manager = fakeManager([primary, secondary]);

    const explorer = new RabbitMQExplorer(manager);
    await explorer.onApplicationShutdown();

    expect(manager.__closeCalls).toEqual(["primary", "secondary"]);
    expect(primary.__closed.count).toBe(1);
    expect(secondary.__closed.count).toBe(1);
  });
});
