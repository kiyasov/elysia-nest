---
title: Parameter Decorators
icon: at-sign
description: Extract data from requests with decorators
---

Parameter decorators allow you to extract specific parts of the incoming request directly into your handler method arguments.

## Available Decorators

| Decorator | Extracts |
|-----------|----------|
| `@Body(schema)` | Request body (JSON), validated against TypeBox schema |
| `@Param(schema)` | All URL path parameters, validated against TypeBox schema |
| `@Query(schema)` | All query string parameters, validated against TypeBox schema |
| `@Headers(name?)` | Request header(s) |
| `@Req()` / `@Request()` | Raw `Request` object |
| `@Res()` / `@Response()` | Elysia response context (`set`) |
| `@Ctx()` / `@ElysiaContext()` | Full Elysia context |
| `@Ip()` | Client IP address |
| `@Session()` | Session object |

## TypeBox Schema Decorators

`@Body`, `@Param`, and `@Query` use [TypeBox](https://github.com/sinclairzx81/typebox) for schema definition and validation. Import `t` from `elysia`:

```typescript
import { t } from "elysia";
import { Controller, Post, Get, Body, Param, Query } from "@kiyasov/elysia-nest";

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

The schema is passed to Elysia's route for TypeBox validation. If validation fails, Elysia returns a 422 response automatically.

## @Body()

Extracts and validates the parsed JSON request body:

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

Extracts all URL path parameters as an object:

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

Extracts all query string values as an object:

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

Access request headers. Pass a name to get a specific header, or omit it to get the full `Headers` object:

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

Access the full Elysia request context for low-level control. This is also the simplest way to access individual path params or query values without schema validation:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;       // path param
  const q = ctx.query.search;     // query string
  const body = ctx.body;          // request body
  ctx.set.status = 200;           // set response status
  ctx.set.headers["x-custom"] = "value"; // set response header
  return this.service.findById(id);
}
```

## @Req() / @Request()

Access the raw Web `Request` object:

```typescript
@Get("/")
handle(@Req() request: Request) {
  const userAgent = request.headers.get("user-agent");
  return { userAgent };
}
```

## @Ip()

Get the client's IP address:

```typescript
@Get("/")
handle(@Ip() ip: string) {
  return { ip };
}
```

## Custom Param Decorators

Create reusable param decorators with `createParamDecorator`:

```typescript
import { createParamDecorator, ExecutionContext } from "@kiyasov/elysia-nest";

const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<any>();
  return request.user;
});

@Get("/profile")
getProfile(@User() user: any) {
  return user;
}
```

## Using @Schema() for Full Route Validation

The `@Schema()` decorator lets you define the complete Elysia route schema (body, params, query, headers, response) in one place:

```typescript
import { t } from "elysia";
import { Schema } from "@kiyasov/elysia-nest";

@Post("/")
@Schema({
  body: t.Object({ name: t.String() }),
  response: t.Object({ id: t.Number(), name: t.String() }),
})
create(@Ctx() ctx: any) {
  return this.service.create(ctx.body);
}
```
