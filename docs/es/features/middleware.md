---
title: Middleware
icon: layers
description: Agrega lógica transversal con middleware basado en clases y funcional
---

El middleware se ejecuta antes del manejador de ruta y puede modificar la solicitud, la respuesta o cortocircuitar el pipeline.

## Middleware Basado en Clases

Crea una clase que implemente `ElysiaNestMiddleware`:

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

Regístralo en los arreglos `providers` y `middlewares` del módulo:

```typescript
@Module({
  controllers: [AppController],
  providers: [LoggerMiddleware],
  middlewares: [LoggerMiddleware],
})
class AppModule {}
```

El middleware basado en clases se resuelve desde el contenedor de DI, por lo que puede inyectar otros servicios:

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

Para casos más simples, usa funciones de plugin de Elysia directamente:

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

## Orden de Ejecución

El middleware se ejecuta en el orden en que aparece en el arreglo `middlewares`, antes de que se ejecute cualquier manejador de ruta. El middleware basado en clases de los módulos importados se ejecuta antes que el middleware del módulo actual.
