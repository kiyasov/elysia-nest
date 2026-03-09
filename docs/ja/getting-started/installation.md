---
title: インストール
icon: download
description: nestelia をインストールしてプロジェクトをセットアップする
---

## 前提条件

- [Bun](https://bun.sh/) v1.0 以降
- TypeScript 5.0 以上

## インストール

```bash
bun add nestelia elysia
```

nestelia はピア依存関係として `elysia` ^1.2.0 が必要です。

## TypeScript 設定

nestelia はデコレータとメタデータリフレクションに依存しています。`tsconfig.json` に以下を含めてください:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## オプションのピア依存関係

すべてのサブパスは `nestelia` パッケージに含まれています。必要なピア依存関係のみをインストールしてください:

```bash
# マイクロサービス — Redis トランスポート
bun add ioredis

# マイクロサービス — RabbitMQ トランスポート
bun add amqplib

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport 認証
bun add passport

# キャッシュマネージャー
bun add cache-manager

# RabbitMQ メッセージング
bun add amqplib

# GraphQL PubSub (Redis)
bun add ioredis
```

## インストールの確認

最小限のアプリを作成して動作確認します:

```typescript
import { createElysiaApplication, Controller, Get, Module } from "nestelia";

@Controller("/")
class AppController {
  @Get("/")
  hello() {
    return { status: "ok" };
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

```bash
bun run app.ts
```
