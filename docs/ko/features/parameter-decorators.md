---
title: 파라미터 데코레이터
icon: at-sign
description: 데코레이터로 요청에서 데이터를 추출합니다
---

파라미터 데코레이터를 사용하면 들어오는 요청의 특정 부분을 핸들러 메서드 인수로 직접 추출할 수 있습니다.

## 사용 가능한 데코레이터

| 데코레이터 | 추출 대상 |
|-----------|----------|
| `@Body(schema)` | 요청 본문 (JSON), TypeBox 스키마로 검증 |
| `@Param(schema)` | 모든 URL 경로 파라미터, TypeBox 스키마로 검증 |
| `@Query(schema)` | 모든 쿼리 스트링 파라미터, TypeBox 스키마로 검증 |
| `@Headers(name?)` | 요청 헤더 |
| `@Req()` / `@Request()` | 원시 `Request` 객체 |
| `@Res()` / `@Response()` | Elysia 응답 컨텍스트 (`set`) |
| `@Ctx()` / `@ElysiaContext()` | 전체 Elysia 컨텍스트 |
| `@Ip()` | 클라이언트 IP 주소 |
| `@Session()` | 세션 객체 |

## TypeBox 스키마 데코레이터

`@Body`, `@Param`, `@Query`는 스키마 정의 및 검증을 위해 [TypeBox](https://github.com/sinclairzx81/typebox)를 사용합니다. `elysia`에서 `t`를 임포트하세요:

```typescript
import { t } from "elysia";
import { Controller, Post, Get, Body, Param, Query } from "nestelia";

@Controller("/users")
class UserController {
  @Post("/")
  create(@Body(t.Object({ name: t.String(), age: t.Number() })) body: { name: string; age: number }) {
    return this.service.create(body);
  }

  @Get("/:id")
  findOne(@Param(t.Object({ id: t.String() })) params: { id: string }) {
    return this.service.findById(params.id);
  }

  @Get("/search")
  search(@Query(t.Object({ q: t.String(), page: t.Optional(t.Number()) })) query: { q: string; page?: number }) {
    return this.service.search(query.q, query.page);
  }
}
```

스키마는 TypeBox 검증을 위해 Elysia 라우트에 전달됩니다. 검증에 실패하면 Elysia가 자동으로 422 응답을 반환합니다.

## @Body()

파싱된 JSON 요청 본문을 추출하고 검증합니다:

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({
  name: t.String(),
  email: t.String({ format: "email" }),
})) body: { name: string; email: string }) {
  return this.userService.create(body);
}
```

## @Param()

모든 URL 경로 파라미터를 객체로 추출합니다:

```typescript
@Get("/:category/:id")
find(@Param(t.Object({
  category: t.String(),
  id: t.String(),
})) params: { category: string; id: string }) {
  return this.service.find(params.category, params.id);
}
```

## @Query()

모든 쿼리 스트링 값을 객체로 추출합니다:

```typescript
@Get("/search")
search(@Query(t.Object({
  q: t.String(),
  page: t.Optional(t.Number()),
})) query: { q: string; page?: number }) {
  // GET /search?q=hello&page=2
}
```

## @Headers()

요청 헤더에 접근합니다. 이름을 전달하면 특정 헤더를, 생략하면 전체 `Headers` 객체를 가져옵니다:

```typescript
@Get("/")
check(
  @Headers("authorization") auth: string,
  @Headers() allHeaders: Headers
) {
  // ...
}
```

## @Ctx() / @ElysiaContext()

저수준 제어를 위해 전체 Elysia 요청 컨텍스트에 접근합니다. 스키마 검증 없이 개별 경로 파라미터나 쿼리 값에 접근하는 가장 간단한 방법이기도 합니다:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;       // 경로 파라미터
  const q = ctx.query.search;     // 쿼리 스트링
  const body = ctx.body;          // 요청 본문
  ctx.set.status = 200;           // 응답 상태 설정
  ctx.set.headers["x-custom"] = "value"; // 응답 헤더 설정
  return this.service.findById(id);
}
```

## @Req() / @Request()

원시 Web `Request` 객체에 접근합니다:

```typescript
@Get("/")
handle(@Req() request: Request) {
  const userAgent = request.headers.get("user-agent");
  return { userAgent };
}
```

## @Ip()

클라이언트 IP 주소를 가져옵니다:

```typescript
@Get("/")
handle(@Ip() ip: string) {
  return { ip };
}
```

## 커스텀 파라미터 데코레이터

`createParamDecorator`로 재사용 가능한 파라미터 데코레이터를 만듭니다:

```typescript
import { createParamDecorator, ExecutionContext } from "nestelia";

const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<any>();
  return request.user;
});

@Get("/profile")
getProfile(@User() user: any) {
  return user;
}
```

## 전체 라우트 검증을 위한 @Schema() 사용

`@Schema()` 데코레이터를 사용하면 완전한 Elysia 라우트 스키마(body, params, query, headers, response)를 한 곳에서 정의할 수 있습니다:

```typescript
import { t } from "elysia";
import { Schema } from "nestelia";

@Post("/")
@Schema({
  body: t.Object({ name: t.String() }),
  response: t.Object({ id: t.Number(), name: t.String() }),
})
create(@Ctx() ctx: any) {
  return this.service.create(ctx.body);
}
```
