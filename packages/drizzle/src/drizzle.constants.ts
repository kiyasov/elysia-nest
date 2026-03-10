/**
 * Default injection token for the Drizzle ORM database instance.
 *
 * Use this token with `@Inject(DRIZZLE_INSTANCE)` or the `@InjectDrizzle()`
 * shorthand decorator.
 *
 * @publicApi
 */
export const DRIZZLE_INSTANCE = "DRIZZLE_INSTANCE";

/**
 * Injection token for the raw Drizzle module options object.
 *
 * @internal
 */
export const DRIZZLE_MODULE_OPTIONS = "DRIZZLE_MODULE_OPTIONS";
