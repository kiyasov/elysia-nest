---
title: クイックスタート
icon: zap
description: 5 分で nestelia を使った CRUD API を構築する
---

このガイドでは nestelia を使ったシンプルなユーザー API の構築手順を説明します。

## 1. サービスの作成

サービスはビジネスロジックを持ち、DI コンテナが管理できるよう `@Injectable()` でマークされます。

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

## 2. コントローラーの作成

コントローラーは HTTP ルートを定義します。`@Controller` でルートプレフィックスを設定し、HTTP デコレータで各メソッドを定義します。

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
`@Body`、`@Param`、`@Query` はバリデーション用の [TypeBox](https://github.com/sinclairzx81/typebox) スキーマを受け付けます。スキーマなしで個別のルートパラメータにアクセスするには、`@Ctx()` を使用して Elysia のフルコンテキストを取得してください。
:::

## 3. モジュールの作成

モジュールはコントローラーとプロバイダーをまとめます。すべてのアプリケーションは少なくとも 1 つのルートモジュールを持ちます。

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}
```

## 4. アプリケーションの起動

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

## 5. テスト

```bash
# ユーザー一覧
curl http://localhost:3000/users

# ID でユーザーを取得
curl http://localhost:3000/users/1

# ユーザーを作成
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

## 完全なサンプル

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

## 次のステップ

- [モジュール](/ja/core-concepts/modules) — モジュールでアプリを整理する方法を学びます。
- [依存性注入](/ja/features/dependency-injection) — DI スコープとカスタムプロバイダーを理解します。
