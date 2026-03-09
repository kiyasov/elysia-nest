---
title: Swagger / OpenAPI
icon: file-code
description: Documentação de schema baseada em TypeBox via Elysia
---

O nestelia usa schemas [TypeBox](https://github.com/sinclairzx81/typebox) — os mesmos que o Elysia usa nativamente — para validação de requisições. Como o Elysia já possui suporte de primeira classe a Swagger/OpenAPI através do plugin `@elysiajs/swagger`, você pode adicionar documentação completa da API com configuração mínima.

## Configuração

Instale o plugin Swagger do Elysia:

```bash
bun add @elysiajs/swagger
```

Registre-o como middleware funcional no seu módulo raiz:

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

A interface Swagger UI ficará disponível em `/swagger`.

## Decoradores de Schema

Use `@Body`, `@Param` e `@Query` com schemas TypeBox — eles são automaticamente reconhecidos pelo sistema de schema do Elysia e aparecem na especificação OpenAPI gerada:

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

## Decorador @Schema()

O decorador `@Schema()` permite definir o schema completo da rota, incluindo tipos de resposta:

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

## Customizando o Swagger

Configure as opções do plugin Swagger para título, versão, tags e mais:

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

Consulte a [documentação do Elysia Swagger](https://elysiajs.com/plugins/swagger.html) para a lista completa de opções.
