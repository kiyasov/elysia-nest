---
title: HTTP デコレータ
icon: globe
description: コントローラーメソッドを HTTP ルートにマッピングする
---

HTTP デコレータはコントローラーメソッドを特定の HTTP メソッドとパスにバインドします。

## 利用可能なデコレータ

| デコレータ | HTTP メソッド |
|-----------|-------------|
| `@Get(path?)` | GET |
| `@Post(path?)` | POST |
| `@Put(path?)` | PUT |
| `@Patch(path?)` | PATCH |
| `@Delete(path?)` | DELETE |
| `@Options(path?)` | OPTIONS |
| `@Head(path?)` | HEAD |
| `@All(path?)` | すべてのメソッド |

## 使い方

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Put, Delete, Body, Ctx } from "nestelia";

@Controller("/posts")
class PostController {
  @Get("/")
  findAll() {
    return this.postService.findAll();
  }

  @Get("/:id")
  findOne(@Ctx() ctx: any) {
    return this.postService.findById(ctx.params.id);
  }

  @Post("/")
  create(@Body(t.Object({ title: t.String(), content: t.String() })) body: { title: string; content: string }) {
    return this.postService.create(body);
  }

  @Put("/:id")
  update(@Ctx() ctx: any, @Body(t.Object({ title: t.Optional(t.String()) })) body: { title?: string }) {
    return this.postService.update(ctx.params.id, body);
  }

  @Delete("/:id")
  remove(@Ctx() ctx: any) {
    return this.postService.remove(ctx.params.id);
  }
}
```

## パスパラメータ

パスは Elysia の `:param` 構文を使ったルートパラメータをサポートします:

```typescript
@Get("/:category/:id")
findByCategory(@Ctx() ctx: any) {
  const { category, id } = ctx.params;
  return this.service.find(category, id);
}
```

バリデーション付きパラメータには `@Param()` デコレータと TypeBox スキーマを使用します:

```typescript
import { t } from "elysia";

@Get("/:id")
findOne(@Param(t.Object({ id: t.Numeric() })) params: { id: number }) {
  return this.service.findById(params.id);
}
```

## ワイルドカードルート

`@All()` を使って任意の HTTP メソッドにマッチさせます:

```typescript
@All("/health")
health() {
  return { status: "ok" };
}
```

## パス引数なし

パスを指定しない場合、メソッドはコントローラーのプレフィックスにマッチします:

```typescript
@Controller("/users")
class UserController {
  @Get()  // GET /users にマッチ
  findAll() { /* ... */ }
}
```

## レスポンスステータスとヘッダー

ルートメソッドに `@HttpCode()` と `@Header()` デコレータを使用します:

```typescript
@Post("/")
@HttpCode(201)
@Header("Location", "/users/1")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

## ルートメタデータ

内部では、各デコレータが `reflect-metadata` を通してメタデータを保存します:

- `ROUTE_METADATA` — HTTP メソッドとパス
- `PARAMS_METADATA` — パラメータ抽出の指示
- `ROUTE_SCHEMA_METADATA` — TypeBox バリデーションスキーマ

このメタデータはブートストラップ時に Elysia インスタンスへのルート登録に使用されます。
