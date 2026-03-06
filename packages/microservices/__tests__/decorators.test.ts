import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import {
  EVENT_PATTERN_METADATA,
  MESSAGE_DATA_METADATA,
  MESSAGE_PATTERN_METADATA,
} from "../constants";
import { EventPattern } from "../decorators/event-pattern.decorator";
import { MessagePattern } from "../decorators/message-pattern.decorator";
import { Payload } from "../decorators/payload.decorator";

describe("@MessagePattern", () => {
  it("stores string pattern metadata on the method", () => {
    class Controller {
      @MessagePattern("sum")
      sum() {}
    }

    const meta = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, Controller.prototype, "sum");
    expect(meta.pattern).toBe("sum");
  });

  it("stores object pattern metadata", () => {
    class Controller {
      @MessagePattern({ cmd: "get_user" })
      getUser() {}
    }

    const meta = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, Controller.prototype, "getUser");
    expect(meta.pattern).toEqual({ cmd: "get_user" });
  });

  it("stores transport when provided", () => {
    const CUSTOM_TRANSPORT = Symbol("CUSTOM");

    class Controller {
      @MessagePattern("hello", CUSTOM_TRANSPORT)
      hello() {}
    }

    const meta = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, Controller.prototype, "hello");
    expect(meta.transport).toBe(CUSTOM_TRANSPORT);
  });

  it("transport is undefined when not provided", () => {
    class Controller {
      @MessagePattern("ping")
      ping() {}
    }

    const meta = Reflect.getMetadata(MESSAGE_PATTERN_METADATA, Controller.prototype, "ping");
    expect(meta.transport).toBeUndefined();
  });
});

describe("@EventPattern", () => {
  it("stores string event pattern metadata", () => {
    class Controller {
      @EventPattern("user.created")
      onUserCreated() {}
    }

    const meta = Reflect.getMetadata(EVENT_PATTERN_METADATA, Controller.prototype, "onUserCreated");
    expect(meta.pattern).toBe("user.created");
  });

  it("stores object event pattern", () => {
    class Controller {
      @EventPattern({ event: "order.placed" })
      onOrderPlaced() {}
    }

    const meta = Reflect.getMetadata(EVENT_PATTERN_METADATA, Controller.prototype, "onOrderPlaced");
    expect(meta.pattern).toEqual({ event: "order.placed" });
  });

  it("stores transport when provided", () => {
    const T = Symbol("T");

    class Controller {
      @EventPattern("tick", T)
      onTick() {}
    }

    const meta = Reflect.getMetadata(EVENT_PATTERN_METADATA, Controller.prototype, "onTick");
    expect(meta.transport).toBe(T);
  });
});

describe("@Payload", () => {
  it("stores parameter index for full payload", () => {
    class Controller {
      @MessagePattern("sum")
      sum(@Payload() data: number[]) {}
    }

    const meta: Array<{ index: number; property?: string }> = Reflect.getMetadata(
      MESSAGE_DATA_METADATA,
      Controller.prototype,
      "sum",
    );
    expect(meta).toHaveLength(1);
    expect(meta[0].index).toBe(0);
    expect(meta[0].property).toBeUndefined();
  });

  it("stores property name when provided", () => {
    class Controller {
      @MessagePattern("login")
      login(@Payload("username") username: string) {}
    }

    const meta: Array<{ index: number; property?: string }> = Reflect.getMetadata(
      MESSAGE_DATA_METADATA,
      Controller.prototype,
      "login",
    );
    expect(meta[0].property).toBe("username");
  });

  it("accumulates multiple @Payload decorators", () => {
    class Controller {
      @MessagePattern("op")
      op(@Payload("a") a: string, @Payload("b") b: string) {}
    }

    const meta: Array<{ index: number; property?: string }> = Reflect.getMetadata(
      MESSAGE_DATA_METADATA,
      Controller.prototype,
      "op",
    );
    expect(meta).toHaveLength(2);
    const props = meta.map((m) => m.property);
    expect(props).toContain("a");
    expect(props).toContain("b");
  });
});
