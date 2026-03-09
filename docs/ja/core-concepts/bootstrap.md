---
title: ブートストラップ
icon: power
description: nestelia アプリケーションを初期化して起動する
---

`createElysiaApplication` 関数はルートモジュールを初期化し、リクエストをリッスンする準備が整った Elysia インスタンスを返します。

## 基本的な使い方

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## createElysiaApplication の動作

1. **モジュールツリーを解決する** — インポート、プロバイダー、コントローラーを再帰的に処理する
2. **プロバイダーを登録する** — すべてのプロバイダーを DI コンテナに追加する
3. **コントローラーをインスタンス化する** — 依存関係を注入してコントローラーインスタンスを作成する
4. **ルートを登録する** — デコレートされたメソッドを Elysia ルートにマッピングする
5. **ライフサイクルフックを実行する** — `onModuleInit` と `onApplicationBootstrap` を順番に呼び出す
6. **ElysiaNestApplication を返す** — `.listen()` を呼び出す準備が完了する

## マイクロサービスとの併用

マイクロサービスパッケージを使用する場合、`createElysiaApplication` は HTTP とマイクロサービスのハイブリッドモードをサポートする `ElysiaNestApplication` を返します:

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```

## グレースフルシャットダウン

nestelia はシャットダウンライフサイクルフックをサポートします。プロセスが終了シグナルを受信すると:

1. `BeforeApplicationShutdown` フックが最初に実行される
2. `OnModuleDestroy` フックがクリーンアップのために実行される
3. `OnApplicationShutdown` フックが最後に実行される

```typescript
@Injectable()
class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.connection.close();
  }
}
```
