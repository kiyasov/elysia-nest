---
title: コントローラー
icon: server
description: デコレータで HTTP ルートハンドラーを定義する
---

コントローラーは受信した HTTP リクエストを処理してレスポンスを返します。`@Controller()` でデコレートされ、HTTP メソッドデコレータでルートを定義します。

## コントローラーの定義

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

`@Controller("/cats")` デコレータはルートプレフィックスを設定します。`@Get("/")` デコレータは `GET /cats/` を `findAll()` にマッピングします。

## コントローラーの登録

コントローラーはモジュールで宣言する必要があります:

```typescript
@Module({
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}
```

## サービスのインジェクト

コンストラクタで `@Inject()` を使って DI コンテナからサービスにアクセスします:

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

## ルートメソッド

nestelia はすべての標準 HTTP メソッドに対応するデコレータを提供します:

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

## レスポンスの返し方

コントローラーメソッドは以下を返せます:

- **プレーンオブジェクト / 配列** — 自動的に JSON にシリアライズ
- **文字列** — プレーンテキストとして返される
- **Promise** — await してシリアライズ

```typescript
@Get("/")
async findAll() {
  const users = await this.userService.findAll();
  return users; // JSON にシリアライズ
}
```

## リクエストデータへのアクセス

`@Ctx()` を使って Elysia のフルコンテキストを取得し、すべてのリクエストデータにアクセスします:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;
  const q = ctx.query.q;
  return this.service.findById(id);
}
```

body、params、query への型付きかつバリデーション済みのアクセスには TypeBox ベースのデコレータを使用します:

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

詳細は[パラメータデコレータ](/ja/features/parameter-decorators)を参照してください。

## ステータスコードの設定

`@HttpCode()` を使ってルートのカスタムステータスコードを設定します:

```typescript
@Post("/")
@HttpCode(201)
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

動的なステータスコードには Elysia コンテキストを使用します:

```typescript
@Post("/")
create(@Ctx() ctx: any, @Body(t.Object({ name: t.String() })) body: { name: string }) {
  ctx.set.status = 201;
  return this.userService.create(body);
}
```

## レスポンスヘッダーの設定

`@Header()` を使って静的なレスポンスヘッダーを追加します:

```typescript
@Get("/")
@Header("Cache-Control", "no-store")
findAll() {
  return this.service.findAll();
}
```
