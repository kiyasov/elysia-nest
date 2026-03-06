import "reflect-metadata";

import { beforeEach, describe, expect, it } from "bun:test";

import {
  EVENT_LISTENER_METADATA,
  EVENTS_METADATA,
  EventSubscriber,
  OnEvent,
  registerEventHandlers,
} from "~/src/events/event.decorators";
import { EventEmitter } from "~/src/events/event-emitter";

describe("EventEmitter", () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe("Basic event handling", () => {
    it("should register event handler with on()", () => {
      const handler = () => {};
      emitter.on("test.event", handler);

      // Should not throw when emitting
      expect(() => emitter.emit("test.event", {})).not.toThrow();
    });

    it("should call handler when event is emitted", async () => {
      let called = false;
      const handler = () => {
        called = true;
      };

      emitter.on("test.event", handler);
      await emitter.emit("test.event", {});

      expect(called).toBe(true);
    });

    it("should pass payload to handler", async () => {
      let receivedPayload: any;
      const handler = (payload: any) => {
        receivedPayload = payload;
      };

      emitter.on("test.event", handler);
      await emitter.emit("test.event", { id: 123, name: "test" });

      expect(receivedPayload).toEqual({ id: 123, name: "test" });
    });

    it("should support multiple handlers for same event", async () => {
      let count = 0;
      const handler1 = () => {
        count++;
      };
      const handler2 = () => {
        count++;
      };

      emitter.on("test.event", handler1);
      emitter.on("test.event", handler2);
      await emitter.emit("test.event", {});

      expect(count).toBe(2);
    });
  });

  describe("once()", () => {
    it("should only call handler once", async () => {
      let count = 0;
      const handler = () => {
        count++;
      };

      emitter.once("test.event", handler);
      await emitter.emit("test.event", {});
      await emitter.emit("test.event", {});

      expect(count).toBe(1);
    });

    it("should not call handler after first emit", async () => {
      let called = false;
      const handler = () => {
        called = true;
      };

      emitter.once("test.event", handler);
      await emitter.emit("test.event", {});
      called = false;
      await emitter.emit("test.event", {});

      expect(called).toBe(false);
    });
  });

  describe("off()", () => {
    it("should remove specific handler", async () => {
      let count = 0;
      const handler = () => {
        count++;
      };

      emitter.on("test.event", handler);
      emitter.off("test.event", handler);
      await emitter.emit("test.event", {});

      expect(count).toBe(0);
    });

    it("should remove all handlers for event when no handler specified", async () => {
      let count = 0;
      const handler1 = () => {
        count++;
      };
      const handler2 = () => {
        count++;
      };

      emitter.on("test.event", handler1);
      emitter.on("test.event", handler2);
      emitter.off("test.event");
      await emitter.emit("test.event", {});

      expect(count).toBe(0);
    });

    it("should not throw when removing from non-existent event", () => {
      expect(() => emitter.off("non.existent")).not.toThrow();
    });

    it("should not affect other handlers when removing one", async () => {
      let count1 = 0;
      let count2 = 0;
      const handler1 = () => {
        count1++;
      };
      const handler2 = () => {
        count2++;
      };

      emitter.on("test.event", handler1);
      emitter.on("test.event", handler2);
      emitter.off("test.event", handler1);
      await emitter.emit("test.event", {});

      expect(count1).toBe(0);
      expect(count2).toBe(1);
    });
  });

  describe("Async handlers", () => {
    it("should wait for async handlers to complete", async () => {
      let completed = false;
      const handler = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        completed = true;
      };

      emitter.on("test.event", handler);
      await emitter.emit("test.event", {});

      expect(completed).toBe(true);
    });

    it("should handle multiple async handlers concurrently", async () => {
      const order: number[] = [];

      const handler1 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        order.push(1);
      };

      const handler2 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        order.push(2);
      };

      emitter.on("test.event", handler1);
      emitter.on("test.event", handler2);
      await emitter.emit("test.event", {});

      expect(order).toEqual([2, 1]);
    });
  });

  describe("Error handling", () => {
    it("should not fail when emitting event with no handlers", async () => {
      expect(() => emitter.emit("non.existent", {})).not.toThrow();
    });

    it("should continue executing handlers when one throws", async () => {
      let secondHandlerCalled = false;

      const handler1 = () => {
        throw new Error("Test error");
      };
      const handler2 = () => {
        secondHandlerCalled = true;
      };

      emitter.on("test.event", handler1);
      emitter.on("test.event", handler2);
      await emitter.emit("test.event", {});

      expect(secondHandlerCalled).toBe(true);
    });
  });

  describe("Symbol events", () => {
    it("should support symbol as event name", async () => {
      let called = false;
      const eventSymbol = Symbol("test.event");
      const handler = () => {
        called = true;
      };

      emitter.on(eventSymbol, handler);
      await emitter.emit(eventSymbol, {});

      expect(called).toBe(true);
    });

    it("should handle different symbols independently", async () => {
      const symbol1 = Symbol("event1");
      const symbol2 = Symbol("event2");
      let count = 0;

      emitter.on(symbol1, () => {
        count++;
      });
      emitter.on(symbol2, () => {
        count++;
      });

      await emitter.emit(symbol1, {});

      expect(count).toBe(1);
    });
  });
});

