---
title: Decoradores de Parámetros
icon: at-sign
description: Extrae datos de las solicitudes con decoradores
---

Los decoradores de parámetros te permiten extraer partes específicas de la solicitud entrante directamente en los argumentos del método manejador.

## Decoradores Disponibles

| Decorador | Extrae |
|-----------|--------|
| `@Body(schema)` | Cuerpo de la solicitud (JSON), validado contra un esquema TypeBox |
| `@Param(schema)` | Todos los parámetros de ruta URL, validados contra un esquema TypeBox |
| `@Query(schema)` | Todos los parámetros de cadena de consulta, validados contra un esquema TypeBox |
| `@Headers(name?)` | Cabecera(s) de la solicitud |
| `@Req()` / `@Request()` | Objeto `Request` nativo |
| `@Res()` / `@Response()` | Contexto de respuesta de Elysia (`set`) |
| `@Ctx()` / `@ElysiaContext()` | Contexto completo de Elysia |
| `@Ip()` | Dirección IP del cliente |
| `@Session()` | Objeto de sesión |

## Decoradores con Esquema TypeBox

`@Body`, `@Param` y `@Query` usan [TypeBox](https://github.com/sinclairzx81/typebox) para la definición y validación de esquemas. Importa `t` desde `elysia`:

```typescript
import { t } from "elysia";
import { Controller, Post, Get, Body, Param, Query } from "nestelia";

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

El esquema se pasa a la ruta de Elysia para la validación TypeBox. Si la validación falla, Elysia devuelve automáticamente una respuesta 422.

## @Body()

Extrae y valida el cuerpo JSON parseado de la solicitud:

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

Extrae todos los parámetros de ruta URL como un objeto:

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

Extrae todos los valores de la cadena de consulta como un objeto:

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

Accede a las cabeceras de la solicitud. Pasa un nombre para obtener una cabecera específica, u omítelo para obtener el objeto `Headers` completo:

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

Accede al contexto de solicitud completo de Elysia para control de bajo nivel. También es la forma más sencilla de acceder a params de ruta individuales o valores de query sin validación de esquema:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;       // param de ruta
  const q = ctx.query.search;     // cadena de consulta
  const body = ctx.body;          // cuerpo de la solicitud
  ctx.set.status = 200;           // establecer estado de respuesta
  ctx.set.headers["x-custom"] = "value"; // establecer cabecera de respuesta
  return this.service.findById(id);
}
```

## @Req() / @Request()

Accede al objeto `Request` nativo de la Web:

```typescript
@Get("/")
handle(@Req() request: Request) {
  const userAgent = request.headers.get("user-agent");
  return { userAgent };
}
```

## @Ip()

Obtiene la dirección IP del cliente:

```typescript
@Get("/")
handle(@Ip() ip: string) {
  return { ip };
}
```

## Decoradores de Parámetros Personalizados

Crea decoradores de parámetros reutilizables con `createParamDecorator`:

```typescript
import { createParamDecorator, ExecutionContext } from "nestelia";

const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<any>();
  return request.user;
});

@Get("/profile")
getProfile(@User() user: any) {
  return user;
}
```

## Usar @Schema() para Validación Completa de Ruta

El decorador `@Schema()` permite definir el esquema completo de la ruta de Elysia (body, params, query, headers, response) en un solo lugar:

```typescript
import { t } from "elysia";
import { Schema } from "nestelia";

@Post("/")
@Schema({
  body: t.Object({ name: t.String() }),
  response: t.Object({ id: t.Number(), name: t.String() }),
})
create(@Ctx() ctx: any) {
  return this.service.create(ctx.body);
}
```
