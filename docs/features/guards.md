---
title: Guards
icon: shield
description: Protect routes with authorization logic using @UseGuards()
---

Guards determine whether a request should proceed to the route handler. They implement the `CanActivate` interface and are automatically executed before the handler is called.

## CanActivate Interface

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

If `canActivate` returns `false`, the request is rejected with **403 Forbidden**. If it returns `true`, the request proceeds normally.

## Creating a Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@kiyasov/elysia-nest";

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers.get("authorization") !== null;
  }
}
```

Guards can also be async:

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

## @UseGuards() Decorator

Apply guards at the **method level** (single route) or **class level** (all routes in a controller). When both are present, class-level guards run first.

```typescript
import { Controller, Get, UseGuards } from "@kiyasov/elysia-nest";

@Controller("/admin")
@UseGuards(AuthGuard)       // runs for every route in this controller
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → handler
  stats() {
    return { data: "stats" };
  }
}
```

Multiple guards can be chained — they run **in order**, and the first `false` stops the chain:

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## DI-Aware Guards

If a guard is registered as a provider in a module, it will be resolved from the DI container (allowing constructor injection). Otherwise it is instantiated directly.

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard gets DI
})
class AdminModule {}
```

## ExecutionContext

The `ExecutionContext` passed to `canActivate` provides access to the current request and handler metadata:

```typescript
interface ExecutionContext {
  /** Controller class */
  getClass<T = any>(): T;
  /** Route handler function */
  getHandler(): (...args: unknown[]) => unknown;
  /** All handler arguments */
  getArgs<T extends any[] = any[]>(): T;
  /** Single argument by index */
  getArgByIndex<T = any>(index: number): T;
  /** Context type — "http" for HTTP routes */
  getType<T extends string = string>(): T;
  /** Switch to HTTP context */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Web API Request object */
  getRequest<T = any>(): T;
  /** Elysia context (contains set.status, set.headers, etc.) */
  getResponse<T = any>(): T;
}
```

### Accessing the raw request

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### Accessing the Elysia context (status, headers, cookies)

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## Request Pipeline

Guards run **after** the controller and handler are resolved, **before** interceptors and the handler itself:

```
Request → Controller resolved → Guards → Interceptors → Handler → Response
```
