---
title: コンテナ API
icon: box
description: 高度なユースケースのための DI コンテナへの直接アクセス
---

`DIContainer` シングルトンは依存性注入システムへの低レベルアクセスを提供します。ほとんどのアプリケーションでこれを直接使用する必要はありませんが、テスト、動的プロバイダー、フレームワーク拡張に役立ちます。

## インスタンスの取得

```typescript
import { DIContainer } from "nestelia";

const service = await DIContainer.get(UserService, UserModule);
```

## プロバイダーの登録

```typescript
DIContainer.register([
  UserService,
  { provide: "CONFIG", useValue: { port: 3000 } },
], MyModuleClass);
```

## コントローラーの登録

```typescript
DIContainer.registerControllers([UserController, AdminController], MyModuleClass);
```

## コンテナのクリア

テスト分離に便利 — 登録されているすべてのモジュールとプロバイダーを削除します:

```typescript
import { beforeEach } from "bun:test";
import { DIContainer } from "nestelia";

beforeEach(() => {
  DIContainer.clear();
});
```

## モジュール管理

```typescript
// モジュールを追加
const moduleRef = DIContainer.addModule(MyModule, "MyModule");

// キーでモジュールを取得
const moduleRef = DIContainer.getModuleByKey("MyModule");

// すべてのモジュールを取得
const modules = DIContainer.getModules();
```

## リクエストスコープ

コンテナはリクエストスコープのプロバイダーを管理するために `AsyncLocalStorage` を使用します。リクエストが来ると:

1. `Container.runInRequestContext()` が新しいコンテキストを作成する
2. `REQUEST` スコープのプロバイダーがそのコンテキスト用の新しいインスタンスを取得する
3. レスポンス後にコンテキストがクリーンアップされる

```typescript
@Injectable({ scope: Scope.REQUEST })
class RequestLogger {
  private requestId = crypto.randomUUID();

  log(message: string) {
    console.log(`[${this.requestId}] ${message}`);
  }
}
```

## モジュールキーの解決

プロバイダーはモジュールにスコープされています。`DIContainer.get()` を呼ぶ際に、特定のモジュール内でプロバイダーを検索するためにモジュールクラスを渡します:

```typescript
const service = await DIContainer.get(UserService, UserModule);
```

省略すると、コンテナはすべてのモジュールを検索します。

## グローバルモジュール

```typescript
// モジュールをグローバルにして、どこからでもプロバイダーにアクセスできるようにする
const moduleRef = DIContainer.addModule(ConfigModule, "ConfigModule");
DIContainer.addGlobalModule(moduleRef);
DIContainer.bindGlobalScope();
```
