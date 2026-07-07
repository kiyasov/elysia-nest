import type { AnyElysia, Elysia } from "elysia";

import { addGlobalExceptionFilter } from "../../core/src/core/elysia-plugin.factory";
import { DIContainer, type Type } from "../../core/src/di";
import type { ExceptionContext, ExceptionFilter } from "../../core/src/exceptions";
import { HttpException } from "../../core/src/exceptions/http-exception";
import { getLifecycleManager } from "../../core/src/lifecycle";
import { createClassMetadataCache } from "../../core/src/utils/metadata-cache";
import {
  CATCH_EXCEPTIONS_METADATA,
  EVENT_PATTERN_METADATA,
  MESSAGE_DATA_METADATA,
  MESSAGE_PATTERN_CTX_METADATA,
  MESSAGE_PATTERN_METADATA,
} from "./constants";
import { Transport } from "./enums";
import type {
  CustomTransportStrategy,
  MicroserviceConfiguration,
  MicroserviceOptions,
  Server,
} from "./interfaces";
import { packageLogger } from "./logger";
import { BaseServer } from "./transports";
import { ServerFactory } from "./transports";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Contextual information passed to exception filters when an error occurs
 * inside a microservice message or event handler.
 */
export interface MicroserviceExceptionContext {
  pattern: string | Record<string, unknown>;
  transport: string;
  data: unknown;
  request?: unknown;
  response?: unknown;
  set?: unknown;
  path?: string;
  method?: string;
}

/** Metadata stored per connected microservice. */
export interface MicroserviceServerInfo {
  server: Server | CustomTransportStrategy;
  config: MicroserviceConfiguration;
  options: MicroserviceOptions;
}

// ─── Application ──────────────────────────────────────────────────────────────

/**
 * Top-level application class that ties together an Elysia HTTP server and
 * one or more microservice transport servers.
 *
 * The generic parameter `TApp` represents the underlying Elysia instance type.
 * When you need to export the application type for Eden Treaty, use:
 *
 * ```typescript
 * const app = await createElysiaApplication(AppModule);
 * await app.listen(3000);
 *
 * // Export the Elysia instance type for use with @elysiajs/eden treaty()
 * export type App = typeof app extends ElysiaNestApplication<infer T> ? T : never;
 * // or simply:
 * export type App = ReturnType<typeof app.getHttpServer>;
 * ```
 *
 * Note: route types from `@Get()` / `@Post()` decorators are registered at
 * runtime and cannot be inferred into the Elysia generic by TypeScript.
 * The returned instance has all routes registered at runtime and works with
 * `treaty<App>()` for HTTP calls.  For fully-typed route generics, declare a
 * parallel Elysia schema and use it as the `TApp` type parameter.
 *
 * Typical usage:
 * ```typescript
 * const app = await createElysiaApplication(AppModule);
 * app
 *   .connectMicroservice({ transport: Transport.REDIS, options: { host: 'localhost' } })
 *   .useGlobalFilters(new HttpExceptionFilter());
 *
 * await app.startAllMicroservices();
 * await app.listen(3000);
 * ```
 */
export class ElysiaNestApplication<TApp extends AnyElysia = Elysia> {
  private readonly microservices: MicroserviceServerInfo[] = [];
  private httpServer?: TApp;
  private controllers: Type[] = [];
  private isListening = false;
  private readonly globalFilters: Array<Type<ExceptionFilter> | ExceptionFilter> = [];

  /** Prevents duplicate `onError` / `onAfterHandle` hooks from being registered. */
  private errorHooksRegistered = false;

  private listenPort?: number;
  private listenHostname?: string;

  constructor(httpServer?: TApp) {
    this.httpServer = httpServer;
  }

  // ─── Microservice lifecycle ────────────────────────────────────────────────

  /**
   * Registers a new microservice transport.  Supports both built-in transports
   * (Redis, RabbitMQ, TCP) and custom transport strategies.
   *
   * @param options - Transport configuration or a custom strategy instance.
   * @returns `this` for chaining.
   *
   * @example
   * ```typescript
   * app.connectMicroservice({
   *   transport: Transport.REDIS,
   *   options: { host: 'localhost', port: 6379 },
   * });
   * ```
   */
  public connectMicroservice(options: MicroserviceOptions): this {
    const server = ServerFactory.create(options);
    const config = isCustomStrategy(options)
      ? ({ transport: Transport.TCP, options: {} } as MicroserviceConfiguration)
      : (options as MicroserviceConfiguration);

    this.microservices.push({ server, config, options });
    return this;
  }

