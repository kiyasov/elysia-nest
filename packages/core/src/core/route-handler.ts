/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context as ElysiaContextType } from "elysia";

import {
  GUARDS_METADATA,
  INJECTABLE_METADATA,
  INTERCEPTORS_METADATA,
  PARAMS_METADATA,
} from "../decorators/constants";
import {
  PARAMS_METADATA as FILE_PARAMS_METADATA,
  processParameters,
} from "../decorators/param.decorators";
import { HEADERS_METADATA } from "../decorators/header.decorator";
import { HTTP_CODE_METADATA } from "../decorators/http-code.decorator";
import type { ParamMetadata } from "../decorators/types";
import { Container, DIContainer, Scope, type Type } from "../di";
import type { ExecutionContext } from "../interfaces/execution-context.interface";
import { Logger } from "../logger/logger.service";
import { resolveParam } from "./param-resolver";

let _reqId = 0;

// ── Param resolver compiler ──────────────────────────────────────────────────

type ParamResolver = (ctx: ElysiaContextType) => unknown;

/**
 * Compile a single param decorator into a synchronous resolver function.
 * Returns null if the param requires async resolution (factories, DI).
 */
function compileResolver(meta: ParamMetadata): ParamResolver | null {
  if (meta.type === "__factory__") return null;

  const data = meta.data as string | undefined;
  switch (meta.type) {
    case "param":
      return data ? (ctx) => ctx.params?.[data] : (ctx) => ctx.params || {};
    case "raw-body":
      return (ctx) => ctx.body;
    case "body":
      return data ? (ctx) => (ctx.body as any)?.[data] : (ctx) => ctx.body || {};
    case "query":
      return data ? (ctx) => ctx.query?.[data] : (ctx) => ctx.query || {};
    case "request":
    case "req":
      return (ctx) => ctx.request;
    case "response":
    case "res":
      return (ctx) => ctx.set;
    case "context":
    case "ctx":
    case "elysiaContext":
      return (ctx) => ctx;
    case "headers":
      return data ? (ctx) => ctx.request.headers.get(data) : (ctx) => ctx.request.headers;
    case "cookies":
      return data ? (ctx) => (ctx as any).cookie?.[data]?.value : (ctx) => (ctx as any).cookie;
    case "ip":
      return (ctx) => ctx.request.headers.get("x-forwarded-for") || (ctx as any).ip;
    case "session":
      return (ctx) => (ctx as any).session;
    default:
      return null;
  }
}

/**
 * Compile all param decorators for a method into a resolver array.
 * Returns null if any param requires async resolution.
 */
function compileResolvers(
  paramDefsByIndex: Map<number, ParamMetadata>,
  paramTypes: any[],
): ParamResolver[] | null {
  const resolvers: ParamResolver[] = [];
  for (let i = 0; i < paramTypes.length; i++) {
    const meta = paramDefsByIndex.get(i);
    if (!meta) {
      if (paramTypes[i] && paramTypes[i] !== Object) return null;
      resolvers.push(() => undefined);
      continue;
    }
    const r = compileResolver(meta);
    if (!r) return null;
    resolvers.push(r);
  }
  return resolvers;
}

/**
 * Wrap resolvers into a single function that returns all resolved params as an array.
 * Used by the full path when compiled resolvers are available.
 */
function wrapResolvers(resolvers: ParamResolver[]): (ctx: ElysiaContextType) => unknown[] {
  const len = resolvers.length;
  return (ctx) => {
    const result = new Array(len);
    for (let i = 0; i < len; i++) result[i] = resolvers[i](ctx);
    return result;
  };
}

// ── Execution context & guards ───────────────────────────────────────────────

function buildHttpExecutionContext(
  controllerClass: Type,
  handlerMethodName: string,
  controllerInstance: object,
  elysiaContext: ElysiaContextType,
): ExecutionContext {
  return {
    getClass: <T = any>() => controllerClass as unknown as T,
    getHandler: () =>
      (controllerInstance as Record<string, (...args: unknown[]) => unknown>)[handlerMethodName] ??
      (() => undefined),
    getArgs: <T extends Array<any> = any[]>() => [elysiaContext] as unknown as T,
    getArgByIndex: <T = any>(index: number) => ([elysiaContext] as any)[index] as T,
    getType: <TContext extends string = string>() => "http" as unknown as TContext,
    switchToHttp: () => ({
      getRequest: <T = any>() => elysiaContext.request as unknown as T,
      getResponse: <T = any>() => elysiaContext as unknown as T,
      getNext: <T = any>() => undefined as unknown as T,
    }),
    switchToRpc: () => ({
      getData: <T = any>() => undefined as unknown as T,
      getContext: <T = any>() => undefined as unknown as T,
    }),
    switchToWs: () => ({
      getData: <T = any>() => undefined as unknown as T,
      getClient: <T = any>() => undefined as unknown as T,
      getPattern: <T = any>() => undefined as unknown as T,
    }),
  };
}

