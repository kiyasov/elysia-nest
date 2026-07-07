/**
 * Default injection token for the Drizzle ORM database instance.
 *
 * Use this token with `@Inject(DRIZZLE_INSTANCE)` or the `@InjectDrizzle()`
 * shorthand decorator.
 *
 */
export const DRIZZLE_INSTANCE = "DRIZZLE_INSTANCE";

/**
 * Base injection token for the raw Drizzle module options object.
 *
 * Never inject this token directly — options are registered under a
 * per-instance token derived via {@link getDrizzleOptionsToken} so that
 * multiple `DrizzleModule` registrations never collide on a shared token.
 *
 * @internal
 */
export const DRIZZLE_MODULE_OPTIONS = "DRIZZLE_MODULE_OPTIONS";

/**
 * Builds the per-instance options token for a given drizzle instance token.
 *
 * Each `DrizzleModule` registration provides (and injects) its options under
 * this unique token — keyed by the instance token (default `DRIZZLE_INSTANCE`
 * or a custom `tag`). Keeping the token unique prevents a second registration
 * from overwriting the first registration's options when core merges the
 * deduped `DrizzleModule` scope, which previously caused every drizzle
 * instance to collapse onto the last-registered db.
 *
 * @param token - The drizzle instance token (default or a custom `tag`).
 * @returns A stable string token unique to this instance.
 *
 * @internal
 */
export function getDrizzleOptionsToken(token: string | symbol): string {
  return `${DRIZZLE_MODULE_OPTIONS}:${String(token)}`;
}
