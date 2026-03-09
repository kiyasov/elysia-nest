---
title: 守卫
icon: shield
description: 使用 @UseGuards() 保护路由的授权逻辑
---

守卫决定请求是否应该进入路由处理器。它们实现 `CanActivate` 接口，并在处理器调用之前自动执行。

## CanActivate 接口

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

如果 `canActivate` 返回 `false`，请求将被拒绝并返回 **403 Forbidden**。如果返回 `true`，请求正常进行。

## 创建守卫

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

守卫也可以是异步的：

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

## @UseGuards() 装饰器

在**方法级别**（单个路由）或**类级别**（控制器中的所有路由）应用守卫。两者都存在时，类级守卫先运行。

```typescript
import { Controller, Get, UseGuards } from "nestelia";

@Controller("/admin")
@UseGuards(AuthGuard)       // 为该控制器中的每个路由运行
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → 处理器
  stats() {
    return { data: "stats" };
  }
}
```

多个守卫可以串联——它们**按顺序**运行，第一个返回 `false` 的守卫会停止链式执行：

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## DI 感知守卫

如果守卫在模块中作为提供者注册，它将从 DI 容器中解析（允许构造函数注入）。否则直接实例化。

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard 获得 DI 支持
})
class AdminModule {}
```

## ExecutionContext

传递给 `canActivate` 的 `ExecutionContext` 提供对当前请求和处理器元数据的访问：

```typescript
interface ExecutionContext {
  /** 控制器类 */
  getClass<T = any>(): T;
  /** 路由处理函数 */
  getHandler(): (...args: unknown[]) => unknown;
  /** 所有处理器参数 */
  getArgs<T extends any[] = any[]>(): T;
  /** 按索引获取单个参数 */
  getArgByIndex<T = any>(index: number): T;
  /** 上下文类型 — HTTP 路由为 "http" */
  getType<T extends string = string>(): T;
  /** 切换到 HTTP 上下文 */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Web API Request 对象 */
  getRequest<T = any>(): T;
  /** Elysia 上下文（包含 set.status、set.headers 等） */
  getResponse<T = any>(): T;
}
```

### 访问原始请求

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### 访问 Elysia 上下文（状态码、响应头、Cookie）

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## 请求管道

守卫在控制器和处理器解析**之后**运行，在拦截器和处理器本身**之前**运行：

```
请求 → 控制器解析 → 守卫 → 拦截器 → 处理器 → 响应
```
