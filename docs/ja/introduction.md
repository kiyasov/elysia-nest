---
title: はじめに
description: Elysia 上に構築されたモジュラーなデコレータ駆動フレームワーク
---

# nestelia

**nestelia** は [Elysia](https://elysiajs.com/) と [Bun](https://bun.sh/) の上に構築されたモジュラーなデコレータ駆動フレームワークです。構造化されたサーバーサイドアプリケーションを構築するためのデコレータ、依存性注入、モジュール、ライフサイクルフックを提供します。

::: warning
nestelia は活発に開発中です。安定版リリース前に API が変更される可能性があります。
:::

## なぜ nestelia か?

Elysia は最速の Bun ネイティブ HTTP フレームワークの一つです。nestelia は Elysia のパフォーマンスを損なうことなく、その上に構造化されたモジュラーアーキテクチャを追加します。

- **デコレータ** — `@Controller`、`@Get`、`@Post`、`@Body`、`@Param` など
- **依存性注入** — シングルトン、トランジエント、リクエストスコープによるコンストラクタベースの DI
- **モジュール** — コントローラー、プロバイダー、インポートをまとまりのある単位にカプセル化
- **ライフサイクルフック** — `OnModuleInit`、`OnApplicationBootstrap`、`OnModuleDestroy` など
- **ガード、インターセプター、パイプ** — リクエストパイプラインの拡張性
- **ミドルウェア** — クラスベースおよび関数型ミドルウェアのサポート
- **例外ハンドリング** — 自動エラーレスポンスを持つ組み込み HTTP 例外
- **TypeBox バリデーション** — Elysia のネイティブ TypeBox 統合によるスキーマベースのリクエストバリデーション

## パッケージ

コア以外にも、nestelia はオプションのパッケージを提供しています:

| パッケージ | 説明 |
|---------|-------------|
| `nestelia/scheduler` | Cron ジョブ、インターバル、タイムアウト |
| `nestelia/microservices` | Redis、RabbitMQ、TCP トランスポート |
| `nestelia/apollo` | Apollo GraphQL コードファースト統合 |
| `nestelia/passport` | Passport.js 認証ストラテジー |
| `nestelia/testing` | プロバイダーオーバーライドを持つ隔離テストモジュール |
| `nestelia/cache` | デコレータによる HTTP レスポンスキャッシュ |
| `nestelia/rabbitmq` | 高度な RabbitMQ メッセージング |
| `nestelia/graphql-pubsub` | GraphQL サブスクリプション用 Redis PubSub |

## クイックサンプル

```typescript
import { createElysiaApplication, Controller, Get, Module, Injectable, Inject } from "nestelia";

@Injectable()
class GreetService {
  hello() {
    return { message: "Hello from nestelia!" };
  }
}

@Controller("/greet")
class GreetController {
  constructor(@Inject(GreetService) private greet: GreetService) {}

  @Get("/")
  sayHello() {
    return this.greet.hello();
  }
}

@Module({
  controllers: [GreetController],
  providers: [GreetService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Claude Code スキル

nestelia 用の [Claude Code](https://claude.ai/claude-code) スキルが利用可能です。AI アシスタントで直接、スキャフォールドテンプレート、デコレータの使い方、ベストプラクティスを提供します。

```bash
npx skills add kiyasov/nestelia
```

インストール後、Claude Code は `nestelia` を使用する際に正しいパターンを自動的に使用します。

## 次のステップ

- [インストール](/ja/getting-started/installation) — nestelia とピア依存関係をインストールします。
- [クイックスタート](/ja/getting-started/quick-start) — 5 分で最初の CRUD アプリを構築します。
- [モジュール](/ja/core-concepts/modules) — モジュールがアプリケーションをどのように整理するかを学びます。
- [依存性注入](/ja/features/dependency-injection) — 複数のスコープを持つコンストラクタベースの DI。
