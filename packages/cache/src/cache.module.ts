import { createCache } from "cache-manager";

import { DynamicModule, Module } from "@kiyasov/elysia-nest";
import { CACHE_MANAGER } from "./cache.constants";
import { ConfigurableModuleClass } from "./cache.module-definition";
import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
} from "./interfaces/cache-module.interface";
import { createCacheManager } from "./cache.providers";

/**
 * Empty base class that will be merged with the Cache interface. 
 *
 * This class can be used as a provider token for dependency injection.
 *
 * @publicApi
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class Cache {}

/**
 * Cache interface extending the cache-manager's Cache type.
 *
 * This interface provides full typing for the cache manager instance
 * created by cache-manager library. Can be used for injection:
 * `@Inject(CACHE_MANAGER) private cacheManager: Cache`
 *
 * @publicApi
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface Cache extends ReturnType<typeof createCache> {}

/**
 * Module that provides caching functionality for @kiyasov/elysia-nest.
 *
 * This module wraps the cache-manager library and provides:
 * - In-memory caching by default
 * - Support for Redis and other stores
 * - Configurable TTL and refresh thresholds
 * - CacheInterceptor for automatic HTTP caching
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [CacheModule.register({ ttl: 60000 })],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * With async configuration:
 * ```typescript
 * @Module({
 *   imports: [
 *     CacheModule.registerAsync({
 *       useFactory: (config: ConfigService) => ({
 *         store: redisStore,
 *         ttl: config.get('CACHE_TTL'),
 *       }),
 *       inject: [ConfigService],
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @publicApi
 */
@Module({
  providers: [
    createCacheManager(),
    {
      provide: Cache,
      useExisting: CACHE_MANAGER,
    },
  ],
  exports: [CACHE_MANAGER, Cache],
})
export class CacheModule extends ConfigurableModuleClass {
  static register<T extends Record<string, unknown> = Record<string, unknown>>(
    options: CacheModuleOptions<T> = {} as CacheModuleOptions<T>,
  ): DynamicModule {
    return super.register(options);
  }

  static registerAsync<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(options: CacheModuleAsyncOptions<T>): DynamicModule {
    return super.registerAsync(options);
  }

  static forRoot<T extends Record<string, unknown> = Record<string, unknown>>(
    options: CacheModuleOptions<T> = {} as CacheModuleOptions<T>,
  ): DynamicModule {
    return super.register(options);
  }

  static forRootAsync<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(options: CacheModuleAsyncOptions<T>): DynamicModule {
    return super.registerAsync(options);
  }
}
