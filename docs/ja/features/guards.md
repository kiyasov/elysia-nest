---
title: ガード
icon: shield
description: @UseGuards() で認可ロジックによってルートを保護する
---

ガードはリクエストがルートハンドラーに進んでよいかどうかを判断します。`CanActivate` インターフェースを実装し、ハンドラーが呼ばれる前に自動的に実行されます。

## CanActivate インターフェース

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

`canActivate` が `false` を返すと、リクエストは **403 Forbidden** で拒否されます。`true` を返すと、リクエストは正常に進みます。

## ガードの作成

```typescript
import { Injectable, CanActivate, ExecutionContext } from "nestelia";

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers.get("authorization") !== null;
  }
}
```

ガードは非同期にもできます:

```typescript
@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.get("authorization");
    const user = await this.userService.verifyToken(token);
    return user?.role === "admin";
  }
}
```

## @UseGuards() デコレータ

ガードを**メソッドレベル**（単一ルート）または**クラスレベル**（コントローラー内のすべてのルート）に適用します。両方がある場合、クラスレベルのガードが先に実行されます。

```typescript
import { Controller, Get, UseGuards } from "nestelia";

@Controller("/admin")
@UseGuards(AuthGuard)       // このコントローラーのすべてのルートで実行
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → ハンドラー
  stats() {
    return { data: "stats" };
  }
}
```

複数のガードをチェーンできます — **順番に**実行され、最初の `false` でチェーンが停止します:

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## DI 対応ガード

ガードがモジュールのプロバイダーとして登録されている場合、DI コンテナから解決されます（コンストラクタインジェクションが可能）。登録されていない場合は直接インスタンス化されます。

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard が DI を使用
})
class AdminModule {}
```

## ExecutionContext

`canActivate` に渡される `ExecutionContext` は、現在のリクエストとハンドラーメタデータへのアクセスを提供します:

```typescript
interface ExecutionContext {
  /** コントローラークラス */
  getClass<T = any>(): T;
  /** ルートハンドラー関数 */
  getHandler(): (...args: unknown[]) => unknown;
  /** すべてのハンドラー引数 */
  getArgs<T extends any[] = any[]>(): T;
  /** インデックスによる単一の引数 */
  getArgByIndex<T = any>(index: number): T;
  /** コンテキストタイプ — HTTP ルートは "http" */
  getType<T extends string = string>(): T;
  /** HTTP コンテキストに切り替え */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Web API Request オブジェクト */
  getRequest<T = any>(): T;
  /** Elysia コンテキスト (set.status、set.headers など) */
  getResponse<T = any>(): T;
}
```

### 生のリクエストへのアクセス

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### Elysia コンテキストへのアクセス（ステータス、ヘッダー、クッキー）

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## リクエストパイプライン

ガードはコントローラーとハンドラーが解決された**後**、インターセプターとハンドラー自体の**前**に実行されます:

```
Request → Controller resolved → Guards → Interceptors → Handler → Response
```
