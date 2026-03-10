---
title: Drizzle ORM
icon: database
description: Type-safe SQL ORM integration with dependency injection
---

The Drizzle module integrates [drizzle-orm](https://orm.drizzle.team) with nestelia's dependency injection system. It is dialect-agnostic — any drizzle-supported database (PostgreSQL, MySQL, SQLite) works out of the box.

## Installation

```bash
bun add drizzle-orm
```

Add the driver for your database:

```bash
# PostgreSQL
bun add postgres        # postgres.js (recommended)
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite (no extra install needed in Bun)
# bun:sqlite is built into Bun

# LibSQL / Turso
bun add @libsql/client
```

## Setup

Create your drizzle instance and pass it to `DrizzleModule.forRoot()`:

```typescript
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Module } from "nestelia";
import { DrizzleModule } from "nestelia/drizzle";
import * as schema from "./schema";

const sqlite = new Database("app.db");
const db = drizzle(sqlite, { schema });

@Module({
  imports: [
    DrizzleModule.forRoot({ db, isGlobal: true }),
  ],
})
export class AppModule {}
```

### PostgreSQL example

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### Async configuration

Use `forRootAsync` when the connection string comes from a config service or environment:

```typescript
import { DrizzleModule } from "nestelia/drizzle";
import { ConfigService } from "./config.service";
import * as schema from "./schema";

DrizzleModule.forRootAsync({
  isGlobal: true,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const client = postgres(config.get("DATABASE_URL"));
    return { db: drizzle(client, { schema }) };
  },
})
```

#### useClass / useExisting

```typescript
import { DrizzleOptionsFactory, DrizzleModuleOptions } from "nestelia/drizzle";
import { Injectable } from "nestelia";

@Injectable()
class DatabaseConfig implements DrizzleOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createDrizzleOptions(): DrizzleModuleOptions {
    const client = postgres(this.config.get("DATABASE_URL"));
    return { db: drizzle(client, { schema }) };
  }
}

DrizzleModule.forRootAsync({ useClass: DatabaseConfig })
```

## Defining a schema

```typescript
// src/schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Injecting the database

### @InjectDrizzle()

Use the `@InjectDrizzle()` decorator as a shorthand for `@Inject(DRIZZLE_INSTANCE)`:

```typescript
import { Injectable } from "nestelia";
import { InjectDrizzle } from "nestelia/drizzle";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: DB) {}

  findAll() {
    return this.db.select().from(schema.users).all();
  }

  findOne(id: number) {
    return this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .get();
  }

  create(data: schema.NewUser) {
    return this.db
      .insert(schema.users)
      .values(data)
      .returning()
      .get();
  }
}
```

### Using the injection token directly

```typescript
import { Injectable, Inject } from "nestelia";
import { DRIZZLE_INSTANCE } from "nestelia/drizzle";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_INSTANCE) private readonly db: DB) {}
}
```

## Multiple databases

Register each database with a unique `tag` and inject it using the same tag:

```typescript
// app.module.ts
@Module({
  imports: [
    DrizzleModule.forRoot({ db: primaryDb }),
    DrizzleModule.forRoot({ db: analyticsDb, tag: "analytics" }),
  ],
})
export class AppModule {}
```

```typescript
// report.service.ts
@Injectable()
export class ReportService {
  constructor(
    @InjectDrizzle() private readonly primary: PrimaryDB,
    @InjectDrizzle("analytics") private readonly analytics: AnalyticsDB,
  ) {}
}
```

## Options reference

### DrizzleModuleOptions

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `db` | `unknown` | — | Pre-configured drizzle-orm database instance **(required)** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | Custom injection token |
| `isGlobal` | `boolean` | `false` | Register as a global module |

### DrizzleModuleAsyncOptions

| Property | Type | Description |
|----------|------|-------------|
| `tag` | `string \| symbol` | Custom injection token |
| `isGlobal` | `boolean` | Register as a global module |
| `imports` | `any[]` | Modules to import into this module's scope |
| `useFactory` | `(...args) => DrizzleModuleOptions` | Factory function |
| `inject` | `any[]` | Dependencies for the factory |
| `useClass` | `Type<DrizzleOptionsFactory>` | Class implementing `DrizzleOptionsFactory` |
| `useExisting` | `Type<DrizzleOptionsFactory>` | Existing provider implementing `DrizzleOptionsFactory` |
| `extraProviders` | `Provider[]` | Additional providers within this module's scope |

## Exports

| Export | Description |
|--------|-------------|
| `DrizzleModule` | The module class |
| `InjectDrizzle(tag?)` | Shorthand parameter decorator |
| `DRIZZLE_INSTANCE` | Default injection token |
| `DRIZZLE_MODULE_OPTIONS` | Token for raw options |
| `DrizzleModuleOptions` | Sync options interface |
| `DrizzleModuleAsyncOptions` | Async options interface |
| `DrizzleOptionsFactory` | Factory interface for `useClass` / `useExisting` |
