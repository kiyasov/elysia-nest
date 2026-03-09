---
title: 参数装饰器
icon: at-sign
description: 使用装饰器从请求中提取数据
---

参数装饰器允许你将传入请求的特定部分直接提取到处理方法的参数中。

## 可用装饰器

| 装饰器 | 提取内容 |
|--------|----------|
| `@Body(schema)` | 请求体（JSON），根据 TypeBox Schema 验证 |
| `@Param(schema)` | 所有 URL 路径参数，根据 TypeBox Schema 验证 |
| `@Query(schema)` | 所有查询字符串参数，根据 TypeBox Schema 验证 |
| `@Headers(name?)` | 请求头 |
| `@Req()` / `@Request()` | 原始 `Request` 对象 |
| `@Res()` / `@Response()` | Elysia 响应上下文（`set`） |
| `@Ctx()` / `@ElysiaContext()` | 完整的 Elysia 上下文 |
| `@Ip()` | 客户端 IP 地址 |
| `@Session()` | Session 对象 |

## TypeBox Schema 装饰器

`@Body`、`@Param` 和 `@Query` 使用 [TypeBox](https://github.com/sinclairzx81/typebox) 进行 Schema 定义和验证。从 `elysia` 导入 `t`：

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

Schema 传递给 Elysia 路由进行 TypeBox 验证。如果验证失败，Elysia 会自动返回 422 响应。

## @Body()

提取并验证解析后的 JSON 请求体：

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

将所有 URL 路径参数提取为一个对象：

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

将所有查询字符串值提取为一个对象：

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

访问请求头。传递名称获取特定请求头，或省略以获取完整的 `Headers` 对象：

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

访问完整的 Elysia 请求上下文以进行底层控制。这也是无需 Schema 验证即可访问单个路径参数或查询值的最简单方式：

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;       // 路径参数
  const q = ctx.query.search;     // 查询字符串
  const body = ctx.body;          // 请求体
  ctx.set.status = 200;           // 设置响应状态码
  ctx.set.headers["x-custom"] = "value"; // 设置响应头
  return this.service.findById(id);
}
```

## @Req() / @Request()

访问原始 Web `Request` 对象：

```typescript
@Get("/")
handle(@Req() request: Request) {
  const userAgent = request.headers.get("user-agent");
  return { userAgent };
}
```

## @Ip()

获取客户端 IP 地址：

```typescript
@Get("/")
handle(@Ip() ip: string) {
  return { ip };
}
```

## 自定义参数装饰器

使用 `createParamDecorator` 创建可复用的参数装饰器：

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

## 使用 @Schema() 进行完整路由验证

`@Schema()` 装饰器让你在一处定义完整的 Elysia 路由 Schema（请求体、路径参数、查询参数、请求头、响应）：

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
