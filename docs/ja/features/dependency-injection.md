---
title: 依存性注入
icon: plug
description: 複数のスコープを持つコンストラクタベースの DI
---

nestelia はフルの依存性注入システムを提供します。サービスはモジュールに登録され、コントローラーや他のサービスに自動的に注入されます。

## @Injectable()

クラスを injectable としてマークし、DI コンテナが管理できるようにします:

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  findAll() {
    return [{ id: 1, name: "John" }];
  }
}
```

## @Inject()

コンストラクタで依存トークンを明示的に指定します:

```typescript
@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
}
```

## @Optional()

依存関係をオプションとしてマークします — 利用できない場合は `undefined` を返します:

```typescript
constructor(
  @Inject("ANALYTICS") @Optional() private analytics?: AnalyticsService
) {}
```

## スコープ

スコープでサービスのライフサイクルを制御します:

```typescript
import { Injectable, Scope } from "nestelia";

// デフォルト — どこでも共有される 1 つのインスタンス
@Injectable()
class SingletonService {}

// 注入のたびに新しいインスタンス
@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}

// HTTP リクエストごとに新しいインスタンス (AsyncLocalStorage 経由)
@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}
```

| スコープ | 動作 |
|-------|----------|
| `SINGLETON` | アプリケーション全体で 1 つのインスタンス (デフォルト) |
| `TRANSIENT` | 注入のたびに新しいインスタンス |
| `REQUEST` | HTTP リクエストごとに新しいインスタンス |

## プロバイダーの登録

プロバイダーはモジュールの `providers` 配列に登録します:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
class UserModule {}
```

## プロバイダーのエクスポート

プロバイダーを他のモジュールで利用可能にするには `exports` に追加します:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService], // DatabaseService をインジェクトできる
})
class UserModule {}
```

## カスタムプロバイダー

バリュー、クラス、ファクトリー、エイリアスプロバイダーについては[カスタムプロバイダー](/ja/advanced/custom-providers)ページを参照してください。

## 循環依存

`forwardRef()` を使った循環依存の解決については[フォワードリファレンス](/ja/advanced/forward-ref)ページを参照してください。
