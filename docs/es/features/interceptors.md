---
title: Interceptores
icon: arrow-right-left
description: Agrega lógica previa al manejador con interceptores
---

Los interceptores se ejecutan antes de la ejecución del manejador de ruta. Pueden inspeccionar la solicitud, cortocircuitar la ejecución o agregar efectos secundarios como el registro de logs.

## Interfaz Interceptor

nestelia provee una interfaz de interceptor simple:

```typescript
interface Interceptor {
  intercept(context: any): Promise<boolean | void> | boolean | void;
}
```

El argumento `context` es el contexto nativo de Elysia (el mismo que `@Ctx()`).

Devolver `false` evita que el manejador de ruta se ejecute.

## Crear un Interceptor

### Interceptor de Autenticación

```typescript
import { Injectable } from "nestelia";

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(ctx: any): boolean {
    const token = ctx.request.headers.get("authorization");
    if (!token) {
      ctx.set.status = 401;
      return false; // bloquea el manejador
    }
    return true; // permite que el manejador continúe
  }
}
```

### Interceptor de Logging

```typescript
@Injectable()
class LoggingInterceptor implements Interceptor {
  intercept(ctx: any): void {
    const start = Date.now();
    console.log(`→ ${ctx.request.method} ${ctx.request.url}`);
    // Después de esto, el manejador se ejecuta
    // Nota: la lógica post-manejador requiere ResponseInterceptor
  }
}
```

## Usar Interceptores

Aplica interceptores con `@UseInterceptors()` a nivel de controlador o de método:

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

Para agregar lógica que se ejecute después del manejador, implementa `ResponseInterceptor`:

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

## Interfaz NestInterceptor

La interfaz `NestInterceptor` está exportada pero **no se ejecuta automáticamente** por el manejador de ruta. Usa `Interceptor` o `ResponseInterceptor` para el comportamiento real:

```typescript
// Disponible para importar pero no se invoca automáticamente
export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
}
```

## Múltiples Interceptores

Cuando se aplican múltiples interceptores, se ejecutan en el orden indicado. Si algún interceptor devuelve `false`, los interceptores siguientes y el manejador de ruta son omitidos:

```typescript
@Get("/admin")
@UseInterceptors(AuthInterceptor, LoggingInterceptor)
adminRoute() { /* ... */ }
```
