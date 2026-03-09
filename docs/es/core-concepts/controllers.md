---
title: Controladores
icon: server
description: Define manejadores de rutas HTTP con decoradores
---

Los controladores gestionan las solicitudes HTTP entrantes y devuelven respuestas. Se decoran con `@Controller()` y usan decoradores de métodos HTTP para definir rutas.

## Definir un Controlador

```typescript
import { Controller, Get } from "nestelia";

@Controller("/cats")
class CatController {
  @Get("/")
  findAll() {
    return [{ name: "Tom" }, { name: "Garfield" }];
  }
}
```

El decorador `@Controller("/cats")` establece el prefijo de ruta. El decorador `@Get("/")` mapea `GET /cats/` a `findAll()`.

## Registrar Controladores

Los controladores deben declararse en un módulo:

```typescript
@Module({
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}
```

## Inyectar Servicios

Usa `@Inject()` en el constructor para acceder a los servicios del contenedor de DI:

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

## Métodos de Ruta

nestelia proporciona decoradores para todos los métodos HTTP estándar:

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

## Devolver Respuestas

Los métodos del controlador pueden retornar:

- **Objetos planos / arreglos** — serializados a JSON automáticamente
- **Cadenas de texto** — devueltas como texto plano
- **Promesas** — se resuelven y luego se serializan

```typescript
@Get("/")
async findAll() {
  const users = await this.userService.findAll();
  return users; // serializado a JSON
}
```

## Acceder a los Datos de la Solicitud

Usa `@Ctx()` para obtener el contexto completo de Elysia, que provee acceso a todos los datos de la solicitud:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;
  const q = ctx.query.q;
  return this.service.findById(id);
}
```

Para acceso tipado y validado al body, params y query, usa los decoradores basados en TypeBox:

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

Consulta [Decoradores de Parámetros](/es/features/parameter-decorators) para más detalles.

## Establecer Códigos de Estado

Usa `@HttpCode()` para establecer un código de estado personalizado para una ruta:

```typescript
@Post("/")
@HttpCode(201)
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

O usa el contexto de Elysia para códigos de estado dinámicos:

```typescript
@Post("/")
create(@Ctx() ctx: any, @Body(t.Object({ name: t.String() })) body: { name: string }) {
  ctx.set.status = 201;
  return this.userService.create(body);
}
```

## Establecer Cabeceras de Respuesta

Usa `@Header()` para agregar cabeceras de respuesta estáticas:

```typescript
@Get("/")
@Header("Cache-Control", "no-store")
findAll() {
  return this.service.findAll();
}
```
