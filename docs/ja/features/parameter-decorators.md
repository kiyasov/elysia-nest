---
title: パラメータデコレータ
icon: at-sign
description: デコレータでリクエストからデータを抽出する
---

パラメータデコレータを使うと、受信リクエストの特定の部分をハンドラーメソッドの引数に直接抽出できます。

## 利用可能なデコレータ

| デコレータ | 抽出する内容 |
|-----------|----------|
| `@Body(schema)` | リクエストボディ (JSON)、TypeBox スキーマでバリデーション |
| `@Param(schema)` | すべての URL パスパラメータ、TypeBox スキーマでバリデーション |
| `@Query(schema)` | すべてのクエリ文字列パラメータ、TypeBox スキーマでバリデーション |
| `@Headers(name?)` | リクエストヘッダー |
| `@Req()` / `@Request()` | 生の `Request` オブジェクト |
| `@Res()` / `@Response()` | Elysia レスポンスコンテキスト (`set`) |
| `@Ctx()` / `@ElysiaContext()` | Elysia のフルコンテキスト |
| `@Ip()` | クライアント IP アドレス |
| `@Session()` | セッションオブジェクト |

## TypeBox スキーマデコレータ

`@Body`、`@Param`、`@Query` はスキーマ定義とバリデーションに [TypeBox](https://github.com/sinclairzx81/typebox) を使用します。`elysia` から `t` をインポートします:

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

スキーマは TypeBox バリデーションのために Elysia のルートに渡されます。バリデーションに失敗すると、Elysia が自動的に 422 レスポンスを返します。

## @Body()

パースされた JSON リクエストボディを抽出してバリデーションします:

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

すべての URL パスパラメータをオブジェクトとして抽出します:

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

すべてのクエリ文字列値をオブジェクトとして抽出します:

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

リクエストヘッダーにアクセスします。名前を渡すと特定のヘッダーを取得し、省略すると `Headers` オブジェクト全体を取得します:

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

低レベルな制御のために Elysia のフルリクエストコンテキストにアクセスします。スキーマバリデーションなしで個別のパスパラメータやクエリ値にアクセスする最も簡単な方法でもあります:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;       // パスパラメータ
  const q = ctx.query.search;     // クエリ文字列
  const body = ctx.body;          // リクエストボディ
  ctx.set.status = 200;           // レスポンスステータスを設定
  ctx.set.headers["x-custom"] = "value"; // レスポンスヘッダーを設定
  return this.service.findById(id);
}
```

## @Req() / @Request()

生の Web `Request` オブジェクトにアクセスします:

```typescript
@Get("/")
handle(@Req() request: Request) {
  const userAgent = request.headers.get("user-agent");
  return { userAgent };
}
```

## @Ip()

クライアントの IP アドレスを取得します:

```typescript
@Get("/")
handle(@Ip() ip: string) {
  return { ip };
}
```

## カスタムパラメータデコレータ

`createParamDecorator` を使って再利用可能なパラメータデコレータを作成します:

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

## @Schema() でフルルートバリデーション

`@Schema()` デコレータを使うと、完全な Elysia ルートスキーマ（body、params、query、headers、response）を一か所で定義できます:

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
