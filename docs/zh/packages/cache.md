---
title: 缓存管理器
icon: database
description: 使用装饰器实现 HTTP 响应缓存
---

缓存管理器包提供基于装饰器配置的自动 HTTP 响应缓存。

## 安装

```bash
bun add cache-manager
```

## 配置

```typescript
import { Module } from "nestelia";
import { CacheModule } from "nestelia/cache";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // 默认 TTL（毫秒），60 秒
    }),
  ],
})
class AppModule {}
```

### 异步配置

```typescript
import { CacheModule } from "nestelia/cache";

CacheModule.registerAsync({
  useFactory: async (config: ConfigService) => ({
    ttl: config.get("CACHE_TTL"),      // 毫秒
    store: config.get("CACHE_STORE"),  // "memory" 或 redis store
  }),
  inject: [ConfigService],
})
```

## 装饰器

### @CacheKey()

为路由设置自定义缓存键：

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

使用工厂函数的动态缓存键：

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

为特定路由覆盖默认 TTL。值以**毫秒**为单位：

```typescript
import { CacheTTL } from "nestelia/cache";

@Get("/stats")
@CacheTTL(300000) // 缓存 5 分钟（300,000 毫秒）
getStats() {
  return this.statsService.compute();
}
```

动态 TTL：

```typescript
@Get("/data")
@CacheTTL((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  // 认证用户缓存时间更短
  return ctx.user ? 30000 : 300000;
})
getData() {
  return this.dataService.fetch();
}
```

## CacheInterceptor

应用 `CacheInterceptor` 自动缓存响应：

```typescript
import { CacheInterceptor } from "nestelia/cache";

@Controller("/products")
@UseInterceptors(CacheInterceptor)
class ProductController {
  @Get("/")
  @CacheTTL(120000) // 2 分钟
  findAll() {
    return this.productService.findAll();
  }
}
```

## 注入缓存管理器

直接注入缓存实例以进行手动缓存操作：

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

## 缓存存储

- **内存** — 默认，无需额外依赖
- **Redis** — 用于跨多个实例的分布式缓存

```typescript
import { redisStore } from "cache-manager-redis-yet";

CacheModule.register({
  store: redisStore,
  host: "localhost",
  port: 6379,
  ttl: 60000,
})
```
