import { Injectable, Logger } from "nestelia";

import type { EventEmitterModuleOptions } from "./interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandler<T = unknown> = (payload: T) => any;

interface HandlerRegistration<T = unknown> {
  pattern: string | symbol;
  handler: EventHandler<T>;
  once: boolean;
  /**
   * Monotonic registration sequence number. Used to merge exact- and
   * wildcard-matched handlers back into global registration order on dispatch.
   */
  seq: number;
  /**
   * Precompiled matcher for wildcard patterns. Present only when the pattern
   * is stored in the wildcard list (i.e. wildcard mode is on and the pattern
   * contains a `*`/`**` segment). Compiled once at registration time and
   * reused on every emit — never rebuilt per dispatch.
   */
  regex?: RegExp;
}

/**
 * Injectable event emitter service.
 *
 * Supports synchronous and asynchronous handlers, wildcard patterns,
 * and typed events. Use `@InjectEventEmitter()` or `@Inject(EVENT_EMITTER_TOKEN)`
 * to inject this service.
 *
 * Dispatch performance: exact (non-wildcard) patterns are indexed in a
 * `Map` for O(1) lookup, and each wildcard pattern's `RegExp` is compiled
 * once at registration time, so `emit`/`emitAsync`/`listenerCount` never scan
 * the full registration list nor recompile regexes on the request path.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class OrderService {
 *   constructor(private readonly events: EventEmitterService) {}
 *
 *   async placeOrder(order: Order) {
 *     await this.events.emitAsync('order.created', order);
 *   }
 * }
 * ```
 *
 */
@Injectable()
export class EventEmitterService {
  /**
   * Index of exact (non-wildcard) registrations, keyed by pattern for O(1)
   * lookup. Each bucket preserves registration order.
   */
  private readonly exact = new Map<string | symbol, HandlerRegistration[]>();
  /**
   * Wildcard registrations (wildcard mode only), in registration order. Each
   * carries a precompiled `regex`.
   */
  private readonly wildcards: HandlerRegistration[] = [];
  private seq = 0;
  private readonly wildcard: boolean;
  private readonly delimiter: string;
  private readonly maxListeners: number;

  constructor(options: EventEmitterModuleOptions = {}) {
    this.wildcard = options.wildcard ?? false;
    this.delimiter = options.delimiter ?? ".";
    this.maxListeners = options.maxListeners ?? 10;
  }

  /**
   * Emit an event synchronously. Returns `true` if at least one handler was
   * invoked (async handlers are fired but not awaited — use `emitAsync` if
   * you need to wait for them).
   */
  emit(event: string | symbol, payload?: unknown): boolean {
    const matched = this.getMatching(event);
    if (matched.length === 0) return false;

    const toRemove: HandlerRegistration[] = [];

    for (const reg of matched) {
      try {
        reg.handler(payload);
      } catch {
        // swallow — mirrors Node EventEmitter behaviour
      }
      if (reg.once) toRemove.push(reg);
    }

    this.removeRegistrations(toRemove);
    return true;
  }

  /**
   * Emit an event and await all async handlers.
   * Returns an array of values resolved by each handler.
   */
  async emitAsync(event: string | symbol, payload?: unknown): Promise<unknown[]> {
    const matched = this.getMatching(event);
    if (matched.length === 0) return [];

    const toRemove: HandlerRegistration[] = [];
    const results = await Promise.all(
      matched.map(async (reg) => {
        try {
          const result = await reg.handler(payload);
          if (reg.once) toRemove.push(reg);
          return result;
        } catch (err) {
          Logger.error(
            `Error in event handler for "${String(event)}": ${err instanceof Error ? err.message : String(err)}`,
            err instanceof Error ? err.stack : undefined,
            "EventEmitterService",
          );
          return undefined;
        }
      }),
    );

    this.removeRegistrations(toRemove);
    return results as unknown[];
  }

  /**
   * Register a persistent event handler.
   */
  on<T = unknown>(
    event: string | symbol,
    handler: EventHandler<T>,
  ): this {
    this.addRegistration(event, handler as EventHandler, false);
    return this;
  }

  /**
   * Register a one-time event handler.
   */
  once<T = unknown>(
    event: string | symbol,
    handler: EventHandler<T>,
  ): this {
    this.addRegistration(event, handler as EventHandler, true);
    return this;
  }

  /**
   * Remove a specific handler (or all handlers for an event when omitted).
   */
  off<T = unknown>(
    event: string | symbol,
    handler?: EventHandler<T>,
  ): this {
    const container = this.containerFor(event);

    if (!handler) {
      if (container === this.wildcards) {
        this.removeFromWildcards((r) => r.pattern === event);
      } else {
        this.exact.delete(event);
      }
      return this;
    }

    if (container === this.wildcards) {
      const idx = this.wildcards.findIndex(
        (r) => r.pattern === event && r.handler === (handler as EventHandler),
      );
      if (idx !== -1) this.wildcards.splice(idx, 1);
    } else {
      const bucket = this.exact.get(event);
      if (bucket) {
        const idx = bucket.findIndex(
          (r) => r.handler === (handler as EventHandler),
        );
        if (idx !== -1) bucket.splice(idx, 1);
        if (bucket.length === 0) this.exact.delete(event);
      }
    }
    return this;
  }

  /**
   * Remove all listeners, optionally scoped to a specific event.
   */
  removeAllListeners(event?: string | symbol): this {
    if (event === undefined) {
      this.exact.clear();
      this.wildcards.length = 0;
    } else if (this.containerFor(event) === this.wildcards) {
      this.removeFromWildcards((r) => r.pattern === event);
    } else {
      this.exact.delete(event);
    }
    return this;
  }

