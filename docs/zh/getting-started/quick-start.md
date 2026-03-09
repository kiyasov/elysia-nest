---
title: 快速开始
icon: zap
description: 在 5 分钟内用 nestelia 构建 CRUD API
---

本指南将引导你使用 nestelia 构建一个简单的用户 API。

## 1. 创建服务

服务包含业务逻辑，并使用 `@Injectable()` 标记，以便 DI 容器管理它们。

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

## 2. 创建控制器

控制器定义 HTTP 路由。使用 `@Controller` 设置路由前缀，并使用 HTTP 装饰器定义各个方法。

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
`@Body`、`@Param` 和 `@Query` 接受 [TypeBox](https://github.com/sinclairzx81/typebox) Schema 进行验证。要在不使用 Schema 的情况下访问单个路由参数，可以使用 `@Ctx()` 获取完整的 Elysia 上下文。
:::

## 3. 创建模块

模块将控制器和提供者组合在一起。每个应用程序至少有一个根模块。

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}
```

## 4. 启动应用程序

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

## 5. 测试

```bash
# 获取用户列表
curl http://localhost:3000/users

# 根据 ID 获取用户
curl http://localhost:3000/users/1

# 创建用户
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

## 完整示例

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

## 下一步

- [模块](/zh/core-concepts/modules) — 了解如何使用模块组织你的应用。
- [依赖注入](/zh/features/dependency-injection) — 理解 DI 作用域和自定义提供者。
