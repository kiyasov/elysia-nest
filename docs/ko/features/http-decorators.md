---
title: HTTP 데코레이터
icon: globe
description: 컨트롤러 메서드를 HTTP 라우트에 매핑합니다
---

HTTP 데코레이터는 컨트롤러 메서드를 특정 HTTP 메서드와 경로에 바인딩합니다.

## 사용 가능한 데코레이터

| 데코레이터 | HTTP 메서드 |
|-----------|-------------|
| `@Get(path?)` | GET |
| `@Post(path?)` | POST |
| `@Put(path?)` | PUT |
| `@Patch(path?)` | PATCH |
| `@Delete(path?)` | DELETE |
| `@Options(path?)` | OPTIONS |
| `@Head(path?)` | HEAD |
| `@All(path?)` | 모든 메서드 |

## 사용법

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Put, Delete, Body, Ctx } from "nestelia";

@Controller("/posts")
class PostController {
  @Get("/")
  findAll() {
    return this.postService.findAll();
  }

  @Get("/:id")
  findOne(@Ctx() ctx: any) {
    return this.postService.findById(ctx.params.id);
  }

  @Post("/")
  create(@Body(t.Object({ title: t.String(), content: t.String() })) body: { title: string; content: string }) {
    return this.postService.create(body);
  }

  @Put("/:id")
  update(@Ctx() ctx: any, @Body(t.Object({ title: t.Optional(t.String()) })) body: { title?: string }) {
    return this.postService.update(ctx.params.id, body);
  }

  @Delete("/:id")
  remove(@Ctx() ctx: any) {
    return this.postService.remove(ctx.params.id);
  }
}
```

## 경로 파라미터

경로는 `:param` 구문을 사용한 Elysia의 라우트 파라미터를 지원합니다:

```typescript
@Get("/:category/:id")
findByCategory(@Ctx() ctx: any) {
  const { category, id } = ctx.params;
  return this.service.find(category, id);
}
```

검증된 파라미터를 위해 TypeBox 스키마와 함께 `@Param()` 데코레이터를 사용합니다:

```typescript
import { t } from "elysia";

@Get("/:id")
findOne(@Param(t.Object({ id: t.Numeric() })) params: { id: number }) {
  return this.service.findById(params.id);
}
```

## 와일드카드 라우트

`@All()`을 사용해 모든 HTTP 메서드를 매칭합니다:

```typescript
@All("/health")
health() {
  return { status: "ok" };
}
```

## 경로 인수 없음

경로가 제공되지 않으면 메서드는 컨트롤러의 접두사에 매칭됩니다:

```typescript
@Controller("/users")
class UserController {
  @Get()  // GET /users에 매칭
  findAll() { /* ... */ }
}
```

## 응답 상태 및 헤더

라우트 메서드에 `@HttpCode()`와 `@Header()` 데코레이터를 사용합니다:

```typescript
@Post("/")
@HttpCode(201)
@Header("Location", "/users/1")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

## 라우트 메타데이터

내부적으로 각 데코레이터는 `reflect-metadata`를 통해 메타데이터를 저장합니다:

- `ROUTE_METADATA` — HTTP 메서드와 경로
- `PARAMS_METADATA` — 파라미터 추출 지침
- `ROUTE_SCHEMA_METADATA` — TypeBox 검증 스키마

이 메타데이터는 부트스트랩 시 Elysia 인스턴스에 라우트를 등록하기 위해 읽힙니다.
