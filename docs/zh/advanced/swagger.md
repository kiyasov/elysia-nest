---
title: Swagger / OpenAPI
icon: file-code
description: 通过 Elysia 实现基于 TypeBox 的 Schema 文档
---

nestelia 使用 [TypeBox](https://github.com/sinclairzx81/typebox) Schema——与 Elysia 原生使用的 Schema 相同——进行请求验证。由于 Elysia 已经通过 `@elysiajs/swagger` 插件提供了一流的 Swagger/OpenAPI 支持，只需最少的配置即可添加完整的 API 文档。

## 配置

安装 Elysia Swagger 插件：

```bash
bun add @elysiajs/swagger
```

在根模块中将其注册为函数式中间件：

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

Swagger UI 随后可在 `/swagger` 访问。

## Schema 装饰器

使用带有 TypeBox Schema 的 `@Body`、`@Param` 和 `@Query`——这些会被 Elysia 的 Schema 系统自动读取，并出现在生成的 OpenAPI 规范中：

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

## @Schema() 装饰器

`@Schema()` 装饰器让你定义包含响应类型的完整路由 Schema：

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

## 自定义 Swagger

配置 Swagger 插件选项以设置标题、版本、标签等：

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

完整选项列表请参阅 [Elysia Swagger 文档](https://elysiajs.com/plugins/swagger.html)。
