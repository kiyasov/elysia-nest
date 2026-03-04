---
title: Controllers
icon: server
description: Define HTTP route handlers with decorators
---

Controllers handle incoming HTTP requests and return responses. They are decorated with `@Controller()` and use HTTP method decorators to define routes.

## Defining a Controller

```typescript
import { Controller, Get } from "@kiyasov/elysia-nest";

@Controller("/cats")
class CatController {
  @Get("/")
  findAll() {
    return [{ name: "Tom" }, { name: "Garfield" }];
  }
}
```

The `@Controller("/cats")` decorator sets the route prefix. The `@Get("/")` decorator maps `GET /cats/` to `findAll()`.

## Registering Controllers

Controllers must be declared in a module:

```typescript
@Module({
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}
```

## Injecting Services

Use `@Inject()` in the constructor to access services from the DI container:

```typescript
@Controller("/cats")
class CatController {
  constructor(@Inject(CatService) private readonly catService: CatService) {}

  @Get("/")
  findAll() {
    return this.catService.findAll();
  }
}
```

## Route Methods

@kiyasov/elysia-nest provides decorators for all standard HTTP methods:

```typescript
@Controller("/items")
class ItemController {
  @Get("/")       findAll() { /* ... */ }
  @Get("/:id")    findOne() { /* ... */ }
  @Post("/")      create()  { /* ... */ }
  @Put("/:id")    update()  { /* ... */ }
  @Patch("/:id")  patch()   { /* ... */ }
  @Delete("/:id") remove()  { /* ... */ }
  @Options("/")   options() { /* ... */ }
  @Head("/")      head()    { /* ... */ }
  @All("/wild")   any()     { /* ... */ }
}
```

## Returning Responses

Controller methods can return:

- **Plain objects / arrays** — serialized to JSON automatically
- **Strings** — returned as plain text
- **Promises** — awaited and then serialized

```typescript
@Get("/")
async findAll() {
  const users = await this.userService.findAll();
  return users; // serialized to JSON
}
```

## Accessing Request Data

Use `@Ctx()` to get the full Elysia context, which provides access to all request data:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;
  const q = ctx.query.q;
  return this.service.findById(id);
}
```

For typed, validated access to body, params, and query, use the TypeBox-based decorators:

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

See [Parameter Decorators](/features/parameter-decorators) for details.

## Setting Status Codes

Use `@HttpCode()` to set a custom status code for a route:

```typescript
@Post("/")
@HttpCode(201)
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

Or use the Elysia context for dynamic status codes:

```typescript
@Post("/")
create(@Ctx() ctx: any, @Body(t.Object({ name: t.String() })) body: { name: string }) {
  ctx.set.status = 201;
  return this.userService.create(body);
}
```

## Setting Response Headers

Use `@Header()` to add static response headers:

```typescript
@Get("/")
@Header("Cache-Control", "no-store")
findAll() {
  return this.service.findAll();
}
```
