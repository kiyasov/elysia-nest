---
title: 异常处理
icon: circle-alert
description: 使用内置 HTTP 异常处理错误
---

nestelia 提供内置异常类，自动生成结构化的错误响应。

## 内置异常

```typescript
import {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from "nestelia";
```

## 用法

从控制器方法或服务中抛出异常：

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

框架捕获异常并返回：

```json
{
  "statusCode": 404,
  "message": "User 123 not found"
}
```

## HttpException

所有 HTTP 异常的基类：

```typescript
throw new HttpException("Something went wrong", 500);

// 或使用响应对象
throw new HttpException({ message: "Validation failed", errors: [] }, 422);
```

## 便捷异常类

| 异常 | 状态码 |
|------|--------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |

## 自定义异常

继承 `HttpException` 创建自己的异常：

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

## 异常过滤器

异常过滤器让你能够拦截并转换全局抛出的异常。

### 定义过滤器

实现 `ExceptionFilter` 接口，并使用 `@Catch()` 指定要处理的异常类型：

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

使用不带参数的 `@Catch()` 捕获所有错误：

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

### 注册过滤器

在根模块的 `providers` 中使用 `APP_FILTER` 令牌注册全局异常过滤器：

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

传递给 `catch()` 的上下文对象包含：

```typescript
interface ExceptionContext {
  request: Request;
  response: any;
  set: { status: number; headers: Record<string, string> };
  path: string;
  method: string;
}
```
