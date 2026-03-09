---
title: Manejo de Excepciones
icon: circle-alert
description: Maneja errores con excepciones HTTP integradas
---

nestelia proporciona clases de excepción integradas que producen automáticamente respuestas de error estructuradas.

## Excepciones Integradas

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

Lanza excepciones desde los métodos del controlador o de los servicios:

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

El framework captura la excepción y devuelve:

```json
{
  "statusCode": 404,
  "message": "User 123 not found"
}
```

## HttpException

La clase base para todas las excepciones HTTP:

```typescript
throw new HttpException("Something went wrong", 500);

// O con un objeto de respuesta
throw new HttpException({ message: "Validation failed", errors: [] }, 422);
```

## Excepciones de Conveniencia

| Excepción | Código de Estado |
|-----------|-----------------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |

## Excepciones Personalizadas

Extiende `HttpException` para crear las tuyas propias:

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

## Filtros de Excepciones

Los filtros de excepciones te permiten interceptar y transformar las excepciones lanzadas de forma global.

### Definir un Filtro

Implementa la interfaz `ExceptionFilter` y usa `@Catch()` para especificar qué tipos de excepción manejar:

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

Usa `@Catch()` sin argumentos para capturar todos los errores:

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

### Registrar Filtros

Registra un filtro de excepción global usando el token `APP_FILTER` en los `providers` del módulo raíz:

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

El objeto de contexto pasado a `catch()` contiene:

```typescript
interface ExceptionContext {
  request: Request;
  response: any;
  set: { status: number; headers: Record<string, string> };
  path: string;
  method: string;
}
```
