---
title: Drizzle ORM
icon: database
description: Типобезопасная интеграция SQL ORM с системой внедрения зависимостей
---

Модуль Drizzle интегрирует [drizzle-orm](https://orm.drizzle.team) с системой внедрения зависимостей nestelia. Модуль не зависит от диалекта — работает с любой базой данных, поддерживаемой drizzle (PostgreSQL, MySQL, SQLite).

## Установка

```bash
bun add drizzle-orm
```

Добавьте драйвер для вашей базы данных:

```bash
# PostgreSQL
bun add postgres        # postgres.js (рекомендуется)
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite (не требует доп. установки в Bun)
# bun:sqlite встроен в Bun

# LibSQL / Turso
bun add @libsql/client
```

## Настройка

Создайте экземпляр drizzle и передайте его в `DrizzleModule.forRoot()`:

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

### Пример с PostgreSQL

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### Асинхронная конфигурация

Используйте `forRootAsync`, если строка подключения берётся из сервиса конфигурации или окружения:

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

## Определение схемы

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

## Инжектирование базы данных

### @InjectDrizzle()

Используйте декоратор `@InjectDrizzle()` как сокращение для `@Inject(DRIZZLE_INSTANCE)`:

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

### Использование токена напрямую

```typescript
import { Injectable, Inject } from "nestelia";
import { DRIZZLE_INSTANCE } from "nestelia/drizzle";

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_INSTANCE) private readonly db: DB) {}
}
```

## Несколько баз данных

Зарегистрируйте каждую БД с уникальным `tag` и инжектируйте по тому же тегу:

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

## Справочник опций

### DrizzleModuleOptions

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `db` | `unknown` | — | Настроенный экземпляр drizzle-orm **(обязательно)** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | Пользовательский токен инжекции |
| `isGlobal` | `boolean` | `false` | Зарегистрировать как глобальный модуль |

### DrizzleModuleAsyncOptions

| Свойство | Тип | Описание |
|----------|-----|----------|
| `tag` | `string \| symbol` | Пользовательский токен инжекции |
| `isGlobal` | `boolean` | Зарегистрировать как глобальный модуль |
| `imports` | `any[]` | Модули для импорта в область видимости |
| `useFactory` | `(...args) => DrizzleModuleOptions` | Фабричная функция |
| `inject` | `any[]` | Зависимости для фабрики |
| `useClass` | `Type<DrizzleOptionsFactory>` | Класс, реализующий `DrizzleOptionsFactory` |
| `useExisting` | `Type<DrizzleOptionsFactory>` | Существующий провайдер |
| `extraProviders` | `Provider[]` | Дополнительные провайдеры в области модуля |

## Экспорты

| Экспорт | Описание |
|---------|----------|
| `DrizzleModule` | Класс модуля |
| `InjectDrizzle(tag?)` | Сокращённый декоратор параметра |
| `DRIZZLE_INSTANCE` | Токен инжекции по умолчанию |
| `DRIZZLE_MODULE_OPTIONS` | Токен для сырых опций |
| `DrizzleModuleOptions` | Интерфейс синхронных опций |
| `DrizzleModuleAsyncOptions` | Интерфейс асинхронных опций |
| `DrizzleOptionsFactory` | Фабричный интерфейс для `useClass` / `useExisting` |
