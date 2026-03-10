---
title: Drizzle ORM
icon: database
description: Integración de ORM SQL tipado con inyección de dependencias
---

El módulo Drizzle integra [drizzle-orm](https://orm.drizzle.team) con el sistema de inyección de dependencias de nestelia. Es agnóstico respecto al dialecto — cualquier base de datos soportada por drizzle (PostgreSQL, MySQL, SQLite) funciona sin configuración adicional.

## Instalación

```bash
bun add drizzle-orm
```

Agrega el driver para tu base de datos:

```bash
# PostgreSQL
bun add postgres        # postgres.js (recomendado)
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite (integrado en Bun, sin instalación extra)
# bun:sqlite está incluido en Bun

# LibSQL / Turso
bun add @libsql/client
```

## Configuración

Crea tu instancia drizzle y pásala a `DrizzleModule.forRoot()`:

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

### Ejemplo con PostgreSQL

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### Configuración asíncrona

Usa `forRootAsync` cuando la cadena de conexión proviene de un servicio de configuración o variable de entorno:

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

## Definir el Schema

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

## Inyectando la base de datos

### @InjectDrizzle()

Usa el decorador `@InjectDrizzle()` como atajo para `@Inject(DRIZZLE_INSTANCE)`:

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

## Múltiples bases de datos

Registra cada base de datos con un `tag` único e inyéctala usando el mismo tag:

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

## Referencia de opciones

### DrizzleModuleOptions

| Propiedad | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `db` | `unknown` | — | Instancia drizzle-orm configurada **(requerido)** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | Token de inyección personalizado |
| `isGlobal` | `boolean` | `false` | Registrar como módulo global |

## Exportaciones

| Exportación | Descripción |
|-------------|-------------|
| `DrizzleModule` | Clase del módulo |
| `InjectDrizzle(tag?)` | Decorador de parámetro simplificado |
| `DRIZZLE_INSTANCE` | Token de inyección predeterminado |
| `DrizzleModuleOptions` | Interfaz de opciones síncronas |
| `DrizzleModuleAsyncOptions` | Interfaz de opciones asíncronas |
| `DrizzleOptionsFactory` | Interfaz de fábrica para `useClass` / `useExisting` |
