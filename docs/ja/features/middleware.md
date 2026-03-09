---
title: ミドルウェア
icon: layers
description: クラスベースおよび関数型ミドルウェアで横断的なロジックを追加する
---

ミドルウェアはルートハンドラーの前に実行され、リクエストやレスポンスを変更したり、パイプラインを中断したりできます。

## クラスベースミドルウェア

`ElysiaNestMiddleware` を実装するクラスを作成します:

```typescript
import { Injectable, ElysiaNestMiddleware } from "nestelia";

@Injectable()
class LoggerMiddleware implements ElysiaNestMiddleware {
  async use(context: any, next: () => Promise<any>) {
    const start = Date.now();
    console.log(`→ ${context.request.method} ${context.request.url}`);

    await next();

    console.log(`← ${Date.now() - start}ms`);
  }
}
```

モジュールの `providers` と `middlewares` 配列に登録します:

```typescript
@Module({
  controllers: [AppController],
  providers: [LoggerMiddleware],
  middlewares: [LoggerMiddleware],
})
class AppModule {}
```

クラスベースミドルウェアは DI コンテナから解決されるため、他のサービスをインジェクトできます:

```typescript
@Injectable()
class AuthMiddleware implements ElysiaNestMiddleware {
  constructor(@Inject(AuthService) private auth: AuthService) {}

  async use(context: any, next: () => Promise<any>) {
    const token = context.request.headers.get("authorization");
    if (!this.auth.verify(token)) {
      context.set.status = 401;
      return { error: "Unauthorized" };
    }
    await next();
  }
}
```

## 関数型ミドルウェア

シンプルなケースでは、Elysia プラグイン関数を直接使用します:

```typescript
import cors from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";

@Module({
  middlewares: [
    (app) => app.use(cors()),
    (app) => app.use(jwt({ secret: "my-secret" })),
  ],
})
class AppModule {}
```

## 実行順序

ミドルウェアは `middlewares` 配列に列挙された順番で実行され、ルートハンドラーが実行される前に動作します。インポートされたモジュールのクラスベースミドルウェアは、現在のモジュールのミドルウェアより前に実行されます。
