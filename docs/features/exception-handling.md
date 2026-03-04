---
title: Exception Handling
icon: circle-alert
description: Handle errors with built-in HTTP exceptions
---

@kiyasov/elysia-nest provides built-in exception classes that automatically produce structured error responses.

## Built-In Exceptions

```typescript
import {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from "@kiyasov/elysia-nest";
```

## Usage

Throw exceptions from controller methods or services:

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

The framework catches the exception and returns:

```json
{
  "statusCode": 404,
  "message": "User 123 not found"
}
```

## HttpException

The base class for all HTTP exceptions:

```typescript
throw new HttpException("Something went wrong", 500);

// Or with a response object
throw new HttpException({ message: "Validation failed", errors: [] }, 422);
```

## Convenience Exceptions

| Exception | Status Code |
|-----------|-------------|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |

## Custom Exceptions

Extend `HttpException` to create your own:

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

## Exception Filters

Exception filters let you intercept and transform thrown exceptions globally.

### Defining a Filter

Implement the `ExceptionFilter` interface and use `@Catch()` to specify which exception types to handle:

```typescript
import { Catch, ExceptionFilter, ExceptionContext, HttpException } from "@kiyasov/elysia-nest";

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

Use `@Catch()` with no arguments to catch all errors:

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

### Registering Filters

Register a global exception filter using the `APP_FILTER` token in the root module's `providers`:

```typescript
import { Module, APP_FILTER } from "@kiyasov/elysia-nest";

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

The context object passed to `catch()` contains:

```typescript
interface ExceptionContext {
  request: Request;
  response: any;
  set: { status: number; headers: Record<string, string> };
  path: string;
  method: string;
}
```
