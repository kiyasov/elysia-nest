---
name: nestelia
description: Scaffold modules, controllers, services, guards, interceptors, and more for the nestelia framework — NestJS-style decorators and DI on top of Elysia.
---

# nestelia Skill

## When to Use This Skill

TRIGGER this skill when the user wants to:
- Scaffold a new module, controller, or service for **nestelia** (`nestelia`)
- Create a guard, interceptor, pipe, or exception filter
- Use `nestelia` decorators correctly
- Set up the app entry point with `createElysiaApplication`
- Use microservices, Apollo GraphQL, caching, or passport with nestelia

---

## Project Setup

```bash
bun add nestelia elysia reflect-metadata
```

`tsconfig.json` must have:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Entry point must import `reflect-metadata` first:
```typescript
import "reflect-metadata";
```

---

## Module Scaffold

When asked to create a module for a resource (e.g., `users`), generate these files:

### `users.service.ts`
```typescript
import { Injectable } from "nestelia";

@Injectable()
export class UsersService {
  private users: { id: string; name: string }[] = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((u) => u.id === id) ?? null;
  }

  create(data: { name: string }) {
    const user = { id: crypto.randomUUID(), ...data };
    this.users.push(user);
    return user;
  }
}
```

### `users.controller.ts`
```typescript
import { Controller, Get, Post, Delete } from "nestelia";
import { Body, Params } from "nestelia";
import { UsersService } from "./users.service";

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  findAll() {
    return this.usersService.findAll();
  }

  @Get("/:id")
  findOne(@Params("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post("/")
  create(@Body() body: { name: string }) {
    return this.usersService.create(body);
  }
}
```

### `users.module.ts`
```typescript
import { Module } from "nestelia";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### `app.module.ts`
```typescript
import { Module } from "nestelia";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

### `main.ts`
```typescript
import "reflect-metadata";
import { createElysiaApplication } from "nestelia";
import { AppModule } from "./app.module";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
```

---

## Decorators Reference

### HTTP Method Decorators
```typescript
import { Get, Post, Put, Patch, Delete, All } from "nestelia";

@Get("/path")
@Post("/path")
@Put("/:id")
@Patch("/:id")
@Delete("/:id")
```

### Parameter Decorators

**Class-transformer/class-validator based (`param.decorators`):**
```typescript
import { Body, Params, Query, Form, File, Files } from "nestelia";

// With DTO (validates via class-validator):
@Post("/")
create(@Body(CreateUserDto) dto: CreateUserDto) {}

// Without DTO (raw value):
@Get("/:id")
findOne(@Params("id") id: string) {}

@Get("/")
search(@Query("q") q: string) {}

// All params object:
@Get("/:category/:id")
findInCategory(@Params() params: { category: string; id: string }) {}

// File upload:
@Post("/upload")
upload(@File("avatar", { maxSize: 5_000_000, allowedMimeTypes: ["image/jpeg"] }) file: File) {}

@Post("/uploads")
uploadMany(@Files("photos", { maxFiles: 10 }) files: File[]) {}
```

**TypeBox-based (schema validation at Elysia level, `http.decorators`):**
```typescript
import { Body, Param, Query } from "nestelia";
import { Type } from "@sinclair/typebox";

const CreateUserSchema = Type.Object({ name: Type.String() });

@Post("/")
create(@Body(CreateUserSchema) body: { name: string }) {}
```

**Other context decorators:**
```typescript
import { Req, Res, Ctx, Headers, Ip, Session } from "nestelia";
```

---

## Dependency Injection

```typescript
import { Injectable, Inject } from "nestelia";

// Singleton (default)
@Injectable()
export class AppService {}

// Transient scope
@Injectable({ scope: "transient" })
export class RequestService {}

// Custom token injection
const CONFIG_TOKEN = "CONFIG";

@Module({
  providers: [
    { provide: CONFIG_TOKEN, useValue: { apiKey: "secret" } },
    AppService,
  ],
})
export class AppModule {}

@Injectable()
export class AppService {
  constructor(@Inject(CONFIG_TOKEN) private config: { apiKey: string }) {}
}
```

---

## Guards

```typescript
import { Injectable, CanActivate, ExecutionContext, UseGuards } from "nestelia";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization === "Bearer secret";
  }
}

@Controller("/protected")
@UseGuards(AuthGuard)
export class ProtectedController {}
```

---

## Interceptors

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from "nestelia";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    console.log("Before...");
    const result = await next.handle();
    console.log("After...");
    return result;
  }
}

@Controller("/")
@UseInterceptors(LoggingInterceptor)
export class AppController {}
```

---

## Exception Filters

```typescript
import { Catch, ExceptionFilter, HttpException } from "nestelia";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, ctx: any) {
    return { error: exception.message, status: exception.getStatus() };
  }
}
```

Built-in exceptions: `BadRequestException`, `UnauthorizedException`, `ForbiddenException`, `NotFoundException`, `InternalServerErrorException`, `ValidationException`.

---

## Lifecycle Hooks

```typescript
import { Injectable, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy } from "nestelia";

@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy {
  onModuleInit() { console.log("Module initialized"); }
  onApplicationBootstrap() { console.log("App ready"); }
  onModuleDestroy() { console.log("Cleanup"); }
}
```

---

## Middleware

```typescript
import { Injectable, ElysiaMiddleware, UseMiddleware } from "nestelia";

@Injectable()
export class LoggerMiddleware implements ElysiaMiddleware {
  use(ctx: any, next: () => Promise<void>) {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    return next();
  }
}

@Controller("/")
@UseMiddleware(LoggerMiddleware)
export class AppController {}
```

---

## Subpackages

```typescript
// Scheduler (cron jobs)
import { Cron, Interval } from "nestelia/scheduler";

// Microservices
import { MicroservicesModule } from "nestelia/microservices";

// Apollo GraphQL
import { ApolloModule } from "nestelia/apollo";

// Passport authentication
import { PassportModule } from "nestelia/passport";

// Response caching
import { CacheModule, CacheKey } from "nestelia/cache";

// Test utilities
import { Test } from "nestelia/testing";
```

---

## Configurable Modules (forRoot/forRootAsync)

```typescript
import { ConfigurableModuleBuilder } from "nestelia";

export interface DatabaseOptions {
  url: string;
  poolSize?: number;
}

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DatabaseOptions>()
    .setClassMethodName("forRoot")
    .build();

@Module({})
export class DatabaseModule extends ConfigurableModuleClass {
  static forRoot(options: DatabaseOptions) {
    return super.forRoot(options);
  }
}

// Usage:
@Module({
  imports: [DatabaseModule.forRoot({ url: "postgres://localhost/mydb" })],
})
export class AppModule {}
```

---

## Testing

```typescript
import { Test } from "nestelia/testing";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

const module = await Test.createTestingModule({
  controllers: [UsersController],
  providers: [UsersService],
}).compile();

const service = module.get(UsersService);
```

---

## Key Rules

1. Always import `reflect-metadata` at the very top of the entry file.
2. Use `@Injectable()` on every provider (service).
3. Declare all controllers and providers in a `@Module()`.
4. Use `crypto.randomUUID()` for ID generation — never `Math.random()`.
5. `@Params` (from param.decorators) is for class-transformer/class-validator DTOs. `@Param` (from http.decorators) is for TypeBox schemas.
6. All imports come from `nestelia` (core) or subpath exports like `nestelia/cache`.