describe("Event Decorators", () => {
  describe("@EventSubscriber()", () => {
    it("should mark class as event subscriber", () => {
      @EventSubscriber()
      class TestSubscriber {}

      const isSubscriber = Reflect.getMetadata(
        EVENT_LISTENER_METADATA,
        TestSubscriber,
      );
      expect(isSubscriber).toBe(true);
    });
  });

  describe("@OnEvent()", () => {
    it("should register event handler metadata", () => {
      @EventSubscriber()
      class TestSubscriber {
        @OnEvent("user.created")
        handleUserCreated() {}
      }

      const events = Reflect.getMetadata(EVENTS_METADATA, TestSubscriber);
      expect(events).toHaveLength(1);
      expect(events[0].event).toBe("user.created");
      expect(events[0].methodName).toBe("handleUserCreated");
      expect(events[0].once).toBe(false);
    });

    it("should register multiple event handlers", () => {
      @EventSubscriber()
      class TestSubscriber {
        @OnEvent("user.created")
        handleUserCreated() {}

        @OnEvent("user.deleted")
        handleUserDeleted() {}
      }

      const events = Reflect.getMetadata(EVENTS_METADATA, TestSubscriber);
      expect(events).toHaveLength(2);
    });

    it("should support once option", () => {
      @EventSubscriber()
      class TestSubscriber {
        @OnEvent("init", { once: true })
        handleInit() {}
      }

      const events = Reflect.getMetadata(EVENTS_METADATA, TestSubscriber);
      expect(events[0].once).toBe(true);
    });

    it("should support symbol events", () => {
      const EVENT_SYMBOL = Symbol("test.event");

      @EventSubscriber()
      class TestSubscriber {
        @OnEvent(EVENT_SYMBOL)
        handleEvent() {}
      }

      const events = Reflect.getMetadata(EVENTS_METADATA, TestSubscriber);
      expect(events[0].event).toBe(EVENT_SYMBOL);
    });
  });

  describe("registerEventHandlers()", () => {
    it("should register handlers from subscriber instance", async () => {
      let receivedData: any;

      @EventSubscriber()
      class TestSubscriber {
        @OnEvent("test.event")
        handleEvent(data: any) {
          receivedData = data;
        }
      }

      const subscriber = new TestSubscriber();
      registerEventHandlers(subscriber);

      // Get the global event emitter and emit
      const { getEventEmitter } =
        await import("~/src/events/event-emitter.container");
      await getEventEmitter().emit("test.event", { test: true });

      expect(receivedData).toEqual({ test: true });
    });

    it("should bind handler to instance", async () => {
      let receivedValue: any;

      @EventSubscriber()
      class TestSubscriber {
        private value = "instance-value";

        @OnEvent("test.event")
        handleEvent() {
          receivedValue = this.value;
        }
      }

      const subscriber = new TestSubscriber();
      registerEventHandlers(subscriber);

      const { getEventEmitter } =
        await import("~/src/events/event-emitter.container");
      await getEventEmitter().emit("test.event", {});

      expect(receivedValue).toBe("instance-value");
    });

    it("should not register handlers for non-subscriber class", () => {
      class NotASubscriber {
        @OnEvent("test.event")
        handleEvent() {}
      }

      const instance = new NotASubscriber();
      // Should not throw
      expect(() => registerEventHandlers(instance)).not.toThrow();
    });

    it("should support once handlers", async () => {
      let count = 0;

      @EventSubscriber()
      class TestSubscriber {
        @OnEvent("test.event", { once: true })
        handleEvent() {
          count++;
        }
      }

      const subscriber = new TestSubscriber();
      registerEventHandlers(subscriber);

      const { getEventEmitter } =
        await import("~/src/events/event-emitter.container");
      const emitter = getEventEmitter();
      await emitter.emit("test.event", {});
      await emitter.emit("test.event", {});

      expect(count).toBe(1);
    });
  });
});
