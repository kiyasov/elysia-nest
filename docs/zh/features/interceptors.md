---
title: 拦截器
icon: arrow-right-left
description: 使用拦截器添加处理器前逻辑
---

拦截器在路由处理器执行之前运行。它们可以检查请求、短路执行，或添加日志记录等副作用。

## 拦截器接口

nestelia 提供了一个简单的拦截器接口：

```typescript
interface Interceptor {
  intercept(context: any): Promise<boolean | void> | boolean | void;
}
```

`context` 参数是原始的 Elysia 上下文（与 `@Ctx()` 相同）。

返回 `false` 会阻止路由处理器执行。

## 创建拦截器

### 认证拦截器

```typescript
import { Injectable } from "nestelia";

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(ctx: any): boolean {
    const token = ctx.request.headers.get("authorization");
    if (!token) {
      ctx.set.status = 401;
      return false; // 阻止处理器
    }
    return true; // 允许处理器继续
  }
}
```

### 日志拦截器

```typescript
@Injectable()
class LoggingInterceptor implements Interceptor {
  intercept(ctx: any): void {
    const start = Date.now();
    console.log(`→ ${ctx.request.method} ${ctx.request.url}`);
    // 之后，处理器运行
    // 注意：处理器后逻辑需要 ResponseInterceptor
  }
}
```

## 使用拦截器

在控制器或方法级别使用 `@UseInterceptors()` 应用拦截器：

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

要添加在处理器之后运行的逻辑，实现 `ResponseInterceptor`：

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

## NestInterceptor 接口

`NestInterceptor` 接口已导出，但**尚未被**路由处理器执行。实际行为请使用 `Interceptor` 或 `ResponseInterceptor`：

```typescript
// 可导入但不自动调用
export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
}
```

## 多个拦截器

应用多个拦截器时，它们按列出的顺序执行。如果任何拦截器返回 `false`，后续拦截器和路由处理器将被跳过：

```typescript
@Get("/admin")
@UseInterceptors(AuthInterceptor, LoggingInterceptor)
adminRoute() { /* ... */ }
```
