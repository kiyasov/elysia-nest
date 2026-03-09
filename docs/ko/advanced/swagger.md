---
title: Swagger / OpenAPI
icon: file-code
description: Elysia를 통한 TypeBox 기반 스키마 문서화
---

nestelia는 [TypeBox](https://github.com/sinclairzx81/typebox) 스키마를 사용합니다 — Elysia가 네이티브로 사용하는 것과 동일한 스키마입니다 — 요청 검증에 사용합니다. Elysia는 `@elysiajs/swagger` 플러그인을 통해 이미 Swagger/OpenAPI를 최우선으로 지원하므로 최소한의 설정으로 완전한 API 문서를 추가할 수 있습니다.

## 설정

Elysia Swagger 플러그인을 설치합니다:

```bash
bun add @elysiajs/swagger
```

루트 모듈에 함수형 미들웨어로 등록합니다:

```typescript
import { Module } from "nestelia";
import swagger from "@elysiajs/swagger";

@Module({
  middlewares: [
    (app) => app.use(swagger()),
  ],
})
class AppModule {}
```

Swagger UI는 `/swagger`에서 사용할 수 있습니다.

## 스키마 데코레이터

TypeBox 스키마와 함께 `@Body`, `@Param`, `@Query`를 사용하세요 — 이는 Elysia의 스키마 시스템에 자동으로 반영되어 생성된 OpenAPI 스펙에 나타납니다:

```typescript
import { t } from "elysia";
import { Controller, Post, Get, Body, Param, Query } from "nestelia";

@Controller("/users")
class UserController {
  @Post("/")
  create(@Body(t.Object({
    name: t.String({ description: "User display name" }),
    email: t.String({ format: "email" }),
  })) body: { name: string; email: string }) {
    return this.userService.create(body);
  }

  @Get("/:id")
  findOne(@Param(t.Object({ id: t.String() })) params: { id: string }) {
    return this.userService.findById(params.id);
  }
}
```

## @Schema() 데코레이터

`@Schema()` 데코레이터를 사용하면 응답 타입을 포함한 완전한 라우트 스키마를 정의할 수 있습니다:

```typescript
import { t } from "elysia";
import { Schema } from "nestelia";

@Get("/users")
@Schema({
  query: t.Object({ page: t.Optional(t.Number()) }),
  response: {
    200: t.Array(t.Object({ id: t.String(), name: t.String() })),
  },
})
findAll(@Ctx() ctx: any) {
  return this.userService.findAll(ctx.query.page);
}
```

## Swagger 커스터마이징

제목, 버전, 태그 등에 대한 Swagger 플러그인 옵션을 설정합니다:

```typescript
import swagger from "@elysiajs/swagger";

@Module({
  middlewares: [
    (app) => app.use(swagger({
      documentation: {
        info: {
          title: "My API",
          version: "1.0.0",
          description: "API documentation",
        },
        tags: [
          { name: "users", description: "User operations" },
        ],
      },
    })),
  ],
})
class AppModule {}
```

전체 옵션 목록은 [Elysia Swagger 문서](https://elysiajs.com/plugins/swagger.html)를 참조하세요.
