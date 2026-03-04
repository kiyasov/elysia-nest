---
title: Interceptors
icon: arrow-right-left
description: Add pre-handler logic with interceptors
---

Interceptors run before route handler execution. They can check the request, short-circuit execution, or add side effects such as logging.

## Interceptor Interface

@kiyasov/elysia-nest provides a simple interceptor interface:

```typescript
interface Interceptor {
  intercept(context: any): Promise<boolean | void> | boolean | void;
}
```

The `context` argument is the raw Elysia context (same as `@Ctx()`).

Returning `false` prevents the route handler from executing.

## Creating an Interceptor

### Auth Interceptor

```typescript
import { Injectable } from "@kiyasov/elysia-nest";

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(ctx: any): boolean {
    const token = ctx.request.headers.get("authorization");
    if (!token) {
      ctx.set.status = 401;
      return false; // blocks the handler
    }
    return true; // allows the handler to proceed
  }
}
```

### Logging Interceptor

```typescript
@Injectable()
class LoggingInterceptor implements Interceptor {
  intercept(ctx: any): void {
    const start = Date.now();
    console.log(`→ ${ctx.request.method} ${ctx.request.url}`);
    // After this, the handler runs
    // Note: post-handler logic requires ResponseInterceptor
  }
}
```

## Using Interceptors

Apply interceptors with `@UseInterceptors()` at the controller or method level:

```typescript
import { UseInterceptors } from "@kiyasov/elysia-nest";

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

To add logic that runs after the handler, implement `ResponseInterceptor`:

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

## NestInterceptor Interface

The `NestInterceptor` interface is exported but is **not yet executed** by the route handler. Use `Interceptor` or `ResponseInterceptor` for actual behavior:

```typescript
// Available for import but not auto-invoked
export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
}
```

## Multiple Interceptors

When multiple interceptors are applied, they execute in the order listed. If any interceptor returns `false`, subsequent interceptors and the route handler are skipped:

```typescript
@Get("/admin")
@UseInterceptors(AuthInterceptor, LoggingInterceptor)
adminRoute() { /* ... */ }
```
