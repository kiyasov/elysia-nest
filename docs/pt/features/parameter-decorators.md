---
title: Decoradores de Parâmetro
icon: at-sign
description: Extraia dados das requisições com decoradores
---

Decoradores de parâmetro permitem extrair partes específicas da requisição recebida diretamente nos argumentos do método handler.

## Decoradores Disponíveis

| Decorador | Extrai |
|-----------|--------|
| `@Body(schema)` | Corpo da requisição (JSON), validado contra schema TypeBox |
| `@Param(schema)` | Todos os parâmetros de caminho da URL, validados contra schema TypeBox |
| `@Query(schema)` | Todos os parâmetros de query string, validados contra schema TypeBox |
| `@Headers(name?)` | Header(s) da requisição |
| `@Req()` / `@Request()` | Objeto `Request` bruto |
| `@Res()` / `@Response()` | Contexto de resposta do Elysia (`set`) |
| `@Ctx()` / `@ElysiaContext()` | Contexto completo do Elysia |
| `@Ip()` | Endereço IP do cliente |
| `@Session()` | Objeto de sessão |

## Decoradores com Schema TypeBox

`@Body`, `@Param` e `@Query` usam [TypeBox](https://github.com/sinclairzx81/typebox) para definição e validação de schemas. Importe `t` do `elysia`:

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

O schema é passado para a rota do Elysia para validação com TypeBox. Se a validação falhar, o Elysia retorna uma resposta 422 automaticamente.

## @Body()

Extrai e valida o corpo JSON da requisição analisada:

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

Extrai todos os parâmetros de caminho da URL como um objeto:

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

Extrai todos os valores da query string como um objeto:

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

Acessa os headers da requisição. Passe um nome para obter um header específico, ou omita para obter o objeto `Headers` completo:

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

Acessa o contexto completo da requisição do Elysia para controle de baixo nível. Esta é também a forma mais simples de acessar parâmetros de caminho ou valores de query individuais sem validação de schema:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;       // parâmetro de caminho
  const q = ctx.query.search;     // query string
  const body = ctx.body;          // corpo da requisição
  ctx.set.status = 200;           // define o status da resposta
  ctx.set.headers["x-custom"] = "value"; // define header de resposta
  return this.service.findById(id);
}
```

## @Req() / @Request()

Acessa o objeto Web `Request` bruto:

```typescript
@Get("/")
handle(@Req() request: Request) {
  const userAgent = request.headers.get("user-agent");
  return { userAgent };
}
```

## @Ip()

Obtém o endereço IP do cliente:

```typescript
@Get("/")
handle(@Ip() ip: string) {
  return { ip };
}
```

## Decoradores de Parâmetro Customizados

Crie decoradores de parâmetro reutilizáveis com `createParamDecorator`:

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

## Usando @Schema() para Validação Completa da Rota

O decorador `@Schema()` permite definir o schema completo da rota do Elysia (body, params, query, headers, response) em um único lugar:

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
