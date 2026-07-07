import "reflect-metadata";

import { describe, expect, it } from "bun:test";

/**
 * Regression test for the split-brain global event emitter (issue: two divergent
 * emitters). The public `events` barrel used to export a placeholder singleton
 * with only `on`/`emit`, while the framework internals operated on a DIFFERENT
 * singleton (event-emitter.container.ts) with full `off`/`once`/
 * `removeAllListeners` support that `Container.clear()` actually resets.
 *
 * There must be exactly ONE global emitter: the public API must return the same
 * instance the internals use, and it must expose removal APIs so listeners can
 * be cleared (no leaks) and events cross the public/decorator boundary.
 */
describe("Unified global event emitter", () => {
  it("public getEventEmitter (events barrel) IS the internal singleton", async () => {
    const barrel = await import("~/src/events");
    const container = await import("~/src/events/event-emitter.container");

    expect(barrel.getEventEmitter()).toBe(container.getEventEmitter());
  });

  it("public emitter exposes off / once / removeAllListeners", async () => {
    const { getEventEmitter } = await import("~/src/events");
    const emitter = getEventEmitter() as unknown as Record<string, unknown>;

    expect(typeof emitter.on).toBe("function");
    expect(typeof emitter.emit).toBe("function");
    expect(typeof emitter.off).toBe("function");
    expect(typeof emitter.once).toBe("function");
    expect(typeof emitter.removeAllListeners).toBe("function");
  });

  it("listeners registered via the public API are removable (no leak)", async () => {
    const { getEventEmitter } = await import("~/src/events");
    const emitter = getEventEmitter();

    let count = 0;
    const handler = () => {
      count += 1;
    };
    emitter.on("unified.leak.test", handler);
    emitter.removeAllListeners("unified.leak.test");
    await emitter.emit("unified.leak.test", {});

    expect(count).toBe(0);
  });
});
