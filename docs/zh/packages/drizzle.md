---
title: Drizzle ORM
icon: database
description: 与依赖注入系统集成的类型安全 SQL ORM
---

Drizzle 模块将 [drizzle-orm](https://orm.drizzle.team) 与 nestelia 的依赖注入系统集成。它与方言无关——任何 drizzle 支持的数据库（PostgreSQL、MySQL、SQLite）均可开箱即用。

## 安装

```bash
bun add drizzle-orm
```

为您的数据库添加驱动程序：

```bash
# PostgreSQL
bun add postgres        # postgres.js（推荐）
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite（Bun 内置，无需额外安装）
# bun:sqlite 已内置于 Bun

# LibSQL / Turso
bun add @libsql/client
```

## 配置

创建 drizzle 实例并将其传入 `DrizzleModule.forRoot()`：

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

### PostgreSQL 示例

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### 异步配置

当连接字符串来自配置服务或环境变量时，使用 `forRootAsync`：

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

## 定义 Schema

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

## 注入数据库

### @InjectDrizzle()

使用 `@InjectDrizzle()` 装饰器作为 `@Inject(DRIZZLE_INSTANCE)` 的简写：

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

## 多个数据库

使用唯一 `tag` 注册每个数据库，并通过相同 tag 注入：

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

## 选项参考

### DrizzleModuleOptions

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `db` | `unknown` | — | 已配置的 drizzle-orm 数据库实例 **（必填）** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | 自定义注入令牌 |
| `isGlobal` | `boolean` | `false` | 注册为全局模块 |

## 导出

| 导出 | 描述 |
|------|------|
| `DrizzleModule` | 模块类 |
| `InjectDrizzle(tag?)` | 简写参数装饰器 |
| `DRIZZLE_INSTANCE` | 默认注入令牌 |
| `DrizzleModuleOptions` | 同步选项接口 |
| `DrizzleModuleAsyncOptions` | 异步选项接口 |
| `DrizzleOptionsFactory` | `useClass` / `useExisting` 的工厂接口 |
