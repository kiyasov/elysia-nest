---
title: Drizzle ORM
icon: database
description: 依存性注入と統合されたタイプセーフな SQL ORM
---

Drizzle モジュールは [drizzle-orm](https://orm.drizzle.team) を nestelia の依存性注入システムと統合します。ダイアレクトに依存しないため、drizzle がサポートするすべてのデータベース（PostgreSQL、MySQL、SQLite）がそのまま動作します。

## インストール

```bash
bun add drizzle-orm
```

使用するデータベースのドライバを追加します：

```bash
# PostgreSQL
bun add postgres        # postgres.js（推奨）
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite（Bun に組み込み済み、追加インストール不要）
# bun:sqlite は Bun に組み込まれています

# LibSQL / Turso
bun add @libsql/client
```

## セットアップ

drizzle インスタンスを作成し、`DrizzleModule.forRoot()` に渡します：

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

### PostgreSQL の例

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### 非同期設定

接続文字列が設定サービスや環境変数から取得される場合は `forRootAsync` を使用します：

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

## スキーマの定義

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

## データベースのインジェクション

### @InjectDrizzle()

`@InjectDrizzle()` デコレーターを `@Inject(DRIZZLE_INSTANCE)` の省略形として使用します：

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

## 複数のデータベース

各データベースを一意の `tag` で登録し、同じ tag でインジェクトします：

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

## オプションリファレンス

### DrizzleModuleOptions

| プロパティ | 型 | デフォルト | 説明 |
|-----------|----|-----------|----|
| `db` | `unknown` | — | 設定済みの drizzle-orm インスタンス **（必須）** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | カスタムインジェクショントークン |
| `isGlobal` | `boolean` | `false` | グローバルモジュールとして登録 |

## エクスポート

| エクスポート | 説明 |
|------------|------|
| `DrizzleModule` | モジュールクラス |
| `InjectDrizzle(tag?)` | 省略形パラメーターデコレーター |
| `DRIZZLE_INSTANCE` | デフォルトインジェクショントークン |
| `DrizzleModuleOptions` | 同期オプションインターフェース |
| `DrizzleModuleAsyncOptions` | 非同期オプションインターフェース |
| `DrizzleOptionsFactory` | `useClass` / `useExisting` 用ファクトリーインターフェース |
