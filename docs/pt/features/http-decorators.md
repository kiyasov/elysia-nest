---
title: Decoradores HTTP
icon: globe
description: Mapeie métodos de controller para rotas HTTP
---

Decoradores HTTP vinculam métodos de controller a métodos HTTP e caminhos específicos.

## Decoradores Disponíveis

| Decorador | Método HTTP |
|-----------|-------------|
| `@Get(path?)` | GET |
| `@Post(path?)` | POST |
| `@Put(path?)` | PUT |
| `@Patch(path?)` | PATCH |
| `@Delete(path?)` | DELETE |
| `@Options(path?)` | OPTIONS |
| `@Head(path?)` | HEAD |
| `@All(path?)` | Todos os métodos |

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

## Parâmetros de Rota

Os caminhos suportam parâmetros de rota do Elysia com a sintaxe `:param`:

```typescript
@Get("/:category/:id")
findByCategory(@Ctx() ctx: any) {
  const { category, id } = ctx.params;
  return this.service.find(category, id);
}
```

Para params validados, use o decorador `@Param()` com um schema TypeBox:

```typescript
import { t } from "elysia";

@Get("/:id")
findOne(@Param(t.Object({ id: t.Numeric() })) params: { id: number }) {
  return this.service.findById(params.id);
}
```

## Rotas Wildcard

Use `@All()` para corresponder a qualquer método HTTP:

```typescript
@All("/health")
health() {
  return { status: "ok" };
}
```

## Sem Argumento de Caminho

Quando nenhum caminho é fornecido, o método corresponde ao prefixo do controller:

```typescript
@Controller("/users")
class UserController {
  @Get()  // corresponde a GET /users
  findAll() { /* ... */ }
}
```

## Status e Headers de Resposta

Use os decoradores `@HttpCode()` e `@Header()` nos métodos de rota:

```typescript
@Post("/")
@HttpCode(201)
@Header("Location", "/users/1")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

## Metadados de Rota

Por baixo dos panos, cada decorador armazena metadados via `reflect-metadata`:

- `ROUTE_METADATA` — o método HTTP e o caminho
- `PARAMS_METADATA` — instruções de extração de parâmetros
- `ROUTE_SCHEMA_METADATA` — schemas de validação TypeBox

Esses metadados são lidos no momento do bootstrap para registrar as rotas na instância do Elysia.
