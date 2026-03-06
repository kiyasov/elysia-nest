import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import {
  RABBIT_RPC_METADATA,
  RABBIT_SUBSCRIBE_METADATA,
  RabbitBatch,
  RabbitConnection,
  RabbitDLQ,
  RabbitErrorHandler,
  RabbitHandler,
  RabbitInterceptor,
  RabbitPayload,
  RabbitPriority,
  RabbitRPC,
  RabbitRetry,
  RabbitSubscribe,
  RabbitTTL,
  RABBIT_PAYLOAD_METADATA,
} from "../src/decorators/rabbitmq.decorators";
import { Nack } from "../src/nack";

describe("Nack", () => {
  it("defaults requeue to false", () => {
    expect(new Nack().requeue).toBe(false);
  });

  it("accepts requeue=true", () => {
    expect(new Nack(true).requeue).toBe(true);
  });
});

describe("@RabbitSubscribe", () => {
  it("stores subscription metadata on the class", () => {
    class Handler {
      @RabbitSubscribe({ exchange: "orders", routingKey: "order.created", queue: "q" })
      handle() {}
    }

    const meta = Reflect.getMetadata(RABBIT_SUBSCRIBE_METADATA, Handler);
    expect(meta).toHaveLength(1);
    expect(meta[0].options.exchange).toBe("orders");
    expect(meta[0].options.routingKey).toBe("order.created");
    expect(meta[0].methodName).toBe("handle");
  });

  it("accumulates multiple handlers", () => {
    class Handler {
      @RabbitSubscribe({ exchange: "a", routingKey: "a.b", queue: "q1" })
      handleA() {}

      @RabbitSubscribe({ exchange: "b", routingKey: "b.c", queue: "q2" })
      handleB() {}
    }

    const meta = Reflect.getMetadata(RABBIT_SUBSCRIBE_METADATA, Handler);
    expect(meta).toHaveLength(2);
  });
});

describe("@RabbitRPC", () => {
  it("stores RPC metadata on the class", () => {
    class Handler {
      @RabbitRPC({ exchange: "rpc", routingKey: "calc.add", queue: "rpc-q" })
      add() {}
    }

    const meta = Reflect.getMetadata(RABBIT_RPC_METADATA, Handler);
    expect(meta).toHaveLength(1);
    expect(meta[0].options.routingKey).toBe("calc.add");
  });
});

describe("@RabbitHandler", () => {
  it("marks class with __rabbitHandler__ metadata", () => {
    @RabbitHandler()
    class Handler {}

    expect(Reflect.getMetadata("__rabbitHandler__", Handler)).toBe(true);
  });
});

describe("@RabbitPayload", () => {
  it("stores parameter index", () => {
    class Handler {
      handle(@RabbitPayload() data: unknown) {}
    }

    const meta = Reflect.getMetadata(RABBIT_PAYLOAD_METADATA, Handler.prototype, "handle");
    expect(meta).toHaveLength(1);
    expect(meta[0].index).toBe(0);
  });
});

describe("@RabbitRetry", () => {
  it("stores retry config on method", () => {
    class Handler {
      @RabbitRetry(3, 1000)
      handle() {}
    }

    const meta = Reflect.getMetadata("__rabbitRetry__", Handler.prototype, "handle");
    expect(meta).toEqual({ attempts: 3, delay: 1000 });
  });
});

describe("@RabbitBatch", () => {
  it("stores batch config on method", () => {
    class Handler {
      @RabbitBatch(10, 500)
      handle() {}
    }

    const meta = Reflect.getMetadata("__rabbitBatch__", Handler.prototype, "handle");
    expect(meta).toEqual({ batchSize: 10, flushTimeout: 500 });
  });
});

describe("@RabbitDLQ", () => {
  it("stores DLQ config on method", () => {
    class Handler {
      @RabbitDLQ("dlx", "dead.letter")
      handle() {}
    }

    const meta = Reflect.getMetadata("__rabbitDLQ__", Handler.prototype, "handle");
    expect(meta).toEqual({ exchange: "dlx", routingKey: "dead.letter" });
  });
});

describe("@RabbitPriority", () => {
  it("stores priority on method", () => {
    class Handler {
      @RabbitPriority(5)
      handle() {}
    }

    expect(Reflect.getMetadata("__rabbitPriority__", Handler.prototype, "handle")).toBe(5);
  });
});

describe("@RabbitTTL", () => {
  it("stores TTL on method", () => {
    class Handler {
      @RabbitTTL(30000)
      handle() {}
    }

    expect(Reflect.getMetadata("__rabbitTTL__", Handler.prototype, "handle")).toBe(30000);
  });
});

describe("@RabbitConnection", () => {
  it("stores connection name on class", () => {
    @RabbitConnection("secondary")
    class Handler {}

    expect(Reflect.getMetadata("__rabbitConnection__", Handler)).toBe("secondary");
  });
});

describe("@RabbitErrorHandler", () => {
  it("stores error handler method name", () => {
    class Handler {
      @RabbitErrorHandler()
      onError() {}
    }

    expect(Reflect.getMetadata("__rabbitErrorHandler__", Handler.prototype)).toBe("onError");
  });
});

describe("@RabbitInterceptor", () => {
  it("accumulates interceptor method names", () => {
    class Handler {
      @RabbitInterceptor()
      interceptA() {}

      @RabbitInterceptor()
      interceptB() {}
    }

    const meta = Reflect.getMetadata("__rabbitInterceptors__", Handler);
    expect(meta).toContain("interceptA");
    expect(meta).toContain("interceptB");
  });
});
