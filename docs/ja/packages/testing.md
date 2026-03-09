---
title: テスト
icon: beaker
description: プロバイダーオーバーライドを持つ隔離テストモジュール
---

テストパッケージは nestelia アプリケーションのユニットテストと統合テストのためのユーティリティを提供します。

## クイックスタート

```typescript
import { describe, expect, it, beforeAll } from "bun:test";
import { Injectable } from "nestelia";
import { Test, TestingModule } from "nestelia/testing";

@Injectable()
class UserService {
  getUsers() {
    return [{ id: 1, name: "John" }];
  }
}

describe("UserService", () => {
  let module: TestingModule;
  let userService: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get(UserService);
  });

  it("should return users", () => {
    expect(userService.getUsers()).toEqual([{ id: 1, name: "John" }]);
  });
});
```

## 依存関係のモック

### バリューでオーバーライド

```typescript
const mockDb = {
  query: () => [{ id: 1, name: "Mock User" }],
};

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useValue(mockDb)
  .compile();
```

### クラスでオーバーライド

```typescript
class MockDatabaseService {
  query() {
    return [{ id: 1, name: "Mock" }];
  }
}

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useClass(MockDatabaseService)
  .compile();
```

### ファクトリーでオーバーライド

```typescript
const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useFactory(() => ({
    query: () => [{ id: 1, name: "Factory Mock" }],
  }))
  .compile();
```

## API リファレンス

### Test.createTestingModule(metadata)

`TestingModuleBuilder` を作成します。

**パラメータ:**
- `metadata` — モジュール設定 (`providers`、`imports`、`controllers`)

### TestingModuleBuilder

| メソッド | 説明 |
|--------|-------------|
| `.overrideProvider(token)` | プロバイダーのオーバーライドを開始する |
| `.useValue(value)` | 静的な値で置き換える |
| `.useClass(metatype)` | 別のクラスで置き換える |
| `.useFactory(factory, inject?)` | ファクトリー関数で置き換える |
| `.compile()` | ビルドして `Promise<TestingModule>` を返す |

### TestingModule

| メソッド | 説明 |
|--------|-------------|
| `.get<T>(token)` | プロバイダーインスタンスを取得する (同期) |
| `.resolve<T>(token)` | プロバイダーを解決する (非同期、リクエストスコープ用) |
| `.has(token)` | プロバイダーが登録されているか確認する |
