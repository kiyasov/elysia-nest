---
title: Quick Start
icon: zap
description: Build a CRUD API with @kiyasov/elysia-nest in 5 minutes
---

This guide walks you through building a simple Users API with @kiyasov/elysia-nest.

## 1. Create the Service

Services hold your business logic and are marked with `@Injectable()` so the DI container can manage them.

```typescript
import { Injectable } from "@kiyasov/elysia-nest";

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

## 2. Create the Controller

Controllers define HTTP routes. Use `@Controller` to set a route prefix and HTTP decorators for individual methods.

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Body, Param, Inject, Ctx } from "@kiyasov/elysia-nest";

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
`@Body`, `@Param`, and `@Query` accept a [TypeBox](https://github.com/sinclairzx81/typebox) schema for validation. To access individual route parameters without a schema, use `@Ctx()` to get the full Elysia context.
:::

## 3. Create the Module

Modules group controllers and providers together. Every application has at least one root module.

```typescript
import { Module } from "@kiyasov/elysia-nest";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}
```

## 4. Bootstrap the Application

```typescript
import { createElysiaApplication } from "@kiyasov/elysia-nest";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

## 5. Test It

```bash
# List users
curl http://localhost:3000/users

# Get user by ID
curl http://localhost:3000/users/1

# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

## Full Example

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
} from "@kiyasov/elysia-nest";

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

## Next Steps

- [Modules](/core-concepts/modules) — Learn how to organize your app with modules.
- [Dependency Injection](/features/dependency-injection) — Understand DI scopes and custom providers.
