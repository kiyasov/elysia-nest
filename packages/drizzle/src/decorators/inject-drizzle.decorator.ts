import { Inject } from "nestelia";

import { DRIZZLE_INSTANCE } from "../drizzle.constants";

/**
 * Parameter/property decorator that injects a Drizzle ORM database instance.
 *
 * @param tag - Custom injection token registered via `DrizzleModuleOptions.tag`.
 *   Defaults to `DRIZZLE_INSTANCE`.
 *
 * @example
 * Default instance:
 * ```typescript
 * @Injectable()
 * export class UserService {
 *   constructor(
 *     @InjectDrizzle() private db: NodePgDatabase<typeof schema>,
 *   ) {}
 * }
 * ```
 *
 * @example
 * Named instance (multiple databases):
 * ```typescript
 * @Injectable()
 * export class ReportService {
 *   constructor(
 *     @InjectDrizzle() private primaryDb: NodePgDatabase,
 *     @InjectDrizzle('analytics') private analyticsDb: NodePgDatabase,
 *   ) {}
 * }
 * ```
 *
 * @publicApi
 */
export const InjectDrizzle = (tag?: string | symbol): ParameterDecorator =>
  Inject(tag ?? DRIZZLE_INSTANCE);
