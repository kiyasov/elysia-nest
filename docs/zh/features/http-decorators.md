---
title: HTTP 装饰器
icon: globe
description: 将控制器方法映射到 HTTP 路由
---

HTTP 装饰器将控制器方法绑定到特定的 HTTP 方法和路径。

## 可用装饰器

| 装饰器 | HTTP 方法 |
|--------|-----------|
| `@Get(path?)` | GET |
| `@Post(path?)` | POST |
| `@Put(path?)` | PUT |
| `@Patch(path?)` | PATCH |
| `@Delete(path?)` | DELETE |
| `@Options(path?)` | OPTIONS |
| `@Head(path?)` | HEAD |
| `@All(path?)` | 所有方法 |

## 用法

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

## 路径参数

路径使用 Elysia 的 `:param` 语法支持路由参数：

```typescript
@Get("/:category/:id")
findByCategory(@Ctx() ctx: any) {
  const { category, id } = ctx.params;
  return this.service.find(category, id);
}
```

要验证参数，使用带有 TypeBox Schema 的 `@Param()` 装饰器：

```typescript
import { t } from "elysia";

@Get("/:id")
findOne(@Param(t.Object({ id: t.Numeric() })) params: { id: number }) {
  return this.service.findById(params.id);
}
```

## 通配符路由

使用 `@All()` 匹配任意 HTTP 方法：

```typescript
@All("/health")
health() {
  return { status: "ok" };
}
```

## 不带路径参数

不提供路径时，该方法匹配控制器的前缀：

```typescript
@Controller("/users")
class UserController {
  @Get()  // 匹配 GET /users
  findAll() { /* ... */ }
}
```

## 响应状态码和响应头

在路由方法上使用 `@HttpCode()` 和 `@Header()` 装饰器：

```typescript
@Post("/")
@HttpCode(201)
@Header("Location", "/users/1")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

## 路由元数据

在底层，每个装饰器通过 `reflect-metadata` 存储元数据：

- `ROUTE_METADATA` — HTTP 方法和路径
- `PARAMS_METADATA` — 参数提取指令
- `ROUTE_SCHEMA_METADATA` — TypeBox 验证 Schema

这些元数据在启动时被读取，用于在 Elysia 实例上注册路由。
