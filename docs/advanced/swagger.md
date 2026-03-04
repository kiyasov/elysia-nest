---
title: Swagger / OpenAPI
icon: file-code
description: TypeBox-driven schema documentation via Elysia
---

@kiyasov/elysia-nest uses [TypeBox](https://github.com/sinclairzx81/typebox) schemas — the same schemas Elysia uses natively — for request validation. Because Elysia already has first-class Swagger/OpenAPI support through the `@elysiajs/swagger` plugin, you can add full API documentation with minimal configuration.

## Setup

Install the Elysia Swagger plugin:

```bash
bun add @elysiajs/swagger
```

Register it as functional middleware in your root module:

```typescript
import { Module } from "@kiyasov/elysia-nest";
import swagger from "@elysiajs/swagger";

@Module({
  middlewares: [
    (app) => app.use(swagger()),
  ],
})
class AppModule {}
```

Swagger UI is then available at `/swagger`.

## Schema Decorators

Use `@Body`, `@Param`, and `@Query` with TypeBox schemas — these are automatically picked up by Elysia's schema system and appear in the generated OpenAPI spec:

```typescript
import { t } from "elysia";
import { Controller, Post, Get, Body, Param, Query } from "@kiyasov/elysia-nest";

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

## @Schema() Decorator

The `@Schema()` decorator lets you define the complete route schema including response types:

```typescript
import { t } from "elysia";
import { Schema } from "@kiyasov/elysia-nest";

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

## Customizing Swagger

Configure the Swagger plugin options for title, version, tags, and more:

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

See the [Elysia Swagger documentation](https://elysiajs.com/plugins/swagger.html) for the full list of options.
