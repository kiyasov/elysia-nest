import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { EventEmitterService } from "../src/event-emitter.service";

/**
 * Guards perf issue E2: wildcard RegExps must be compiled ONCE at registration
 * time (not per emit), and exact dispatch must go through the O(1) Map index
 * while staying consistent across removal.
 */
describe("EventEmitterService — perf (E2)", () => {
  const OriginalRegExp = globalThis.RegExp;
  let compileCount = 0;

  beforeEach(() => {
    compileCount = 0;
    // Count only explicit `new RegExp(...)` construction. Regex *literals*
    // (e.g. `.replace(/.../g)`) do not route through this global binding, so
    // this isolates wildcard-pattern compilation.
    class CountingRegExp extends OriginalRegExp {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      constructor(...args: any[]) {
        compileCount++;
        // eslint-disable-next-line constructor-super
        super(...(args as [string]));
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).RegExp = CountingRegExp;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).RegExp = OriginalRegExp;
  });

  it("compiles each wildcard pattern's RegExp exactly once, not per emit", () => {
    const emitter = new EventEmitterService({ wildcard: true });

    emitter.on("order.*", () => {});
    emitter.on("user.**", () => {});

    // Two wildcard patterns -> two compilations at registration time.
    expect(compileCount).toBe(2);

    const afterRegistration = compileCount;

    // Hammer the hot path. If regexes were rebuilt per emit, this would grow
    // by (wildcard patterns) * (emits). It must stay flat.
    for (let i = 0; i < 5000; i++) {
      emitter.emit("order.created", i);
      emitter.emitAsync("user.profile.updated", i);
      emitter.listenerCount("order.created");
    }

    expect(compileCount).toBe(afterRegistration);
  });

  it("does not compile any RegExp for exact (non-wildcard) dispatch", () => {
    const emitter = new EventEmitterService({ wildcard: true });

    // Pattern with no `*`/`**` segment -> exact Map index, no regex.
    emitter.on("order.created", () => {});
    expect(compileCount).toBe(0);

    for (let i = 0; i < 5000; i++) {
      emitter.emit("order.created", i);
    }
    expect(compileCount).toBe(0);
  });
});

describe("EventEmitterService — exact Map index dispatch", () => {
  let emitter: EventEmitterService;

  beforeEach(() => {
    emitter = new EventEmitterService();
  });

  it("dispatches exact matches in registration order and does not cross events", async () => {
    const calls: string[] = [];
    emitter.on("a", () => calls.push("a1"));
    emitter.on("b", () => calls.push("b1"));
    emitter.on("a", () => calls.push("a2"));

    await emitter.emitAsync("a", null);
    expect(calls).toEqual(["a1", "a2"]);

    await emitter.emitAsync("b", null);
    expect(calls).toEqual(["a1", "a2", "b1"]);
  });

  it("keeps per-event isolation across many events (Map keyed lookup)", () => {
    for (let i = 0; i < 200; i++) {
      emitter.on(`event.${i}`, () => {});
    }
    expect(emitter.listenerCount("event.0")).toBe(1);
    expect(emitter.listenerCount("event.199")).toBe(1);
    expect(emitter.listenerCount("event.missing")).toBe(0);
  });
});

describe("EventEmitterService — removal keeps the index consistent", () => {
  it("off(event, handler) stops that handler receiving further emits", async () => {
    const emitter = new EventEmitterService();
    let count = 0;
    const handler = () => count++;
    emitter.on("evt", handler);
    emitter.on("evt", () => count++);

    emitter.off("evt", handler);
    await emitter.emitAsync("evt", null);

    // Only the second handler remains.
    expect(count).toBe(1);
    expect(emitter.listenerCount("evt")).toBe(1);
  });

  it("removeAllListeners(event) empties the Map bucket", async () => {
    const emitter = new EventEmitterService();
    let count = 0;
    emitter.on("evt", () => count++);
    emitter.on("evt", () => count++);

    emitter.removeAllListeners("evt");
    await emitter.emitAsync("evt", null);

    expect(count).toBe(0);
    expect(emitter.listenerCount("evt")).toBe(0);
  });

  it("off() stops a WILDCARD handler receiving further emits", async () => {
    const emitter = new EventEmitterService({ wildcard: true });
    let count = 0;
    const handler = () => count++;
    emitter.on("order.*", handler);

    await emitter.emitAsync("order.created", null);
    expect(count).toBe(1);

    emitter.off("order.*", handler);
    await emitter.emitAsync("order.created", null);
    expect(count).toBe(1);
    expect(emitter.listenerCount("order.created")).toBe(0);
  });

  it("removeAllListeners(wildcardPattern) drops the wildcard registration", async () => {
    const emitter = new EventEmitterService({ wildcard: true });
    let count = 0;
    emitter.on("order.*", () => count++);
    emitter.on("order.*", () => count++);

    emitter.removeAllListeners("order.*");
    await emitter.emitAsync("order.created", null);

    expect(count).toBe(0);
  });

  it("removeAllListeners() clears both exact and wildcard registries", async () => {
    const emitter = new EventEmitterService({ wildcard: true });
    let count = 0;
    emitter.on("order.created", () => count++); // exact
    emitter.on("order.*", () => count++); // wildcard

    emitter.removeAllListeners();
    await emitter.emitAsync("order.created", null);

    expect(count).toBe(0);
  });
});

describe("EventEmitterService — exact + wildcard preserve global registration order", () => {
  it("interleaves exact and wildcard handlers by registration order", async () => {
    const emitter = new EventEmitterService({ wildcard: true });
    const calls: string[] = [];

    emitter.on("**", () => calls.push("wild-all")); // seq 0, wildcard
    emitter.on("order.created", () => calls.push("exact")); // seq 1, exact
    emitter.on("order.*", () => calls.push("wild-order")); // seq 2, wildcard

    await emitter.emitAsync("order.created", null);

    expect(calls).toEqual(["wild-all", "exact", "wild-order"]);
  });
});
