---
title: ライフサイクルフック
icon: refresh-cw
description: アプリケーションとモジュールのライフサイクルイベントにフックする
---

nestelia はアプリケーションの起動・シャットダウン処理の特定のタイミングでロジックを実行するライフサイクルフックを提供します。

## モジュールライフサイクルフック

`@Injectable()` サービスやコントローラーにこれらのインターフェースを実装します:

### OnModuleInit

モジュールのプロバイダーがインスタンス化された後に 1 回呼ばれます:

```typescript
import { Injectable, OnModuleInit } from "nestelia";

@Injectable()
class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log("Database connected");
  }
}
```

### OnApplicationBootstrap

すべてのモジュールが初期化された後に呼ばれます:

```typescript
@Injectable()
class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log("Application is ready");
  }
}
```

### OnModuleDestroy

モジュールが破棄される時（シャットダウン中）に呼ばれます:

```typescript
@Injectable()
class CacheService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.cache.flush();
  }
}
```

### BeforeApplicationShutdown

アプリケーションのシャットダウン開始前に呼ばれます。シャットダウンをトリガーしたシグナルを受け取ります:

```typescript
@Injectable()
class GracefulService implements BeforeApplicationShutdown {
  async beforeApplicationShutdown(signal?: string) {
    console.log(`Shutting down due to: ${signal}`);
    await this.drainRequests();
  }
}
```

### OnApplicationShutdown

すべてのモジュールが破棄された後に呼ばれます:

```typescript
@Injectable()
class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await this.releaseResources();
  }
}
```

## 実行順序

起動時:
1. `OnModuleInit` — モジュールごと、インポート順に
2. `OnApplicationBootstrap` — すべてのモジュール初期化後

シャットダウン時:
1. `BeforeApplicationShutdown`
2. `OnModuleDestroy`
3. `OnApplicationShutdown`

## Elysia ライフサイクルデコレータ

nestelia は Elysia のリクエストライフサイクルフックをコントローラーのメソッドデコレータとして公開しています:

```typescript
import {
  OnRequest,
  OnBeforeHandle,
  OnAfterHandle,
  OnAfterResponse,
  OnError,
} from "nestelia";

@Controller("/")
class AppController {
  @OnRequest()
  logRequest(ctx: any) {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
  }

  @OnBeforeHandle()
  checkAuth(ctx: any) {
    // ルートハンドラーの前に実行される
  }

  @OnAfterHandle()
  addHeaders(ctx: any) {
    ctx.set.headers["x-powered-by"] = "nestelia";
  }

  @OnError()
  handleError(ctx: any) {
    console.error("Error:", ctx.error);
  }

  @OnAfterResponse()
  logResponse(ctx: any) {
    console.log("Response sent");
  }
}
```

利用可能な Elysia ライフサイクルデコレータ:

| デコレータ | フック |
|-----------|------|
| `@OnRequest()` | ルーティング前 |
| `@OnParse()` | ボディパース |
| `@OnTransform()` | リクエスト変換 |
| `@OnBeforeHandle()` | ハンドラー前 |
| `@OnAfterHandle()` | ハンドラー後 |
| `@OnMapResponse()` | レスポンスマッピング |
| `@OnAfterResponse()` | レスポンス送信後 |
| `@OnError()` | エラーハンドラー |