  /**
   * Returns the number of handlers registered for `event`.
   */
  listenerCount(event: string | symbol): number {
    return this.getMatching(event).length;
  }

  // ─── internal ─────────────────────────────────────────────────────────────

  private addRegistration(
    pattern: string | symbol,
    handler: EventHandler,
    once: boolean,
  ): void {
    const reg: HandlerRegistration = { pattern, handler, once, seq: this.seq++ };
    const isWild =
      this.wildcard &&
      typeof pattern === "string" &&
      this.isWildcardPattern(pattern);

    if (isWild) {
      this.warnIfTooMany(
        pattern as string,
        this.countWildcards(pattern as string),
      );
      reg.regex = this.compilePattern(pattern as string);
      this.wildcards.push(reg);
      return;
    }

    let bucket = this.exact.get(pattern);
    if (typeof pattern === "string") {
      this.warnIfTooMany(pattern, bucket?.length ?? 0);
    }
    if (bucket) {
      bucket.push(reg);
    } else {
      bucket = [reg];
      this.exact.set(pattern, bucket);
    }
  }

  private warnIfTooMany(pattern: string, currentCount: number): void {
    if (currentCount >= this.maxListeners) {
      Logger.warn(
        `Possible memory leak: ${this.maxListeners}+ listeners for "${pattern}". ` +
          `Increase maxListeners via EventEmitterModule.forRoot({ maxListeners: N }).`,
        "EventEmitterService",
      );
    }
  }

  private countWildcards(pattern: string): number {
    let n = 0;
    for (const r of this.wildcards) if (r.pattern === pattern) n++;
    return n;
  }

  /**
   * Collect the handlers that should run for `event`: exact-match handlers plus,
   * in wildcard mode, any wildcard handler whose precompiled regex matches. The
   * returned array is a fresh copy in global registration order, so callers may
   * mutate the registry (e.g. `once` cleanup, `off`) during iteration.
   */
  private getMatching(event: string | symbol): HandlerRegistration[] {
    const bucket = this.exact.get(event);

    if (
      !this.wildcard ||
      typeof event !== "string" ||
      this.wildcards.length === 0
    ) {
      return bucket ? bucket.slice() : [];
    }

    const wildMatches: HandlerRegistration[] = [];
    for (const reg of this.wildcards) {
      if (reg.pattern === event || (reg.regex as RegExp).test(event)) {
        wildMatches.push(reg);
      }
    }

    if (!bucket || bucket.length === 0) return wildMatches;
    if (wildMatches.length === 0) return bucket.slice();
    return this.mergeBySeq(bucket, wildMatches);
  }

  /**
   * Merge two registration lists (each already ordered by ascending `seq`) into
   * one list preserving global registration order.
   */
  private mergeBySeq(
    a: HandlerRegistration[],
    b: HandlerRegistration[],
  ): HandlerRegistration[] {
    const out: HandlerRegistration[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i].seq <= b[j].seq) out.push(a[i++]);
      else out.push(b[j++]);
    }
    while (i < a.length) out.push(a[i++]);
    while (j < b.length) out.push(b[j++]);
    return out;
  }

  private removeRegistrations(regs: HandlerRegistration[]): void {
    if (regs.length === 0) return;
    for (const reg of regs) {
      if (reg.regex) {
        const idx = this.wildcards.indexOf(reg);
        if (idx !== -1) this.wildcards.splice(idx, 1);
      } else {
        const bucket = this.exact.get(reg.pattern);
        if (bucket) {
          const idx = bucket.indexOf(reg);
          if (idx !== -1) bucket.splice(idx, 1);
          if (bucket.length === 0) this.exact.delete(reg.pattern);
        }
      }
    }
  }

  private removeFromWildcards(
    predicate: (r: HandlerRegistration) => boolean,
  ): void {
    for (let i = this.wildcards.length - 1; i >= 0; i--) {
      if (predicate(this.wildcards[i])) this.wildcards.splice(i, 1);
    }
  }

  /**
   * Returns the container in which registrations for `event` live, so removal
   * paths stay consistent with `addRegistration`'s classification.
   */
  private containerFor(
    event: string | symbol,
  ): HandlerRegistration[] | Map<string | symbol, HandlerRegistration[]> {
    if (
      this.wildcard &&
      typeof event === "string" &&
      this.isWildcardPattern(event)
    ) {
      return this.wildcards;
    }
    return this.exact;
  }

  /**
   * True when `pattern` contains at least one wildcard segment (`*` or `**`)
   * relative to the configured delimiter. Patterns without a wildcard segment
   * match exactly and are indexed in the exact `Map` even in wildcard mode.
   */
  private isWildcardPattern(pattern: string): boolean {
    for (const seg of pattern.split(this.delimiter)) {
      if (seg === "*" || seg === "**") return true;
    }
    return false;
  }

  /**
   * Compile a wildcard pattern into a `RegExp`.
   *
   * Rules (wildcard mode only):
   * - `**`  — matches everything
   * - `*`   — matches any single segment (no delimiter)
   * - `foo.*` — matches `foo.bar`, `foo.baz` …
   * - exact — no wildcards, must be identical
   */
  private compilePattern(pattern: string): RegExp {
    const escaped = this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexStr = pattern
      .split(this.delimiter)
      .map((seg) => {
        if (seg === "**") return ".*";
        if (seg === "*") return `[^${escaped}]+`;
        return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join(escaped);

    return new RegExp(`^${regexStr}$`);
  }
}
