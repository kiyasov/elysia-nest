import { DynamicModule, Module } from "nestelia";

import { DRIZZLE_INSTANCE, DRIZZLE_MODULE_OPTIONS } from "./drizzle.constants";
import {
  createDrizzleAsyncProviders,
  createDrizzleProvider,
} from "./drizzle.providers";
import type {
  DrizzleModuleAsyncOptions,
  DrizzleModuleOptions,
} from "./interfaces/drizzle-module.interface";

/**
 * DrizzleModule — integrates drizzle-orm with nestelia's dependency injection.
 *
 * Accepts any pre-configured drizzle-orm database instance and makes it
 * injectable throughout the application. Supports all drizzle-orm dialects
 * (PostgreSQL, MySQL, SQLite) and multiple simultaneous database instances
 * via the `tag` option.
 *
 * @example
 * Synchronous registration:
 * ```typescript
 * import { drizzle } from 'drizzle-orm/node-postgres';
 * import { Pool } from 'pg';
 * import * as schema from './schema';
 *
 * @Module({
 *   imports: [
 *     DrizzleModule.forRoot({
 *       db: drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema }),
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * Asynchronous registration:
 * ```typescript
 * @Module({
 *   imports: [
 *     DrizzleModule.forRootAsync({
 *       isGlobal: true,
 *       inject: [ConfigService],
 *       useFactory: (config: ConfigService) => ({
 *         db: drizzle(
 *           new Pool({ connectionString: config.get('DATABASE_URL') }),
 *           { schema },
 *         ),
 *       }),
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @example
 * Multiple databases using `tag`:
 * ```typescript
 * @Module({
 *   imports: [
 *     DrizzleModule.forRoot({ db: primaryDb }),
 *     DrizzleModule.forRoot({ db: analyticsDb, tag: 'analytics' }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @publicApi
 */
@Module({})
export class DrizzleModule {
  /**
   * Synchronously configure the Drizzle module.
   *
   * @param options - Configuration including the drizzle db instance.
   */
  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    const token = options.tag ?? DRIZZLE_INSTANCE;
    return {
      module: DrizzleModule,
      global: options.isGlobal ?? false,
      providers: [
        { provide: DRIZZLE_MODULE_OPTIONS, useValue: options },
        createDrizzleProvider(token),
      ],
      exports: [token],
    };
  }

  /**
   * Asynchronously configure the Drizzle module.
   *
   * @param options - Async configuration options.
   */
  static forRootAsync(options: DrizzleModuleAsyncOptions): DynamicModule {
    const token = options.tag ?? DRIZZLE_INSTANCE;
    const asyncProviders = createDrizzleAsyncProviders(options);
    return {
      module: DrizzleModule,
      global: options.isGlobal ?? false,
      imports: (options.imports as never[]) ?? [],
      providers: [
        ...asyncProviders,
        ...(options.extraProviders ?? []),
        createDrizzleProvider(token),
      ],
      exports: [token],
    };
  }

  /** Alias for `forRoot`. */
  static register(options: DrizzleModuleOptions): DynamicModule {
    return DrizzleModule.forRoot(options);
  }

  /** Alias for `forRootAsync`. */
  static registerAsync(options: DrizzleModuleAsyncOptions): DynamicModule {
    return DrizzleModule.forRootAsync(options);
  }
}
