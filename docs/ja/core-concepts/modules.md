---
title: モジュール
icon: boxes
description: アプリケーションをまとまりのあるブロックに整理する
---

モジュールは nestelia アプリケーションを整理する主要な方法です。各モジュールはコントローラー、プロバイダー、インポートのセットをカプセル化します。

## モジュールの定義

`@Module()` デコレータを使ってモジュールを宣言します:

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## モジュールオプション

```typescript
interface ModuleOptions {
  controllers?: Type[];        // ルートハンドラー
  providers?: Provider[];      // Injectable サービス
  imports?: any[];             // インポートする他のモジュール
  exports?: ProviderToken[];   // インポートするモジュールで利用可能なプロバイダー
  middlewares?: Middleware[];   // クラスベースまたは関数型ミドルウェア
  children?: (() => Promise<any>)[]; // 子モジュール
  prefix?: string;             // すべてのコントローラーのルートプレフィックス
}
```

## モジュールのインポート

モジュールはエクスポートされたプロバイダーにアクセスするために他のモジュールをインポートできます:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

`DatabaseModule` が `DatabaseService` をエクスポートしているため、`UserService` は `DatabaseService` をインジェクトできます。

## ルートモジュール

すべてのアプリケーションは `createElysiaApplication()` に渡されるルートモジュールを持ちます:

```typescript
@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
```

## モジュールプレフィックス

モジュール内のすべてのコントローラーにルートプレフィックスを適用します:

```typescript
@Module({
  controllers: [UserController], // ルートは /api/v1/users/... になります
  prefix: "/api/v1",
})
class ApiModule {}
```

## グローバルモジュール

モジュールをグローバルにマークすると、インポートなしにどこでもプロバイダーが利用可能になります:

```typescript
import { Global, Module } from "nestelia";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## ダイナミックモジュール

モジュールは `forRoot()` や `forRootAsync()` のような静的設定メソッドを公開できます:

```typescript
@Module({})
class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        { provide: "CONFIG_OPTIONS", useValue: options },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// 使用例
@Module({
  imports: [ConfigModule.forRoot({ path: ".env" })],
})
class AppModule {}
```

## 仕組み

内部では `@Module()` が Elysia プラグインを作成します。`createElysiaApplication()` が呼ばれると:

1. DI コンテナがモジュールのすべてのプロバイダーを登録する
2. コントローラーが依存関係を解決してインスタンス化される
3. HTTP ルートが Elysia インスタンスに登録される
4. ライフサイクルフックが順番に呼び出される
