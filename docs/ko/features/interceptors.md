---
title: 인터셉터
icon: arrow-right-left
description: 인터셉터로 핸들러 전 로직을 추가합니다
---

인터셉터는 라우트 핸들러 실행 전에 실행됩니다. 요청을 확인하거나 실행을 단락시키거나 로깅과 같은 부수 효과를 추가할 수 있습니다.

## 인터셉터 인터페이스

nestelia는 간단한 인터셉터 인터페이스를 제공합니다:

```typescript
interface Interceptor {
  intercept(context: any): Promise<boolean | void> | boolean | void;
}
```

`context` 인수는 원시 Elysia 컨텍스트입니다 (`@Ctx()`와 동일).

`false`를 반환하면 라우트 핸들러 실행이 방지됩니다.

## 인터셉터 만들기

### 인증 인터셉터

```typescript
import { Injectable } from "nestelia";

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(ctx: any): boolean {
    const token = ctx.request.headers.get("authorization");
    if (!token) {
      ctx.set.status = 401;
      return false; // 핸들러를 차단합니다
    }
    return true; // 핸들러가 진행됩니다
  }
}
```

### 로깅 인터셉터

```typescript
@Injectable()
class LoggingInterceptor implements Interceptor {
  intercept(ctx: any): void {
    const start = Date.now();
    console.log(`→ ${ctx.request.method} ${ctx.request.url}`);
    // 이후 핸들러가 실행됩니다
    // 참고: 핸들러 후 로직은 ResponseInterceptor가 필요합니다
  }
}
```

## 인터셉터 사용

`@UseInterceptors()`로 컨트롤러 또는 메서드 레벨에 인터셉터를 적용합니다:

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

핸들러 후에 실행되는 로직을 추가하려면 `ResponseInterceptor`를 구현합니다:

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

## NestInterceptor 인터페이스

`NestInterceptor` 인터페이스는 내보내지지만 라우트 핸들러에서 **아직 실행되지 않습니다**. 실제 동작을 위해 `Interceptor` 또는 `ResponseInterceptor`를 사용하세요:

```typescript
// 임포트 가능하지만 자동 호출되지 않습니다
export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
}
```

## 여러 인터셉터

여러 인터셉터가 적용되면 나열된 순서대로 실행됩니다. 인터셉터가 `false`를 반환하면 이후 인터셉터와 라우트 핸들러가 스킵됩니다:

```typescript
@Get("/admin")
@UseInterceptors(AuthInterceptor, LoggingInterceptor)
adminRoute() { /* ... */ }
```
