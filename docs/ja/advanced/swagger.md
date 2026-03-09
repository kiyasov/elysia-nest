---
title: Swagger / OpenAPI
icon: file-code
description: Elysia 経由の TypeBox 駆動スキーマドキュメント
---

nestelia は [TypeBox](https://github.com/sinclairzx81/typebox) スキーマを使用しています — Elysia がネイティブに使用するのと同じスキーマです。Elysia は `@elysiajs/swagger` プラグインを通して Swagger/OpenAPI を一級サポートしているため、最小限の設定でフルの API ドキュメントを追加できます。

## セットアップ

Elysia Swagger プラグインをインストールします:

```bash
bun add @elysiajs/swagger
```

ルートモジュールで関数型ミドルウェアとして登録します:

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

Swagger UI は `/swagger` で利用可能になります。

## スキーマデコレータ

TypeBox スキーマと共に `@Body`、`@Param`、`@Query` を使用します — これらは Elysia のスキーマシステムに自動的に取り込まれ、生成される OpenAPI スペックに表示されます:

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

## @Schema() デコレータ

`@Schema()` デコレータを使うと、レスポンス型を含む完全なルートスキーマを定義できます:

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

## Swagger のカスタマイズ

タイトル、バージョン、タグなどを設定するための Swagger プラグインオプションを設定します:

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

オプションの完全なリストは [Elysia Swagger ドキュメント](https://elysiajs.com/plugins/swagger.html)を参照してください。
