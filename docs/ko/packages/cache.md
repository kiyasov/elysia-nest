---
title: 캐시 매니저
icon: database
description: 데코레이터를 이용한 HTTP 응답 캐싱
---

캐시 매니저 패키지는 데코레이터 기반 설정으로 자동 HTTP 응답 캐싱을 제공합니다.

## 설치

```bash
bun add cache-manager
```

## 설정

```typescript
import { Module } from "nestelia";
import { CacheModule } from "nestelia/cache";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // 기본 TTL (밀리초 단위, 60초)
    }),
  ],
})
class AppModule {}
```

### 비동기 설정

```typescript
import { CacheModule } from "nestelia/cache";

CacheModule.registerAsync({
  useFactory: async (config: ConfigService) => ({
    ttl: config.get("CACHE_TTL"),      // 밀리초 단위
    store: config.get("CACHE_STORE"),  // "memory" 또는 redis 스토어
  }),
  inject: [ConfigService],
})
```

## 데코레이터

### @CacheKey()

라우트에 커스텀 캐시 키를 설정합니다:

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

팩토리 함수를 사용한 동적 캐시 키:

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

특정 라우트의 기본 TTL을 재정의합니다. 값은 **밀리초** 단위입니다:

```typescript
import { CacheTTL } from "nestelia/cache";

@Get("/stats")
@CacheTTL(300000) // 5분 캐시 (300,000 ms)
getStats() {
  return this.statsService.compute();
}
```

동적 TTL:

```typescript
@Get("/data")
@CacheTTL((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  // 인증된 사용자는 더 짧은 캐시
  return ctx.user ? 30000 : 300000;
})
getData() {
  return this.dataService.fetch();
}
```

## CacheInterceptor

`CacheInterceptor`를 적용해 응답을 자동으로 캐시합니다:

```typescript
import { CacheInterceptor } from "nestelia/cache";

@Controller("/products")
@UseInterceptors(CacheInterceptor)
class ProductController {
  @Get("/")
  @CacheTTL(120000) // 2분
  findAll() {
    return this.productService.findAll();
  }
}
```

## 캐시 매니저 주입

수동 캐시 작업을 위해 캐시 인스턴스를 직접 주입합니다:

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
    await this.cache.set("all-users", users, 60000); // 60초
    return users;
  }
}
```

## 캐시 스토어

- **인메모리** — 기본값, 추가 의존성 없음
- **Redis** — 여러 인스턴스에 걸친 분산 캐싱

```typescript
import { redisStore } from "cache-manager-redis-yet";

CacheModule.register({
  store: redisStore,
  host: "localhost",
  port: 6379,
  ttl: 60000,
})
```
