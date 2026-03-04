---
title: Middleware
icon: layers
description: Add cross-cutting logic with class-based and functional middleware
---

Middleware runs before the route handler and can modify the request, response, or short-circuit the pipeline.

## Class-Based Middleware

Create a class that implements `ElysiaNestMiddleware`:

```typescript
import { Injectable, ElysiaNestMiddleware } from "@kiyasov/elysia-nest";

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

Register it in the module's `providers` and `middlewares` arrays:

```typescript
@Module({
  controllers: [AppController],
  providers: [LoggerMiddleware],
  middlewares: [LoggerMiddleware],
})
class AppModule {}
```

Class-based middleware is resolved from the DI container, so it can inject other services:

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

## Functional Middleware

For simpler cases, use Elysia plugin functions directly:

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

## Execution Order

Middleware runs in the order it is listed in the `middlewares` array, before any route handlers execute. Class-based middleware from imported modules runs before the current module's middleware.
