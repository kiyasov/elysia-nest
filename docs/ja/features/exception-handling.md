---
title: 例外ハンドリング
icon: circle-alert
description: 組み込み HTTP 例外でエラーを処理する
---

nestelia は構造化されたエラーレスポンスを自動的に生成する組み込み例外クラスを提供します。

## 組み込み例外

```typescript
import {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from "nestelia";
```

## 使い方

コントローラーメソッドやサービスから例外をスローします:

```typescript
@Get("/:id")
async findOne(@Ctx() ctx: any) {
  const user = await this.userService.findById(ctx.params.id);
  if (!user) {
    throw new NotFoundException(`User ${ctx.params.id} not found`);
  }
  return user;
}
```

フレームワークが例外をキャッチして以下を返します:

```json
{
  "statusCode": 404,
  "message": "User 123 not found"
}
```

## HttpException

すべての HTTP 例外の基底クラスです:

```typescript
throw new HttpException("Something went wrong", 500);

// レスポンスオブジェクトを使う場合
throw new HttpException({ message: "Validation failed", errors: [] }, 422);
```

## 便利な例外クラス

| 例外 | ステータスコード |
|-----------|-------------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |

## カスタム例外

`HttpException` を拡張して独自の例外を作成します:

```typescript
class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super({ message: "Validation failed", errors }, 422);
  }
}

class PaymentRequiredException extends HttpException {
  constructor() {
    super("Payment required", 402);
  }
}
```

## 例外フィルター

例外フィルターを使うと、スローされた例外をグローバルにインターセプトして変換できます。

### フィルターの定義

`ExceptionFilter` インターフェースを実装し、`@Catch()` でハンドルする例外の型を指定します:

```typescript
import { Catch, ExceptionFilter, ExceptionContext, HttpException } from "nestelia";

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, context: ExceptionContext) {
    return {
      statusCode: exception.getStatus(),
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: context.path,
    };
  }
}
```

引数なしの `@Catch()` を使うとすべてのエラーをキャッチします:

```typescript
@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, context: ExceptionContext) {
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    return {
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    };
  }
}
```

### フィルターの登録

ルートモジュールの `providers` で `APP_FILTER` トークンを使ってグローバル例外フィルターを登録します:

```typescript
import { Module, APP_FILTER } from "nestelia";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
class AppModule {}
```

### ExceptionContext

`catch()` に渡されるコンテキストオブジェクトには以下が含まれます:

```typescript
interface ExceptionContext {
  request: Request;
  response: any;
  set: { status: number; headers: Record<string, string> };
  path: string;
  method: string;
}
```
