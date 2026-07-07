# packages/drizzle/src

Nestelia Drizzle ORM Module

Integrates drizzle-orm with nestelia's dependency injection system.
Supports all drizzle-orm dialects (PostgreSQL, MySQL, SQLite) and
multiple simultaneous database instances via custom injection tokens.

## Example

```typescript
import { DrizzleModule } from 'nestelia/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Module({
  imports: [
    DrizzleModule.forRoot({
      db: drizzle(new Pool({ connectionString: process.env.DATABASE_URL })),
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

## Classes

| Class | Description |
| ------ | ------ |
| [DrizzleModule](classes/DrizzleModule.md) | DrizzleModule — integrates drizzle-orm with nestelia's dependency injection. |

## Functions

| Function | Description |
| ------ | ------ |
| [getDrizzleOptionsToken](functions/getDrizzleOptionsToken.md) | Builds the per-instance options token for a given drizzle instance token. |
| [InjectDrizzle](functions/InjectDrizzle.md) | Parameter/property decorator that injects a Drizzle ORM database instance. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [DrizzleModuleAsyncOptions](interfaces/DrizzleModuleAsyncOptions.md) | Options for asynchronously configuring the Drizzle module. |
| [DrizzleModuleOptions](interfaces/DrizzleModuleOptions.md) | Options for synchronously configuring the Drizzle module. |
| [DrizzleOptionsFactory](interfaces/DrizzleOptionsFactory.md) | Factory interface for creating Drizzle module options. |

## Variables

| Variable | Description |
| ------ | ------ |
| [DRIZZLE\_INSTANCE](variables/DRIZZLE_INSTANCE.md) | Default injection token for the Drizzle ORM database instance. |
| [DRIZZLE\_MODULE\_OPTIONS](variables/DRIZZLE_MODULE_OPTIONS.md) | Base injection token for the raw Drizzle module options object. |
