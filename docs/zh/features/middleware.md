---
title: 中间件
icon: layers
description: 使用基于类和函数式中间件添加横切逻辑
---

中间件在路由处理器之前运行，可以修改请求、响应，或短路管道。

## 基于类的中间件

创建一个实现 `ElysiaNestMiddleware` 的类：

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

在模块的 `providers` 和 `middlewares` 数组中注册它：

```typescript
@Module({
  controllers: [AppController],
  providers: [LoggerMiddleware],
  middlewares: [LoggerMiddleware],
})
class AppModule {}
```

基于类的中间件从 DI 容器中解析，因此可以注入其他服务：

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

## 函数式中间件

对于更简单的情况，直接使用 Elysia 插件函数：

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

## 执行顺序

中间件按照 `middlewares` 数组中列出的顺序运行，在任何路由处理器执行之前。来自导入模块的基于类的中间件在当前模块的中间件之前运行。
