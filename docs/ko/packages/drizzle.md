---
title: Drizzle ORM
icon: database
description: 의존성 주입과 통합된 타입 안전 SQL ORM
---

Drizzle 모듈은 [drizzle-orm](https://orm.drizzle.team)을 nestelia의 의존성 주입 시스템과 통합합니다. 다이얼렉트에 독립적이므로 drizzle이 지원하는 모든 데이터베이스(PostgreSQL, MySQL, SQLite)가 즉시 작동합니다.

## 설치

```bash
bun add drizzle-orm
```

사용할 데이터베이스 드라이버를 추가합니다:

```bash
# PostgreSQL
bun add postgres        # postgres.js (권장)
bun add pg              # node-postgres

# MySQL
bun add mysql2

# SQLite (Bun 내장, 추가 설치 불필요)
# bun:sqlite는 Bun에 내장되어 있습니다

# LibSQL / Turso
bun add @libsql/client
```

## 설정

drizzle 인스턴스를 생성하고 `DrizzleModule.forRoot()`에 전달합니다:

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

### PostgreSQL 예제

```typescript
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

DrizzleModule.forRoot({ db, isGlobal: true })
```

### 비동기 설정

연결 문자열이 설정 서비스나 환경 변수에서 오는 경우 `forRootAsync`를 사용합니다:

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

## 스키마 정의

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

## 데이터베이스 주입

### @InjectDrizzle()

`@InjectDrizzle()` 데코레이터를 `@Inject(DRIZZLE_INSTANCE)`의 단축키로 사용합니다:

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

## 여러 데이터베이스

각 데이터베이스를 고유한 `tag`로 등록하고 동일한 tag로 주입합니다:

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

## 옵션 참조

### DrizzleModuleOptions

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `db` | `unknown` | — | 설정된 drizzle-orm 인스턴스 **(필수)** |
| `tag` | `string \| symbol` | `DRIZZLE_INSTANCE` | 커스텀 주입 토큰 |
| `isGlobal` | `boolean` | `false` | 전역 모듈로 등록 |

## 내보내기

| 내보내기 | 설명 |
|---------|------|
| `DrizzleModule` | 모듈 클래스 |
| `InjectDrizzle(tag?)` | 간단한 파라미터 데코레이터 |
| `DRIZZLE_INSTANCE` | 기본 주입 토큰 |
| `DrizzleModuleOptions` | 동기 옵션 인터페이스 |
| `DrizzleModuleAsyncOptions` | 비동기 옵션 인터페이스 |
| `DrizzleOptionsFactory` | `useClass` / `useExisting`용 팩토리 인터페이스 |