/** Resolves an enhancer (guard/interceptor) instance for a single request. */
type EnhancerResolver = () => unknown | Promise<unknown>;

/**
 * Whether a class-based enhancer is request- or transient-scoped and therefore
 * must be resolved per request. Singleton/unscoped enhancers are resolved once at
 * bootstrap and reused, so only `guard.canActivate()` / `interceptor.intercept()`
 * runs per request (issues C2/C3).
 */
function isPerRequestScope(token: unknown): boolean {
  if (typeof token !== "function") return false;
  const scope = Reflect.getMetadata(INJECTABLE_METADATA, token)?.scope;
  return scope === Scope.REQUEST || scope === Scope.TRANSIENT;
}

/**
 * Builds one resolver per guard, closing over the resolved instance where safe.
 * - Pre-supplied instances are reused as-is.
 * - Request/transient-scoped guards are re-resolved per request to honor scope.
 * - Singleton/unscoped guards are DI-resolved (with a `new` fallback) once, lazily
 *   on the first request to avoid any bootstrap ordering hazard, then cached.
 */
function buildGuardResolvers(guards: unknown[], moduleinstance: any): EnhancerResolver[] {
  return guards.map((guardToken): EnhancerResolver => {
    if (typeof guardToken !== "function") {
      return () => guardToken;
    }
    if (isPerRequestScope(guardToken)) {
      return async () =>
        (await DIContainer.get(guardToken as Type, moduleinstance as Type)) ??
        new (guardToken as any)();
    }
    let cached: unknown;
    let resolved = false;
    return async () => {
      if (!resolved) {
        cached =
          (await DIContainer.get(guardToken as Type, moduleinstance as Type)) ??
          new (guardToken as any)();
        resolved = true;
      }
      return cached;
    };
  });
}

/**
 * Builds one resolver per interceptor. Mirrors the historical `new Interceptor()`
 * semantics (no DI) but instantiates singleton/unscoped interceptors ONCE at
 * bootstrap and reuses them, so stateful interceptors keep state across requests
 * (issue C3). Pre-supplied instances are reused; request/transient-scoped
 * interceptors get a fresh instance per request.
 */
function buildInterceptorResolvers(interceptors: any[]): EnhancerResolver[] {
  return interceptors.map((InterceptorClass): EnhancerResolver => {
    if (typeof InterceptorClass !== "function") {
      return () => InterceptorClass;
    }
    if (isPerRequestScope(InterceptorClass)) {
      return () => new InterceptorClass();
    }
    const instance = new InterceptorClass();
    return () => instance;
  });
}

async function runGuards(
  guardResolvers: EnhancerResolver[],
  controllerClass: Type,
  handlerMethodName: string,
  controllerInstance: object,
  elysiaContext: ElysiaContextType,
): Promise<{ statusCode: 403; error: string; message: string } | undefined> {
  const executionContext = buildHttpExecutionContext(
    controllerClass,
    handlerMethodName,
    controllerInstance,
    elysiaContext,
  );

  for (const resolve of guardResolvers) {
    const guard: any = await resolve();

    if (typeof guard?.canActivate === "function") {
      const allowed = await guard.canActivate(executionContext);
      if (!allowed) {
        elysiaContext.set.status = 403;
        return { statusCode: 403, error: "Forbidden", message: "Forbidden" };
      }
    }
  }
  return undefined;
}

// ── Metadata cache ───────────────────────────────────────────────────────────

interface RouteMetadata {
  guards: unknown[];
  interceptors: any[];
  paramDefinitions: ParamMetadata[];
  paramDefsByIndex: Map<number, ParamMetadata>;
  paramTypes: any[];
  fileParamDefs: Array<{ index: number }>;
  httpCode: number | undefined;
  headers: Array<{ name: string; value: string }>;
  /** Pre-compiled sync resolvers, or null if params need async/DI. */
  compiledResolvers: ParamResolver[] | null;
  /** Wrapped resolvers that return an array (for full path). */
  compiledParams: ((ctx: ElysiaContextType) => unknown[]) | null;
}

