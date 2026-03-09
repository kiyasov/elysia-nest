---
title: Tratamento de Exceções
icon: circle-alert
description: Trate erros com exceções HTTP integradas
---

O nestelia fornece classes de exceção integradas que produzem automaticamente respostas de erro estruturadas.

## Exceções Integradas

```typescript
import {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from "nestelia";
```

## Uso

Lance exceções a partir de métodos de controller ou services:

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

O framework captura a exceção e retorna:

```json
{
  "statusCode": 404,
  "message": "User 123 not found"
}
```

## HttpException

A classe base para todas as exceções HTTP:

```typescript
throw new HttpException("Something went wrong", 500);

// Ou com um objeto de resposta
throw new HttpException({ message: "Validation failed", errors: [] }, 422);
```

## Exceções de Conveniência

| Exceção | Código de Status |
|---------|-----------------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |

## Exceções Customizadas

Estenda `HttpException` para criar as suas próprias:

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

## Filtros de Exceção

Filtros de exceção permitem interceptar e transformar exceções lançadas globalmente.

### Definindo um Filtro

Implemente a interface `ExceptionFilter` e use `@Catch()` para especificar quais tipos de exceção tratar:

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

Use `@Catch()` sem argumentos para capturar todos os erros:

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

### Registrando Filtros

Registre um filtro de exceção global usando o token `APP_FILTER` no array `providers` do módulo raiz:

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

O objeto de contexto passado para `catch()` contém:

```typescript
interface ExceptionContext {
  request: Request;
  response: any;
  set: { status: number; headers: Record<string, string> };
  path: string;
  method: string;
}
```
