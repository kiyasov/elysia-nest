---
title: Interceptors
icon: arrow-right-left
description: Adicione lógica pré-handler com interceptors
---

Interceptors são executados antes da execução do handler de rota. Podem verificar a requisição, interromper a execução ou adicionar efeitos colaterais como logging.

## Interface Interceptor

O nestelia fornece uma interface simples de interceptor:

```typescript
interface Interceptor {
  intercept(context: any): Promise<boolean | void> | boolean | void;
}
```

O argumento `context` é o contexto bruto do Elysia (o mesmo que `@Ctx()`).

Retornar `false` impede a execução do handler de rota.

## Criando um Interceptor

### Interceptor de Autenticação

```typescript
import { Injectable } from "nestelia";

@Injectable()
class AuthInterceptor implements Interceptor {
  intercept(ctx: any): boolean {
    const token = ctx.request.headers.get("authorization");
    if (!token) {
      ctx.set.status = 401;
      return false; // bloqueia o handler
    }
    return true; // permite que o handler prossiga
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
    // Após isso, o handler é executado
    // Nota: lógica pós-handler requer ResponseInterceptor
  }
}
```

## Usando Interceptors

Aplique interceptors com `@UseInterceptors()` no nível do controller ou do método:

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

Para adicionar lógica que é executada após o handler, implemente `ResponseInterceptor`:

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

## Interface NestInterceptor

A interface `NestInterceptor` é exportada, mas **ainda não é executada** pelo handler de rota. Use `Interceptor` ou `ResponseInterceptor` para comportamento real:

```typescript
// Disponível para importação, mas não invocado automaticamente
export interface NestInterceptor<T = any, R = any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> | Promise<Observable<R>>;
}
```

## Múltiplos Interceptors

Quando múltiplos interceptors são aplicados, eles são executados na ordem listada. Se algum interceptor retornar `false`, os interceptors subsequentes e o handler de rota são ignorados:

```typescript
@Get("/admin")
@UseInterceptors(AuthInterceptor, LoggingInterceptor)
adminRoute() { /* ... */ }
```
