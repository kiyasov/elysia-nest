---
title: Cache Manager
icon: database
description: HTTP response caching with decorators
---

The cache manager package provides automatic HTTP response caching with decorator-based configuration.

## Installation

```bash
bun add cache-manager
```

## Setup

```typescript
import { Module } from "@kiyasov/elysia-nest";
import { CacheModule } from "@kiyasov/elysia-nest/cache";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // default TTL in milliseconds (60 seconds)
    }),
  ],
})
class AppModule {}
```

### Async Configuration

```typescript
import { CacheModule } from "@kiyasov/elysia-nest/cache";

CacheModule.registerAsync({
  useFactory: async (config: ConfigService) => ({
    ttl: config.get("CACHE_TTL"),      // in milliseconds
    store: config.get("CACHE_STORE"),  // "memory" or a redis store
  }),
  inject: [ConfigService],
})
```

## Decorators

### @CacheKey()

Set a custom cache key for a route:

```typescript
import { CacheKey } from "@kiyasov/elysia-nest/cache";

@Controller("/users")
class UserController {
  @Get("/")
  @CacheKey("all-users")
  findAll() {
    return this.userService.findAll();
  }
}
```

Dynamic cache keys using a factory function:

```typescript
import { CacheKey } from "@kiyasov/elysia-nest/cache";

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

Override the default TTL for a specific route. The value is in **milliseconds**:

```typescript
import { CacheTTL } from "@kiyasov/elysia-nest/cache";

@Get("/stats")
@CacheTTL(300000) // cache for 5 minutes (300,000 ms)
getStats() {
  return this.statsService.compute();
}
```

Dynamic TTL:

```typescript
@Get("/data")
@CacheTTL((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  // shorter cache for authenticated users
  return ctx.user ? 30000 : 300000;
})
getData() {
  return this.dataService.fetch();
}
```

## CacheInterceptor

Apply the `CacheInterceptor` to automatically cache responses:

```typescript
import { CacheInterceptor } from "@kiyasov/elysia-nest/cache";

@Controller("/products")
@UseInterceptors(CacheInterceptor)
class ProductController {
  @Get("/")
  @CacheTTL(120000) // 2 minutes
  findAll() {
    return this.productService.findAll();
  }
}
```

## Injecting the Cache Manager

Inject the cache instance directly for manual cache operations:

```typescript
import { Injectable, Inject } from "@kiyasov/elysia-nest";
import { CACHE_MANAGER, Cache } from "@kiyasov/elysia-nest/cache";

@Injectable()
class UserService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async findAll() {
    const cached = await this.cache.get("all-users");
    if (cached) return cached;

    const users = await this.db.users.findMany();
    await this.cache.set("all-users", users, 60000); // 60 seconds
    return users;
  }
}
```

## Cache Stores

- **In-memory** — default, no additional dependencies
- **Redis** — for distributed caching across multiple instances

```typescript
import { redisStore } from "cache-manager-redis-yet";

CacheModule.register({
  store: redisStore,
  host: "localhost",
  port: 6379,
  ttl: 60000,
})
```
