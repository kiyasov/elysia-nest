---
title: Decoradores HTTP
icon: globe
description: Mapea métodos del controlador a rutas HTTP
---

Los decoradores HTTP vinculan los métodos del controlador a métodos HTTP y rutas específicas.

## Decoradores Disponibles

| Decorador | Método HTTP |
|-----------|-------------|
| `@Get(path?)` | GET |
| `@Post(path?)` | POST |
| `@Put(path?)` | PUT |
| `@Patch(path?)` | PATCH |
| `@Delete(path?)` | DELETE |
| `@Options(path?)` | OPTIONS |
| `@Head(path?)` | HEAD |
| `@All(path?)` | Todos los métodos |

## Uso

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

## Parámetros de Ruta

Las rutas soportan parámetros de ruta de Elysia usando la sintaxis `:param`:

```typescript
@Get("/:category/:id")
findByCategory(@Ctx() ctx: any) {
  const { category, id } = ctx.params;
  return this.service.find(category, id);
}
```

Para params validados, usa el decorador `@Param()` con un esquema TypeBox:

```typescript
import { t } from "elysia";

@Get("/:id")
findOne(@Param(t.Object({ id: t.Numeric() })) params: { id: number }) {
  return this.service.findById(params.id);
}
```

## Rutas Comodín

Usa `@All()` para capturar cualquier método HTTP:

```typescript
@All("/health")
health() {
  return { status: "ok" };
}
```

## Sin Argumento de Ruta

Cuando no se proporciona una ruta, el método coincide con el prefijo del controlador:

```typescript
@Controller("/users")
class UserController {
  @Get()  // coincide con GET /users
  findAll() { /* ... */ }
}
```

## Estado y Cabeceras de Respuesta

Usa los decoradores `@HttpCode()` y `@Header()` en los métodos de ruta:

```typescript
@Post("/")
@HttpCode(201)
@Header("Location", "/users/1")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

## Metadatos de Ruta

Internamente, cada decorador almacena metadatos mediante `reflect-metadata`:

- `ROUTE_METADATA` — el método HTTP y la ruta
- `PARAMS_METADATA` — instrucciones de extracción de parámetros
- `ROUTE_SCHEMA_METADATA` — esquemas de validación TypeBox

Estos metadatos se leen en el momento del bootstrap para registrar las rutas en la instancia de Elysia.
