import { EventEmitter } from "events";
import type { Observable } from "rxjs";

import type {
  MessageHandler,
  Server as ServerInterface,
} from "../interfaces/server.interface";
import { packageLogger } from "../logger";

/**
 * Abstract base class for all built-in transport servers.
 *
 * Maintains two separate handler registries:
 * - `messageHandlers` – request-response handlers (registered via {@link MessagePattern}).
 * - `eventHandlers`   – fire-and-forget handlers  (registered via {@link EventPattern}).
 *
 * The unified {@link addHandler} method routes to `messageHandlers` for backward
 * compatibility with code that does not distinguish between the two.
 */
export abstract class BaseServer
  extends EventEmitter
  implements ServerInterface
{
  /** Handlers for request-response patterns. */
  protected readonly messageHandlers = new Map<string, MessageHandler>();
  /** Handlers for fire-and-forget event patterns. */
  protected readonly eventHandlers = new Map<string, MessageHandler>();

  /**
   * Registers `callback` as a request-response handler for `pattern`.
   * Equivalent to {@link addMessageHandler}.
   */
  public addHandler(pattern: string, callback: MessageHandler): void {
    this.messageHandlers.set(pattern, callback);
  }

  /**
   * Registers `callback` as a request-response handler for `pattern`.
   * The handler is expected to return a value that will be sent back to
   * the caller.
   */
  public addMessageHandler(pattern: string, callback: MessageHandler): void {
    this.messageHandlers.set(pattern, callback);
  }

  /**
   * Registers `callback` as a fire-and-forget event handler for `pattern`.
   * The handler's return value is ignored.
   */
  public addEventHandler(pattern: string, callback: MessageHandler): void {
    this.eventHandlers.set(pattern, callback);
  }

  public abstract sendMessage<T = unknown>(
    pattern: string,
    data: T,
  ): Promise<unknown>;

  public abstract emitEvent<T = unknown>(pattern: string, data: T): void;

  public abstract close(): void;

  public abstract listen(
    callback?: (err?: unknown) => void,
  ): void | Promise<void>;

  /**
   * Safely surfaces a transport-level error.
   *
   * Node's {@link EventEmitter} throws `ERR_UNHANDLED_ERROR` when `"error"` is
   * emitted with no registered listener, which would crash the whole process
   * on a routine `ECONNRESET`, Redis blip, or malformed frame. This helper only
   * re-emits when a listener is attached; otherwise it logs the error so it is
   * never silently swallowed and never crashes the process.
   */
  protected emitError(error: unknown): void {
    if (this.listenerCount("error") > 0) {
      this.emit("error", error);
    } else {
      packageLogger.error("Unhandled transport error:", error);
    }
  }

  /**
   * Removes all EventEmitter listeners and clears both handler maps.
   * Subclasses should call this in their `close()` implementation to
   * prevent memory leaks.
   */
  protected cleanup(): void {
    this.removeAllListeners();
    this.messageHandlers.clear();
    this.eventHandlers.clear();
  }

  /**
   * Dispatches an incoming request to the matching message handler.
   * @throws When no handler is registered for `pattern`.
   */
  protected handleMessage<T = unknown, R = unknown>(
    pattern: string,
    data: T,
    ctx: Record<string, unknown>,
  ): Promise<R> | Observable<R> | R | unknown {
    const handler = this.messageHandlers.get(pattern);
    if (!handler) {
      throw new Error(`No handler registered for pattern: "${pattern}"`);
    }
    return handler(data, ctx);
  }

  /**
   * Dispatches an incoming event to the matching event handler and returns the
   * handler's result so transports can `await` it before acknowledging the
   * message. Silently ignores events without a registered handler.
   */
  protected handleEvent<T = unknown>(
    pattern: string,
    data: T,
    ctx: Record<string, unknown>,
  ): Promise<unknown> | unknown {
    const handler = this.eventHandlers.get(pattern);
    if (handler) {
      return handler(data, ctx);
    }
    return undefined;
  }
}
