---
title: Drizzle ORM
icon: database
description: Integração de ORM SQL tipado com injeção de dependência
---

O módulo Drizzle integra o [drizzle-orm](https://orm.drizzle.team) com o sistema de injeção de dependência do nestelia. É agnóstico em relação ao dialeto — qualquer banco de dados suportado pelo drizzle (PostgreSQL, MySQL, SQLite) funciona imediatamente.

## Instalação

```bash
bun add drizzle-orm
```

Adicione o driver para o seu banco de dados:

```bash
# PostgreSQL
bun add postgres        # postgres.js (recomendado)
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite (integrado ao Bun, sem instalação extra)
# bun:sqlite já está incluído no Bun

# LibSQL / Turso
bun add @libsql/client
```

## Configuração

Crie sua instância drizzle e passe para `DrizzleModule.forRoot()`:

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

### Exemplo com PostgreSQL

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### Configuração assíncrona

Use `forRootAsync` quando a string de conexão vier de um serviço de configuração ou variável de ambiente:

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

## Definindo o Schema

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

## Injetando o banco de dados

### @InjectDrizzle()

Use o decorador `@InjectDrizzle()` como atalho para `@Inject(DRIZZLE_INSTANCE)`:

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

## Múltiplos bancos de dados

Registre cada banco com uma `tag` única e injete usando a mesma tag:

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

## Referência de opções

### DrizzleModuleOptions

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `db` | `unknown` | — | Instância drizzle-orm configurada **(obrigatório)** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | Token de injeção personalizado |
| `isGlobal` | `boolean` | `false` | Registrar como módulo global |

## Exportações

| Exportação | Descrição |
|-----------|-----------|
| `DrizzleModule` | Classe do módulo |
| `InjectDrizzle(tag?)` | Decorador de parâmetro simplificado |
| `DRIZZLE_INSTANCE` | Token de injeção padrão |
| `DrizzleModuleOptions` | Interface de opções síncronas |
| `DrizzleModuleAsyncOptions` | Interface de opções assíncronas |
| `DrizzleOptionsFactory` | Interface de fábrica para `useClass` / `useExisting` |
