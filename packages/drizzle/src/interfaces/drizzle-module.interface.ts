import type { FactoryProvider, Provider, Type } from "nestelia";

/**
 * Options for synchronously configuring the Drizzle module.
 *
 * @publicApi
 */
export interface DrizzleModuleOptions {
  /**
   * A pre-configured drizzle-orm database instance.
   *
   * Create the instance using drizzle-orm's dialect-specific helpers
   * before passing it to the module:
   * - PostgreSQL: `drizzle(pool, { schema })`
   * - MySQL:      `drizzle(connection, { schema })`
   * - SQLite:     `drizzle(database, { schema })`
   */
  db: unknown;

  /**
   * Custom injection token for this database instance.
   *
   * Useful when registering multiple `DrizzleModule` instances in the same
   * application (e.g. primary + analytics databases).
   *
   * @default DRIZZLE_INSTANCE
   */
  tag?: string | symbol;

  /**
   * If `true`, registers `DrizzleModule` as a global module so the db
   * instance is available throughout the application without re-importing.
   *
   * @default false
   */
  isGlobal?: boolean;
}

/**
 * Factory interface for creating Drizzle module options.
 *
 * Implement this interface in a class and pass it via `useClass` or
 * `useExisting` in `DrizzleModule.forRootAsync()`.
 *
 * @publicApi
 */
export interface DrizzleOptionsFactory {
  /**
   * Returns Drizzle module options or a Promise resolving to them.
   */
  createDrizzleOptions(): DrizzleModuleOptions | Promise<DrizzleModuleOptions>;
}

/**
 * Options for asynchronously configuring the Drizzle module.
 *
 * @publicApi
 */
export interface DrizzleModuleAsyncOptions {
  /**
   * Custom injection token for the database instance.
   *
   * @default DRIZZLE_INSTANCE
   */
  tag?: string | symbol;

  /**
   * If `true`, registers `DrizzleModule` as a global module.
   *
   * @default false
   */
  isGlobal?: boolean;

  /**
   * Modules whose exported providers should be available as dependencies
   * within this dynamic module's scope.
   */
  imports?: unknown[];

  /**
   * Class that implements `DrizzleOptionsFactory`. An instance will be
   * created and its `createDrizzleOptions()` method called.
   */
  useClass?: Type<DrizzleOptionsFactory>;

  /**
   * Existing provider that implements `DrizzleOptionsFactory`.
   */
  useExisting?: Type<DrizzleOptionsFactory>;

  /**
   * Factory function that returns options (or a Promise of options).
   *
   * @example
   * ```typescript
   * useFactory: (config: ConfigService) => ({
   *   db: drizzle(new Pool({ connectionString: config.get('DATABASE_URL') }), { schema }),
   * }),
   * inject: [ConfigService],
   * ```
   */
  useFactory?: (
    ...args: unknown[]
  ) => DrizzleModuleOptions | Promise<DrizzleModuleOptions>;

  /**
   * Dependencies injected into the factory function.
   */
  inject?: FactoryProvider["inject"];

  /**
   * Extra providers registered within the scope of this dynamic module.
   */
  extraProviders?: Provider[];
}
