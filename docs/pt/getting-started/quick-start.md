---
title: Quick Start
icon: zap
description: Construa uma API CRUD com nestelia em 5 minutos
---

Este guia mostra como construir uma API simples de Usuários com o nestelia.

## 1. Crie o Service

Services contêm a lógica de negócio e são marcados com `@Injectable()` para que o container de DI possa gerenciá-los.

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  private users = [{ id: 1, name: "John" }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(user: { name: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}
```

## 2. Crie o Controller

Controllers definem as rotas HTTP. Use `@Controller` para definir um prefixo de rota e decoradores HTTP para os métodos individuais.

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Body, Param, Inject, Ctx } from "nestelia";

@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get("/")
  getAll() {
    return this.userService.findAll();
  }

  @Get("/:id")
  getById(@Ctx() ctx: any) {
    return this.userService.findById(Number(ctx.params.id));
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.userService.create(body);
  }
}
```

::: info
`@Body`, `@Param` e `@Query` aceitam um schema do [TypeBox](https://github.com/sinclairzx81/typebox) para validação. Para acessar parâmetros de rota individuais sem um schema, use `@Ctx()` para obter o contexto completo do Elysia.
:::

## 3. Crie o Módulo

Módulos agrupam controllers e providers. Toda aplicação tem pelo menos um módulo raiz.

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}
```

## 4. Inicialize a Aplicação

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

## 5. Teste

```bash
# Listar usuários
curl http://localhost:3000/users

# Buscar usuário por ID
curl http://localhost:3000/users/1

# Criar um usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

## Exemplo Completo

```typescript
import { t } from "elysia";
import {
  createElysiaApplication,
  Controller,
  Get,
  Post,
  Module,
  Body,
  Ctx,
  Inject,
  Injectable,
} from "nestelia";

@Injectable()
class UserService {
  private users = [{ id: 1, name: "John" }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(user: { name: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}

@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get("/")
  getAll() {
    return this.userService.findAll();
  }

  @Get("/:id")
  getById(@Ctx() ctx: any) {
    return this.userService.findById(Number(ctx.params.id));
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.userService.create(body);
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Próximos Passos

- [Módulos](/pt/core-concepts/modules) — Aprenda a organizar seu app com módulos.
- [Injeção de Dependências](/pt/features/dependency-injection) — Entenda os escopos de DI e providers customizados.
