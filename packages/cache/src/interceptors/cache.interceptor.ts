import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { HttpAdapterHost, Reflector } from "@kiyasov/elysia-nest";
import { StreamableFile } from "@kiyasov/elysia-nest";
import { Inject, Injectable, Optional } from "@kiyasov/elysia-nest";
import { CallHandler, NestInterceptor } from "@kiyasov/elysia-nest";
import { ExecutionContext } from "@kiyasov/elysia-nest";
import { Logger } from "@kiyasov/elysia-nest";
import { isFunction, isNil } from "@kiyasov/elysia-nest";
import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
} from "../cache.constants";
import type { Cache } from "../cache.module";
import { CacheKeyFactory, CacheTTLFactory } from "../decorators";

/**
 * Response object from cache manager get operation.
 *
 * @internal
 */
type CachedValue = unknown;

/**
 * Maximum length for cache keys to prevent memory exhaustion.
 *
 * @internal
 */
const MAX_CACHE_KEY_LENGTH = 250;

/**
 * Sanitizes a cache key to prevent injection attacks and cache poisoning.
 *
 * Removes or replaces potentially dangerous characters:
 * - Path traversal sequences (../, ..\)
 * - Null bytes
 * - Control characters
 * - Unicode replacement characters
 *
 * @param key - The raw cache key.
 * @returns The sanitized cache key.
 *
 * @internal
 */
function sanitizeCacheKey(key: string): string {
  if (typeof key !== "string") {
    return "";
  }

  let sanitized = key
    .replace(/\0/g, "")
    .replace(/\.{2,}[/\\]/g, "_")
    .replace(/\.{2,}/g, "_")
    .replace(/[\x00-\x1f\x7f-\x9f]/g, "")
    .replace(/\ufffd/g, "")
    .replace(/[<>'"`]/g, "_");

  if (sanitized.length > MAX_CACHE_KEY_LENGTH) {
    sanitized = sanitized.slice(0, MAX_CACHE_KEY_LENGTH);
  }

  return sanitized;
}

/**
 * Interceptor that handles HTTP caching using cache-manager.
 *
 * This interceptor checks the cache before executing a request handler.
 * If a cached value exists, it returns that value immediately.
 * Otherwise, it executes the handler and stores the result in cache.
 *
 * Features:
 * - Automatic cache key generation from HTTP request URL
 * - Support for custom cache keys via @CacheKey decorator
 * - Configurable TTL via @CacheTTL decorator
 * - Cache hit/miss headers (X-Cache)
 * - Only caches GET requests by default
 *
 * @example
 * ```typescript
 * @Controller('users')
 * @UseInterceptors(CacheInterceptor)
 * export class UserController {
 *   @Get(':id')
 *   @CacheTTL(60) // Cache for 60 seconds
 *   async findOne(@Param('id') id: string) {
 *     return this.userService.findOne(id);
 *   }
 * }
 * ```
 *
 * @publicApi
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  /**
   * List of HTTP methods that are allowed to be cached.
   */
  protected readonly allowedMethods: readonly string[] = ["GET"];

  /**
   * @param cacheManager - The cache manager instance.
   * @param reflector - The reflector for reading metadata.
   * @param httpAdapterHost - Optional HTTP adapter host; absent in non-HTTP contexts.
   */
  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly reflector: Reflector,
    @Optional()
    @Inject(HttpAdapterHost)
    protected readonly httpAdapterHost?: HttpAdapterHost,
  ) {}

  /**
   * Intercepts the request and handles caching logic.
   *
   * @param context - The execution context.
   * @param next - The next handler in the chain.
   * @returns An observable of the response.
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const key = this.trackBy(context);
    const ttlValueOrFactory: number | CacheTTLFactory | null =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
      this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
      null;

    if (!key) {
      return next.handle();
    }

    try {
      const value = (await this.cacheManager.get(key)) as CachedValue;
      this.setHeadersWhenHttp(context, value);

      if (!isNil(value)) {
        return of(value);
      }

      const ttl = isFunction(ttlValueOrFactory)
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory;

      return next.handle().pipe(
        tap((response: unknown) => {
          void this.handleResponse(response, key, ttl);
        }),
        catchError((error: Error) => {
          Logger.error(
            `Cache interceptor error for key: ${key}`,
            error.stack,
            "CacheInterceptor",
          );
          throw error;
        }),
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Logger.error(
        `Cache get operation failed for key: ${key}`,
        errorMessage,
        "CacheInterceptor",
      );
      return next.handle();
    }
  }

  /**
   * Handles the response and stores it in cache.
   *
   * @param response - The response to cache.
   * @param key - The cache key.
   * @param ttl - Optional time to live in milliseconds.
   */
  private async handleResponse(
    response: unknown,
    key: string,
    ttl: number | null,
  ): Promise<void> {
    if (response instanceof StreamableFile) {
      return;
    }

    try {
      if (!isNil(ttl)) {
        await this.cacheManager.set(key, response, ttl);
      } else {
        await this.cacheManager.set(key, response);
      }
    } catch (err: unknown) {
      const stack = err instanceof Error ? err.stack : undefined;
      const message = err instanceof Error ? err.message : String(err);
      Logger.error(
        `Failed to set cache for key: ${key}. Error: ${message}`,
        stack,
        "CacheInterceptor",
      );
    }
  }

  /**
   * Generates a cache key for the current request.
   *
   * @param context - The execution context.
   * @returns The cache key or undefined if not cacheable.
   */
  protected trackBy(context: ExecutionContext): string | undefined {
    const httpAdapter = this.httpAdapterHost?.httpAdapter;
    const isHttpApp =
      httpAdapter !== undefined && isFunction(httpAdapter.getRequestMethod);
    const cacheMetadataOrFactory: string | CacheKeyFactory | null =
      this.reflector.get(CACHE_KEY_METADATA, context.getHandler()) ?? null;

    if (!isHttpApp || cacheMetadataOrFactory !== null) {
      if (isFunction(cacheMetadataOrFactory)) {
        return sanitizeCacheKey(cacheMetadataOrFactory(context));
      }
      return cacheMetadataOrFactory !== null
        ? sanitizeCacheKey(cacheMetadataOrFactory)
        : undefined;
    }

    const request = context.getArgByIndex(0) as {
      method?: string;
      url?: string;
    };
    if (!this.isRequestCacheable(context)) {
      return undefined;
    }

    return sanitizeCacheKey(httpAdapter.getRequestUrl(request));
  }

  /**
   * Checks if the current request method is cacheable.
   *
   * @param context - The execution context.
   * @returns True if the request method is in allowedMethods.
   */
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ method?: string }>();
    const method = request.method;

    if (method === undefined) {
      return false;
    }

    return this.allowedMethods.includes(method);
  }

  /**
   * Sets cache headers (X-Cache: HIT/MISS) on HTTP response.
   *
   * @param context - The execution context.
   * @param value - The cached value (null/undefined means miss).
   */
  protected setHeadersWhenHttp(
    context: ExecutionContext,
    value: CachedValue,
  ): void {
    if (!this.httpAdapterHost) {
      return;
    }

    const { httpAdapter } = this.httpAdapterHost;
    if (!httpAdapter) {
      return;
    }

    const response = context.switchToHttp().getResponse();
    httpAdapter.setHeader(response, "X-Cache", isNil(value) ? "MISS" : "HIT");
  }
}
