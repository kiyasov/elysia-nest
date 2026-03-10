/**
 * @packageDocumentation
 *
 * Nestelia Drizzle ORM Module
 *
 * Integrates drizzle-orm with nestelia's dependency injection system.
 * Supports all drizzle-orm dialects (PostgreSQL, MySQL, SQLite) and
 * multiple simultaneous database instances via custom injection tokens.
 *
 * @example
 * ```typescript
 * import { DrizzleModule } from 'nestelia/drizzle';
 * import { drizzle } from 'drizzle-orm/node-postgres';
 * import { Pool } from 'pg';
 *
 * @Module({
 *   imports: [
 *     DrizzleModule.forRoot({
 *       db: drizzle(new Pool({ connectionString: process.env.DATABASE_URL })),
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @module
 */

export * from "./drizzle.constants";
export * from "./drizzle.module";
export * from "./decorators";
export * from "./interfaces";
