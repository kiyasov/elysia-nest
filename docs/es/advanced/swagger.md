---
title: Swagger / OpenAPI
icon: file-code
description: Documentación de esquemas basada en TypeBox mediante Elysia
---

nestelia usa esquemas de [TypeBox](https://github.com/sinclairzx81/typebox) — los mismos que Elysia usa de forma nativa — para la validación de solicitudes. Dado que Elysia ya tiene soporte de primera clase para Swagger/OpenAPI mediante el plugin `@elysiajs/swagger`, puedes agregar documentación completa de la API con una configuración mínima.

## Configuración

Instala el plugin Swagger de Elysia:

```bash
bun add @elysiajs/swagger
```

Regístralo como middleware funcional en tu módulo raíz:

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

La interfaz Swagger UI estará disponible en `/swagger`.

## Decoradores de Esquema

Usa `@Body`, `@Param` y `@Query` con esquemas TypeBox — estos son captados automáticamente por el sistema de esquemas de Elysia y aparecen en la especificación OpenAPI generada:

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

El decorador `@Schema()` permite definir el esquema completo de la ruta incluyendo los tipos de respuesta:

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

## Personalizar Swagger

Configura las opciones del plugin Swagger para el título, versión, etiquetas y más:

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

Consulta la [documentación de Elysia Swagger](https://elysiajs.com/plugins/swagger.html) para la lista completa de opciones.