function collectMetadata(controllerClass: Type, method: string): RouteMetadata {
  const classGuards: unknown[] = Reflect.getMetadata(GUARDS_METADATA, controllerClass) ?? [];
  const methodGuards: unknown[] =
    Reflect.getMetadata(GUARDS_METADATA, controllerClass, method) ?? [];

  const paramDefinitions: ParamMetadata[] =
    Reflect.getMetadata(PARAMS_METADATA, controllerClass, method) || [];
  const paramTypes: any[] =
    Reflect.getMetadata("design:paramtypes", controllerClass.prototype, method) || [];

  const paramDefsByIndex = new Map<number, ParamMetadata>();
  for (const def of paramDefinitions) paramDefsByIndex.set(def.index, def);

  const compiledResolvers =
    paramTypes.length > 0 ? compileResolvers(paramDefsByIndex, paramTypes) : null;

  return {
    guards: [...classGuards, ...methodGuards],
    interceptors:
      Reflect.getMetadata(INTERCEPTORS_METADATA, controllerClass, method) || [],
    paramDefinitions,
    paramDefsByIndex,
    paramTypes,
    fileParamDefs:
      Reflect.getMetadata(FILE_PARAMS_METADATA, controllerClass, method) || [],
    httpCode: Reflect.getMetadata(HTTP_CODE_METADATA, controllerClass, method),
    headers: Reflect.getMetadata(HEADERS_METADATA, controllerClass, method) || [],
    compiledResolvers,
    compiledParams: compiledResolvers ? wrapResolvers(compiledResolvers) : null,
  };
}

// ── Lazy controller init helper ──────────────────────────────────────────────

function lazyBind(
  controllerClass: Type,
  handlerMethodName: string,
  moduleinstance: any,
): { get: () => Function | null; init: () => Promise<void> } {
  let bound: Function | null = null;
  return {
    get: () => bound,
    init: () =>
      DIContainer.get(controllerClass, moduleinstance as Type<any>).then((inst: any) => {
        bound = (inst[handlerMethodName] as Function).bind(inst);
      }),
  };
}

// ── Params-only handler builder ──────────────────────────────────────────────

function buildParamsOnlyHandler(
  resolvers: ParamResolver[],
  paramDefs: ParamMetadata[],
  controllerClass: Type,
  handlerMethodName: string,
  moduleinstance: any,
): (ctx: ElysiaContextType) => any {
  const { get, init } = lazyBind(controllerClass, handlerMethodName, moduleinstance);

  // Single-param fast inlines for the most common patterns
  if (resolvers.length === 1) {
    const meta0 = paramDefs.find((p) => p.index === 0);
    const data0 = meta0?.data as string | undefined;
    const type0 = meta0?.type;

    // Inline ctx property access for param/body/query without subfield
    if (!data0 && (type0 === "param" || type0 === "body" || type0 === "query")) {
      const prop = type0 === "param" ? "params" : type0;
      return (ctx: ElysiaContextType): any => {
        const fn = get();
        if (fn === null) return init().then(() => get()!((ctx as any)[prop]));
        return fn((ctx as any)[prop]);
      };
    }

    const r0 = resolvers[0];
    return (ctx: ElysiaContextType): any => {
      const fn = get();
      if (fn === null) return init().then(() => get()!(r0(ctx)));
      return fn(r0(ctx));
    };
  }

  if (resolvers.length === 2) {
    const [r0, r1] = resolvers;
    return (ctx: ElysiaContextType): any => {
      const fn = get();
      if (fn === null) return init().then(() => get()!(r0(ctx), r1(ctx)));
      return fn(r0(ctx), r1(ctx));
    };
  }

  if (resolvers.length === 3) {
    const [r0, r1, r2] = resolvers;
    return (ctx: ElysiaContextType): any => {
      const fn = get();
      if (fn === null) return init().then(() => get()!(r0(ctx), r1(ctx), r2(ctx)));
      return fn(r0(ctx), r1(ctx), r2(ctx));
    };
  }

  // 4+ params
  const len = resolvers.length;
  return (ctx: ElysiaContextType): any => {
    const args = new Array(len);
    for (let i = 0; i < len; i++) args[i] = resolvers[i](ctx);
    const fn = get();
    if (fn === null) return init().then(() => get()!(...args));
    return fn(...args);
  };
}

// ── Route handler factory ────────────────────────────────────────────────────