  /**
   * Starts all registered microservice transports and registers their pattern
   * handlers.
   */
  public async startAllMicroservices(): Promise<void> {
    for (const microservice of this.microservices) {
      await this.startMicroservice(microservice);
    }
    packageLogger.log("[NestMicroservice] Nest microservice successfully started");
  }

  private async startMicroservice(microservice: MicroserviceServerInfo): Promise<void> {
    const { server } = microservice;

    // Register pattern handlers from controllers into the transport server.
    if ("addHandler" in server) {
      this.registerPatternHandlers(server as Server);
    }

    // Attach a default "error" listener BEFORE listening. Transport servers
    // extend EventEmitter and emit "error" on routine failures (client
    // ECONNRESET, Redis blips, malformed frames). Without a listener, Node
    // throws ERR_UNHANDLED_ERROR and crashes the whole process. This central
    // listener guarantees such errors are logged instead of fatal.
    const emitter = server as unknown as {
      on?: (event: string, listener: (err: unknown) => void) => unknown;
      listenerCount?: (event: string) => number;
    };
    if (
      typeof emitter.on === "function" &&
      (emitter.listenerCount?.("error") ?? 0) === 0
    ) {
      emitter.on("error", (err) => {
        packageLogger.error("[NestMicroservice] Transport error:", err);
      });
    }

    return new Promise((resolve, reject) => {
      (server as Server).listen((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // ─── Pattern handler registration ─────────────────────────────────────────

  /**
   * Iterates all registered controllers, reflects their decorator metadata,
   * and registers the corresponding handlers on `server`.
   *
   * - `@MessagePattern` → registered as request-response handler.
   * - `@EventPattern`   → registered as fire-and-forget event handler.
   */
  private registerPatternHandlers(server: Server): void {
    for (const controller of this.controllers) {
      const prototype = controller.prototype as object;

      for (const methodName of Object.getOwnPropertyNames(prototype)) {
        if (methodName === "constructor") continue;

        const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
        if (!descriptor || typeof descriptor.value !== "function") continue;

        const messageMetadata = Reflect.getMetadata(
          MESSAGE_PATTERN_METADATA,
          prototype,
          methodName,
        ) as { pattern: string | Record<string, unknown> } | undefined;

        if (messageMetadata) {
          const pattern = serializePattern(messageMetadata.pattern);
          const handler = this.createHandler(controller, methodName, pattern);

          if (server instanceof BaseServer) {
            server.addMessageHandler(pattern, handler);
          } else {
            server.addHandler(pattern, handler);
          }
        }

        const eventMetadata = Reflect.getMetadata(EVENT_PATTERN_METADATA, prototype, methodName) as
          | { pattern: string | Record<string, unknown> }
          | undefined;

        if (eventMetadata) {
          const pattern = serializePattern(eventMetadata.pattern);
          const handler = this.createEventHandler(controller, methodName, pattern);

          if (server instanceof BaseServer) {
            server.addEventHandler(pattern, handler);
          } else {
            server.addHandler(pattern, handler);
          }
        }
      }
    }
  }

  /**
   * Creates a request-response handler function for a controller method.
   * Exceptions are passed through global filters when registered.
   */
  private createHandler(controller: Type, methodName: string, pattern: string) {
    const invoke = this.buildInvoker(controller, methodName);
    return async (data: unknown, ctx: Record<string, unknown>): Promise<unknown> => {
      try {
        return await invoke(data, ctx);
      } catch (error) {
        const exception = error instanceof Error ? error : new Error(String(error));
        if (this.globalFilters.length > 0) {
          return this.dispatchToFilters(exception, {
            pattern,
            transport: ctx.transport as string,
            data,
          });
        }
        throw exception;
      }
    };
  }

  /**
   * Creates a fire-and-forget event handler function for a controller method.
   * Exceptions are logged but not re-thrown to avoid breaking the transport.
   */
  private createEventHandler(controller: Type, methodName: string, pattern: string) {
    const invoke = this.buildInvoker(controller, methodName);
    return async (data: unknown, ctx: Record<string, unknown>): Promise<void> => {
      try {
        await invoke(data, ctx);
      } catch (error) {
        const exception = error instanceof Error ? error : new Error(String(error));

        if (this.globalFilters.length > 0) {
          try {
            await this.dispatchToFilters(exception, {
              pattern,
              transport: ctx.transport as string,
              data,
            });
          } catch (filterError) {
            packageLogger.error(`Unhandled error in event handler "${pattern}":`, filterError);
          }
        } else {
          packageLogger.error(`Unhandled error in event handler "${pattern}":`, exception);
        }
      }
    };
  }

  /**
   * Builds a cached invoker that resolves `@Payload` / `@MessageCtx` metadata
   * once at registration time and reuses it for every incoming message.
   */
  private buildInvoker(
    controller: Type,
    methodName: string,
  ): (data: unknown, ctx: Record<string, unknown>) => Promise<unknown> {
    const proto = controller.prototype as object;
    const paramTypes = (Reflect.getMetadata("design:paramtypes", proto, methodName) ?? []) as unknown[];
    const payloadMeta = (Reflect.getMetadata(MESSAGE_DATA_METADATA, proto, methodName) ?? []) as Array<{
      index: number;
      property?: string;
    }>;
    const ctxMeta = (Reflect.getMetadata(MESSAGE_PATTERN_CTX_METADATA, proto, methodName) ?? []) as Array<{
      index: number;
    }>;
    const paramCount = paramTypes.length;
    const fallbackDataFirst =
      payloadMeta.length === 0 && ctxMeta.length === 0 && paramCount > 0;

    return async (data, ctx) => {
      const instance = await DIContainer.get(controller);
      if (!instance) {
        throw new Error(`Controller not found in DI container: ${controller.name}`);
      }

      const method = (instance as Record<string, unknown>)[methodName];
      if (typeof method !== "function") {
        throw new Error(`Method "${methodName}" not found on ${controller.name}`);
      }

      const params: unknown[] = new Array(paramCount);
      for (let i = 0; i < paramCount; i++) params[i] = undefined;

      for (let i = 0; i < payloadMeta.length; i++) {
        const { index, property } = payloadMeta[i];
        params[index] = property ? (data as Record<string, unknown>)?.[property] : data;
      }

      for (let i = 0; i < ctxMeta.length; i++) {
        params[ctxMeta[i].index] = ctx;
      }

      if (fallbackDataFirst) {
        params[0] = data;
      }

      return (method as (...args: unknown[]) => unknown).apply(instance, params);
    };
  }

  // ─── HTTP server / filters ─────────────────────────────────────────────────

  /**
   * Sets (or replaces) the Elysia HTTP server instance.
   * Applies any already-registered global filters to the new server.
   */
  public setHttpServer(server: TApp): void {
    this.httpServer = server;
    if (this.globalFilters.length > 0) {
      this.applyHttpErrorHooks();
    }
  }

  /**
   * Registers controllers whose methods will be scanned for `@MessagePattern`
   * and `@EventPattern` decorators.
   */
  public setControllers(controllers: Type[]): void {
    this.controllers = controllers;
  }

  /**
   * Registers one or more global exception filters.
   *
   * Filters are applied to:
   * 1. Microservice message / event handlers.
   * 2. The Elysia HTTP server (via `onError` and `onAfterHandle` hooks).
   *
   * @param filters - Filter class constructors or pre-constructed instances.
   * @returns `this` for chaining.
   *
   * @example
   * ```typescript
   * app.useGlobalFilters(new HttpExceptionFilter(), ValidationFilter);
   * ```
   */
  public useGlobalFilters(...filters: Array<Type<ExceptionFilter> | ExceptionFilter>): this {
    for (const filter of filters) {
      this.globalFilters.push(filter);

      const instance =
        typeof filter === "function" ? new (filter as Type<ExceptionFilter>)() : filter;
      addGlobalExceptionFilter(instance);
    }

    if (this.httpServer) {
      this.applyHttpErrorHooks();
    }
    return this;
  }

  /**
   * Registers `onError` and `onAfterHandle` hooks on the HTTP server that
   * route exceptions through the registered global filters.
   *
   * Idempotent: hooks are only registered once regardless of how many times
   * this method is called.
   */
  private applyHttpErrorHooks(): void {
    if (!this.httpServer || this.errorHooksRegistered) return;

    // Cast to the concrete Elysia type so the hook callback signatures are
    // known and the intermediate `rawCtx as ElysiaErrorCtx / ElysiaAfterHandleCtx`
    // casts remain valid regardless of the TApp generic parameter.
    const server = this.httpServer as Elysia;

    server.onError(async (rawCtx) => {
      const ctx = rawCtx as ElysiaErrorCtx;
      if (!ctx.error) return;
      const exception = ctx.error instanceof Error ? ctx.error : new Error(String(ctx.error));

      const filtered = await this.runFiltersForHttp(exception, buildHttpContext(ctx));
      if (filtered !== undefined) return filtered;

      // No global filter handled the error — return a safe fallback so Elysia
      // never forwards raw error.message (which may contain file paths or
      // internal implementation details) to the client.
      if (exception instanceof HttpException) {
        ctx.set.status = exception.statusCode;
        return exception.getResponse();
      }
      ctx.set.status = 500;
      return { statusCode: 500, message: "Internal server error" };
    });

    server.onAfterHandle(async (rawCtx) => {
      const ctx = rawCtx as ElysiaAfterHandleCtx;
      if (ctx.response !== "NOT_FOUND") return;

      const notFound = Object.assign(new Error("NOT_FOUND"), { status: 404 });
      const result = await this.runFiltersForHttp(notFound, buildHttpContext(ctx));

      ctx.set.status = 404;
      return result !== undefined ? result : "NOT_FOUND";
    });

    this.errorHooksRegistered = true;
  }

  /**
   * Runs registered filters against `exception` for an HTTP context.
   * Returns the first non-undefined value produced by a matching filter.
   */
  private async runFiltersForHttp(
    exception: Error,
    context: ExceptionContext,
  ): Promise<unknown> {
    for (const filter of this.globalFilters) {
      const filterInstance = await resolveFilterInstance(filter);
      if (!filterInstance) continue;

      if (filterCatches(filterInstance, exception)) {
        const result = await filterInstance.catch(exception, context);
        if (result !== undefined) return result;
      }
    }
    return undefined;
  }

  /**
   * Dispatches `exception` to the first matching global filter for a
   * microservice context.  Re-throws if no filter handles it.
   */
  private async dispatchToFilters(
    exception: Error,
    ctx: MicroserviceExceptionContext,
  ): Promise<unknown> {
    for (const filter of this.globalFilters) {
      const filterInstance = await resolveFilterInstance(filter);
      if (!filterInstance) continue;

      if (filterCatches(filterInstance, exception)) {
        return filterInstance.catch(
          exception,
          ctx as unknown as ExceptionContext,
        );
      }
    }
    throw exception;
  }

  /**
   * Ensures HTTP error hooks are registered.
   * Called internally by {@link useGlobalFilters} and externally by the core
   * application factory after all filters have been set up.
   *
   * @returns `this` for chaining.
   */
  public initGlobalFilters(): this {
    this.applyHttpErrorHooks();
    return this;
  }

  // ─── HTTP server start ─────────────────────────────────────────────────────

  /**
   * Starts the Elysia HTTP server.
   *
   * @param port     - Port to listen on.
   * @param callback - Optional callback invoked once the server is ready.
   */
  public async listen(port: number, callback?: () => void): Promise<void>;
  /**
   * @param port     - Port to listen on.
   * @param hostname - Network interface to bind to.
   * @param callback - Optional callback invoked once the server is ready.
   */
  public async listen(port: number, hostname: string, callback?: () => void): Promise<void>;
  public async listen(
    port: number,
    hostnameOrCallback?: string | (() => void),
    callback?: () => void,
  ): Promise<void> {
    if (!this.httpServer) {
      throw new Error(
        "HTTP server is not set. Pass an Elysia instance to the constructor " +
          "or call setHttpServer() before listen().",
      );
    }

    const hostname = typeof hostnameOrCallback === "string" ? hostnameOrCallback : undefined;
    const cb = typeof hostnameOrCallback === "function" ? hostnameOrCallback : callback;

    this.listenPort = port;
    this.listenHostname = hostname;

    getLifecycleManager().triggerOnApplicationBootstrap();

    packageLogger.log("[NestApplication] Nest application successfully started");

    if (hostname) {
      this.httpServer.listen({ port, hostname }, cb);
    } else {
      this.httpServer.listen(port, cb);
    }

    this.isListening = true;
  }

  // ─── Accessors ────────────────────────────────────────────────────────────

  /**
   * Returns the underlying Elysia HTTP server instance.
   *
   * Use this to export the type for Eden Treaty:
   * ```typescript
   * export type App = ReturnType<typeof app.getHttpServer>;
   * // client:
   * const client = treaty<App>('http://localhost:3000');
   * ```
   */
  public getHttpServer(): TApp {
    if (!this.httpServer) {
      throw new Error("HTTP server is not set");
    }
    return this.httpServer;
  }

  /**
   * Returns the underlying Elysia HTTP server typed as `TSchema`.
   *
   * Route types from `@Get()` / `@Post()` decorators cannot be inferred by
   * TypeScript because they are registered at runtime.  Pass a typed Elysia
   * schema built with the native builder pattern and this method will cast the
   * live server to that type so `treaty<App>()` clients get full
   * autocomplete for paths, request bodies, and response shapes.
   *
   * At runtime the **actual live server** (with all Nestelia routes) is
   * returned — the schema is only used for its TypeScript type.
   *
   * ```typescript
   * import { t } from "elysia";
   *
   * const typedServer = app.withSchema(
   *   new Elysia()
   *     .get("/todos", (): Todo[] => [])
   *     .post("/todos", (): Todo => ({} as Todo), {
   *       body: t.Object({ title: t.String() }),
   *     }),
   * );
   *
   * export type App = typeof typedServer;
   * // client:
   * const client = treaty<App>("http://localhost:3000");
   * const { data } = await client.todos.get(); // data: Todo[]
   * ```
   */
  public withSchema<TSchema extends AnyElysia>(schema: TSchema): TSchema {
    if (!this.httpServer) {
      throw new Error("HTTP server is not set");
    }
    void schema; // schema is used only for its TypeScript type
    return this.httpServer as unknown as TSchema;
  }

  /** Returns all registered microservice descriptors. */
  public getMicroservices(): MicroserviceServerInfo[] {
    return this.microservices;
  }

  /**
   * Returns the base URL of the HTTP server.
   * Only meaningful after {@link listen} has been called.
   */
  public getUrl(): string {
    const host = this.listenHostname ?? "localhost";
    const port = this.listenPort;
    return port !== undefined ? `http://${host}:${port}` : `http://${host}`;
  }

  // ─── Shutdown ─────────────────────────────────────────────────────────────

  /**
   * Gracefully shuts down all microservice transports and the HTTP server,
   * triggering the corresponding lifecycle hooks.
   */
  public async close(): Promise<void> {
    // Order mirrors NestJS: onModuleDestroy → beforeApplicationShutdown →
    // onApplicationShutdown. Each trigger is awaited so async cleanup (DB
    // pools, BullMQ workers, Redis clients) fully settles before we tear down
    // the transports and HTTP server underneath it.
    await getLifecycleManager().triggerOnModuleDestroy();
    await getLifecycleManager().triggerBeforeApplicationShutdown();

    for (const { server } of this.microservices) {
      if ("close" in server && typeof server.close === "function") {
        // A transport's close() may be sync (void) or async (Promise) — await
        // both uniformly so async teardown completes before HTTP shutdown.
        await Promise.resolve(server.close());
      }
    }

    this.httpServer?.stop();

    await getLifecycleManager().triggerOnApplicationShutdown();
    getLifecycleManager().clear();

    this.isListening = false;
  }
}

// ─── Local Elysia context shapes ──────────────────────────────────────────────
// We define minimal structural types instead of importing Elysia's complex
// generic types, which would force us to specify all generic parameters.

interface ElysiaErrorCtx {
  error: unknown;
  request: Request;
  response?: unknown;
  set: { status?: number | string; headers?: Record<string, string> };
  path: string;
}

interface ElysiaAfterHandleCtx {
  response: unknown;
  request: Request;
  set: { status?: number | string; headers?: Record<string, string> };
  path: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Serializes a pattern to a stable string key. */
function serializePattern(pattern: string | Record<string, unknown>): string {
  return typeof pattern === "string" ? pattern : JSON.stringify(pattern);
}

/** Returns `true` when `options` is a custom transport strategy. */
function isCustomStrategy(options: MicroserviceOptions): options is CustomTransportStrategy {
  return "listen" in options && typeof (options as CustomTransportStrategy).listen === "function";
}

/**
 * Resolves a filter entry (class or instance) to a concrete
 * {@link ExceptionFilter} instance.
 */
async function resolveFilterInstance(
  filter: Type<ExceptionFilter> | ExceptionFilter,
): Promise<ExceptionFilter | undefined> {
  if (typeof filter === "function") {
    return (await DIContainer.get(filter)) as ExceptionFilter | undefined;
  }
  return filter;
}

const _msFilterCache = createClassMetadataCache<
  Array<new (...args: unknown[]) => Error> | undefined
>();

/**
 * Returns `true` when `filterInstance` should handle `exception`.
 * A filter with no registered exception types catches everything.
 */
function filterCatches(filterInstance: ExceptionFilter, exception: Error): boolean {
  const types = _msFilterCache.get(filterInstance.constructor, () =>
    Reflect.getMetadata(CATCH_EXCEPTIONS_METADATA, filterInstance.constructor) as
      | Array<new (...args: unknown[]) => Error>
      | undefined,
  );

  return !types || types.length === 0 || types.some((T) => exception instanceof T);
}

/** Builds an {@link ExceptionContext} from an Elysia HTTP context. */
function buildHttpContext(
  ctx: ElysiaErrorCtx | ElysiaAfterHandleCtx,
): ExceptionContext {
  return {
    request: ctx.request,
    response: ctx.response,
    set: ctx.set,
    path: ctx.path,
    method: ctx.request.method,
  };
}
