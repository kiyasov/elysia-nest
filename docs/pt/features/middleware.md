---
title: Middleware
icon: layers
description: Adicione lógica transversal com middleware baseado em classe e funcional
---

Middleware é executado antes do handler de rota e pode modificar a requisição, a resposta ou interromper o pipeline.

## Middleware Baseado em Classe

Crie uma classe que implemente `ElysiaNestMiddleware`:

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

Registre-o nos arrays `providers` e `middlewares` do módulo:

```typescript
@Module({
  controllers: [AppController],
  providers: [LoggerMiddleware],
  middlewares: [LoggerMiddleware],
})
class AppModule {}
```

Middleware baseado em classe é resolvido pelo container de DI, portanto pode injetar outros services:

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

## Middleware Funcional

Para casos mais simples, use funções de plugin do Elysia diretamente:

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

## Ordem de Execução

O middleware é executado na ordem em que está listado no array `middlewares`, antes de qualquer handler de rota ser executado. O middleware baseado em classe de módulos importados é executado antes do middleware do módulo atual.
