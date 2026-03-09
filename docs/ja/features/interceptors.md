---
title: インターセプター
icon: arrow-right-left
description: インターセプターでハンドラー前のロジックを追加する
---

インターセプターはルートハンドラーの実行前に動作します。リクエストをチェックしたり、実行を中断したり、ログ記録などの副作用を追加したりできます。

## インターセプターインターフェース

nestelia はシンプルなインターセプターインターフェースを提供します:

```typescript
interface Interceptor {
  intercept(context: any): Promise<boolean | void> | boolean | void;
}
```

`context` 引数は Elysia の生のコンテキスト（`@Ctx()` と同じ）です。

`false` を返すとルートハンドラーの実行が防止されます。

## インターセプターの作成

### 認証インターセプター

```typescript
import { Injectable } from "nestelia";

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(ctx: any): boolean {
    const token = ctx.request.headers.get("authorization");
    if (!token) {
      ctx.set.status = 401;
      return false; // ハンドラーをブロック
    }
    return true; // ハンドラーの実行を許可
  }
}
```

### ログ記録インターセプター

```typescript
@Injectable()
class LoggingInterceptor implements Interceptor {
  intercept(ctx: any): void {
    const start = Date.now();
    console.log(`→ ${ctx.request.method} ${ctx.request.url}`);
    // この後にハンドラーが実行される
    // 注意: ハンドラー後のロジックには ResponseInterceptor が必要
  }
}
```

## インターセプターの使い方

`@UseInterceptors()` を使ってコントローラーまたはメソッドレベルでインターセプターを適用します:

```typescript
import { UseInterceptors } from "nestelia";

@Controller("/users")
@UseInterceptors(LoggingInterceptor)
class UserController {
  @Get("/")
  findAll() {
    return this.userService.findAll();
  }

  @Get("/secure")
  @UseInterceptors(AuthInterceptor)
  secure() {
    return { secret: "data" };
  }
}
```

## ResponseInterceptor

ハンドラーの後に実行されるロジックを追加するには `ResponseInterceptor` を実装します:

```typescript
interface ResponseInterceptor {
  interceptAfter(context: any): Promise<any> | any;
}
```

```typescript
@Injectable()
class TimingInterceptor implements ResponseInterceptor {
  interceptAfter(ctx: any) {
    ctx.set.headers["x-response-time"] = String(Date.now());
  }
}
```

## NestInterceptor インターフェース

`NestInterceptor` インターフェースはエクスポートされていますが、**まだルートハンドラーによって実行されません**。実際の動作には `Interceptor` または `ResponseInterceptor` を使用してください:

```typescript
// インポート可能だが自動呼び出しされない
export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
}
```

## 複数のインターセプター

複数のインターセプターが適用されている場合、列挙された順番で実行されます。いずれかのインターセプターが `false` を返すと、後続のインターセプターとルートハンドラーはスキップされます:

```typescript
@Get("/admin")
@UseInterceptors(AuthInterceptor, LoggingInterceptor)
adminRoute() { /* ... */ }
```
