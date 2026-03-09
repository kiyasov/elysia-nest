---
title: キャッシュマネージャー
icon: database
description: デコレータによる HTTP レスポンスキャッシュ
---

キャッシュマネージャーパッケージは、デコレータベースの設定による自動 HTTP レスポンスキャッシュを提供します。

## インストール

```bash
bun add cache-manager
```

## セットアップ

```typescript
import { Module } from "nestelia";
import { CacheModule } from "nestelia/cache";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // デフォルト TTL（ミリ秒）（60 秒）
    }),
  ],
})
class AppModule {}
```

### 非同期設定

```typescript
import { CacheModule } from "nestelia/cache";

CacheModule.registerAsync({
  useFactory: async (config: ConfigService) => ({
    ttl: config.get("CACHE_TTL"),      // ミリ秒
    store: config.get("CACHE_STORE"),  // "memory" または Redis ストア
  }),
  inject: [ConfigService],
})
```

## デコレータ

### @CacheKey()

ルートにカスタムキャッシュキーを設定します:

```typescript
import { CacheKey } from "nestelia/cache";

@Controller("/users")
class UserController {
  @Get("/")
  @CacheKey("all-users")
  findAll() {
    return this.userService.findAll();
  }
}
```

ファクトリー関数を使った動的キャッシュキー:

```typescript
import { CacheKey } from "nestelia/cache";

@Get("/:id")
@CacheKey((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  return `user-${ctx.params.id}`;
})
findOne(@Ctx() ctx: any) {
  return this.userService.findById(ctx.params.id);
}
```

### @CacheTTL()

特定のルートのデフォルト TTL をオーバーライドします。値は**ミリ秒**単位です:

```typescript
import { CacheTTL } from "nestelia/cache";

@Get("/stats")
@CacheTTL(300000) // 5 分間キャッシュ (300,000 ms)
getStats() {
  return this.statsService.compute();
}
```

動的 TTL:

```typescript
@Get("/data")
@CacheTTL((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  // 認証済みユーザーには短いキャッシュ
  return ctx.user ? 30000 : 300000;
})
getData() {
  return this.dataService.fetch();
}
```

## CacheInterceptor

`CacheInterceptor` を適用してレスポンスを自動的にキャッシュします:

```typescript
import { CacheInterceptor } from "nestelia/cache";

@Controller("/products")
@UseInterceptors(CacheInterceptor)
class ProductController {
  @Get("/")
  @CacheTTL(120000) // 2 分
  findAll() {
    return this.productService.findAll();
  }
}
```

## キャッシュマネージャーのインジェクト

手動キャッシュ操作のためにキャッシュインスタンスを直接インジェクトします:

```typescript
import { Injectable, Inject } from "nestelia";
import { CACHE_MANAGER, Cache } from "nestelia/cache";

@Injectable()
class UserService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async findAll() {
    const cached = await this.cache.get("all-users");
    if (cached) return cached;

    const users = await this.db.users.findMany();
    await this.cache.set("all-users", users, 60000); // 60 秒
    return users;
  }
}
```

## キャッシュストア

- **インメモリ** — デフォルト、追加の依存関係なし
- **Redis** — 複数インスタンスにまたがる分散キャッシュ

```typescript
import { redisStore } from "cache-manager-redis-yet";

CacheModule.register({
  store: redisStore,
  host: "localhost",
  port: 6379,
  ttl: 60000,
})
```