/**
 * Creates an Elysia route handler for a controller method.
 * All reflection is done once at startup.
 *
 * Three tiers:
 * 1. **Fast path** — no params, guards, interceptors: direct bound method call
 * 2. **Params-only path** — has params but nothing else: sync param resolution, no AsyncLocalStorage
 * 3. **Full path** — guards, interceptors, file params, etc: full pipeline with request context
 */
export function createRouteHandler(
  controllerClass: Type,
  handlerMethodName: string,
  moduleinstance: any,
): (ctx: ElysiaContextType) => any {
  const meta = collectMetadata(controllerClass, handlerMethodName);

  const hasGuards = meta.guards.length > 0;
  const hasInterceptors = meta.interceptors.length > 0;
  const hasParams = meta.paramTypes.length > 0;
  const hasFileParams = meta.fileParamDefs.length > 0;
  const hasHttpCode = meta.httpCode !== undefined;
  const hasHeaders = meta.headers.length > 0;
  const needsFullPath = hasGuards || hasInterceptors || hasFileParams || hasHttpCode || hasHeaders;

  // ── Fast path ──────────────────────────────────────────────────────────────
  if (!hasParams && !needsFullPath) {
    const { get, init } = lazyBind(controllerClass, handlerMethodName, moduleinstance);
    return (_ctx: ElysiaContextType): any => {
      const fn = get();
      if (fn === null) return init().then(() => get()!());
      return fn();
    };
  }

  // ── Params-only path ───────────────────────────────────────────────────────
  if (hasParams && !needsFullPath && meta.compiledResolvers) {
    return buildParamsOnlyHandler(
      meta.compiledResolvers,
      meta.paramDefinitions,
      controllerClass,
      handlerMethodName,
      moduleinstance,
    );
  }

  // ── Full path ──────────────────────────────────────────────────────────────
  // Resolve guard/interceptor instances ONCE (closed over) so per-request work is
  // limited to canActivate()/intercept(). Request/transient-scoped enhancers are
  // still resolved per request inside their resolvers (see build* helpers).
  const guardResolvers = hasGuards ? buildGuardResolvers(meta.guards, moduleinstance) : null;
  const interceptorResolvers = hasInterceptors
    ? buildInterceptorResolvers(meta.interceptors)
    : null;

  return async (elysiaContext: ElysiaContextType) =>
    Container.runInRequestContext({ id: ++_reqId, container: new Map() }, async () => {
      const controllerInstance = await DIContainer.get(controllerClass, moduleinstance as Type<any>);
      if (!controllerInstance) {
        Logger.error(`Failed to resolve controller ${controllerClass.name}`);
        elysiaContext.set.status = 500;
        return { error: "Internal server error" };
      }

      const originalMethod = (controllerInstance as Record<string, (...args: unknown[]) => unknown>)[
        handlerMethodName
      ];
      if (typeof originalMethod !== "function") {
        Logger.error(`Handler method ${handlerMethodName} not found on ${controllerClass.name}`);
        elysiaContext.set.status = 500;
        return { error: "Internal server error" };
      }

      // Guards
      if (hasGuards) {
        const denied = await runGuards(
          guardResolvers!, controllerClass, handlerMethodName,
          controllerInstance, elysiaContext,
        );
        if (denied) return denied;
      }

      // Interceptors
      if (hasInterceptors) {
        for (const resolve of interceptorResolvers!) {
          const interceptor: any = resolve();
          if (typeof interceptor?.intercept === "function") {
            await interceptor.intercept(elysiaContext);
          }
        }
      }

      // Parameters
      let resolvedParams: unknown[];
      if (meta.compiledParams) {
        resolvedParams = meta.compiledParams(elysiaContext);
      } else if (hasParams) {
        resolvedParams = await Promise.all(
          meta.paramTypes.map(async (paramType: any, index: number) => {
            const paramMeta = meta.paramDefsByIndex.get(index);
            try {
              return await resolveParam(paramMeta, paramType, elysiaContext, moduleinstance as Type<any>);
            } catch {
              return undefined;
            }
          }),
        );
      } else {
        resolvedParams = [];
      }

      // File/form params
      if (hasFileParams) {
        const fileResolved = await processParameters(elysiaContext as any, controllerClass, handlerMethodName);
        for (const { index } of meta.fileParamDefs) resolvedParams[index] = fileResolved[index];
      }

      const result = await originalMethod.apply(controllerInstance, resolvedParams);

      if (hasHttpCode) elysiaContext.set.status = meta.httpCode!;
      if (hasHeaders) {
        for (const { name, value } of meta.headers) elysiaContext.set.headers[name] = value;
      }

      return result;
    });
}
