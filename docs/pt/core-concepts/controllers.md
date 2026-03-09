---
title: Controllers
icon: server
description: Defina handlers de rotas HTTP com decoradores
---

Controllers processam requisições HTTP recebidas e retornam respostas. Eles são decorados com `@Controller()` e usam decoradores de métodos HTTP para definir rotas.

## Definindo um Controller

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

O decorador `@Controller("/cats")` define o prefixo de rota. O decorador `@Get("/")` mapeia `GET /cats/` para `findAll()`.

## Registrando Controllers

Controllers devem ser declarados em um módulo:

```typescript
@Module({
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}
```

## Injetando Services

Use `@Inject()` no construtor para acessar services do container de DI:

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

## Métodos de Rota

O nestelia fornece decoradores para todos os métodos HTTP padrão:

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

## Retornando Respostas

Métodos de controller podem retornar:

- **Objetos simples / arrays** — serializados para JSON automaticamente
- **Strings** — retornadas como texto simples
- **Promises** — aguardadas e então serializadas

```typescript
@Get("/")
async findAll() {
  const users = await this.userService.findAll();
  return users; // serializado para JSON
}
```

## Acessando Dados da Requisição

Use `@Ctx()` para obter o contexto completo do Elysia, que fornece acesso a todos os dados da requisição:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;
  const q = ctx.query.q;
  return this.service.findById(id);
}
```

Para acesso tipado e validado ao body, params e query, use os decoradores baseados em TypeBox:

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

Veja [Decoradores de Parâmetro](/pt/features/parameter-decorators) para mais detalhes.

## Definindo Códigos de Status

Use `@HttpCode()` para definir um código de status personalizado para uma rota:

```typescript
@Post("/")
@HttpCode(201)
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

Ou use o contexto do Elysia para códigos de status dinâmicos:

```typescript
@Post("/")
create(@Ctx() ctx: any, @Body(t.Object({ name: t.String() })) body: { name: string }) {
  ctx.set.status = 201;
  return this.userService.create(body);
}
```

## Definindo Headers de Resposta

Use `@Header()` para adicionar headers de resposta estáticos:

```typescript
@Get("/")
@Header("Cache-Control", "no-store")
findAll() {
  return this.service.findAll();
}
```
