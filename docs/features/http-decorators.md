---
title: HTTP Decorators
icon: globe
description: Map controller methods to HTTP routes
---

HTTP decorators bind controller methods to specific HTTP methods and paths.

## Available Decorators

| Decorator | HTTP Method |
|-----------|-------------|
| `@Get(path?)` | GET |
| `@Post(path?)` | POST |
| `@Put(path?)` | PUT |
| `@Patch(path?)` | PATCH |
| `@Delete(path?)` | DELETE |
| `@Options(path?)` | OPTIONS |
| `@Head(path?)` | HEAD |
| `@All(path?)` | All methods |

## Usage

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Put, Delete, Body, Ctx } from "@kiyasov/elysia-nest";

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

## Path Parameters

Paths support Elysia's route parameters using `:param` syntax:

```typescript
@Get("/:category/:id")
findByCategory(@Ctx() ctx: any) {
  const { category, id } = ctx.params;
  return this.service.find(category, id);
}
```

For validated params, use the `@Param()` decorator with a TypeBox schema:

```typescript
import { t } from "elysia";

@Get("/:id")
findOne(@Param(t.Object({ id: t.Numeric() })) params: { id: number }) {
  return this.service.findById(params.id);
}
```

## Wildcard Routes

Use `@All()` to match any HTTP method:

```typescript
@All("/health")
health() {
  return { status: "ok" };
}
```

## No Path Argument

When no path is provided, the method matches the controller's prefix:

```typescript
@Controller("/users")
class UserController {
  @Get()  // matches GET /users
  findAll() { /* ... */ }
}
```

## Response Status and Headers

Use `@HttpCode()` and `@Header()` decorators on route methods:

```typescript
@Post("/")
@HttpCode(201)
@Header("Location", "/users/1")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

## Route Metadata

Under the hood, each decorator stores metadata via `reflect-metadata`:

- `ROUTE_METADATA` — the HTTP method and path
- `PARAMS_METADATA` — parameter extraction instructions
- `ROUTE_SCHEMA_METADATA` — TypeBox validation schemas

This metadata is read at bootstrap time to register routes on the Elysia instance.
