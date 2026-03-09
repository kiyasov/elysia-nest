---
title: 예외 처리
icon: circle-alert
description: 내장 HTTP 예외로 에러를 처리합니다
---

nestelia는 구조화된 에러 응답을 자동으로 생성하는 내장 예외 클래스를 제공합니다.

## 내장 예외

```typescript
import {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from "nestelia";
```

## 사용법

컨트롤러 메서드나 서비스에서 예외를 던집니다:

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

프레임워크가 예외를 잡아 다음을 반환합니다:

```json
{
  "statusCode": 404,
  "message": "User 123 not found"
}
```

## HttpException

모든 HTTP 예외의 기본 클래스입니다:

```typescript
throw new HttpException("Something went wrong", 500);

// 또는 응답 객체와 함께
throw new HttpException({ message: "Validation failed", errors: [] }, 422);
```

## 편의 예외

| 예외 | 상태 코드 |
|-----------|-------------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |

## 커스텀 예외

`HttpException`을 확장해 직접 만들 수 있습니다:

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

## 예외 필터

예외 필터를 사용하면 던져진 예외를 전역으로 가로채고 변환할 수 있습니다.

### 필터 정의

`ExceptionFilter` 인터페이스를 구현하고 `@Catch()`를 사용해 처리할 예외 타입을 지정합니다:

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

인수 없이 `@Catch()`를 사용하면 모든 에러를 잡습니다:

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

### 필터 등록

루트 모듈의 `providers`에서 `APP_FILTER` 토큰을 사용해 전역 예외 필터를 등록합니다:

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

`catch()`에 전달되는 컨텍스트 객체에는 다음이 포함됩니다:

```typescript
interface ExceptionContext {
  request: Request;
  response: any;
  set: { status: number; headers: Record<string, string> };
  path: string;
  method: string;
}
```
