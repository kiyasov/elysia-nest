---
title: Introduction
description: A modular, decorator-driven framework built on top of Elysia
---

# @kiyasov/elysia-nest

**@kiyasov/elysia-nest** is a modular, decorator-driven framework built on top of [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/). It provides decorators, dependency injection, modules, and lifecycle hooks for building structured server-side applications.

::: warning
@kiyasov/elysia-nest is under active development. APIs may change before the stable release.
:::

## Why @kiyasov/elysia-nest?

Elysia is one of the fastest Bun-native HTTP frameworks. @kiyasov/elysia-nest adds a structured, modular architecture on top of it — without sacrificing Elysia's performance.

- **Decorators** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, and more
- **Dependency Injection** — constructor-based DI with singleton, transient, and request scopes
- **Modules** — encapsulate controllers, providers, and imports into cohesive units
- **Lifecycle Hooks** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, and others
- **Guards, Interceptors, Pipes** — request pipeline extensibility
- **Middleware** — class-based and functional middleware support
- **Exception Handling** — built-in HTTP exceptions with automatic error responses
- **TypeBox validation** — schema-based request validation via Elysia's native TypeBox integration

## Packages

Beyond the core, @kiyasov/elysia-nest ships optional packages:

| Package | Description |
|---------|-------------|
| `@kiyasov/elysia-nest/scheduler` | Cron jobs, intervals, and timeouts |
| `@kiyasov/elysia-nest/microservices` | Redis, RabbitMQ, TCP transports |
| `@kiyasov/elysia-nest/apollo` | Apollo GraphQL code-first integration |
| `@kiyasov/elysia-nest/passport` | Passport.js authentication strategies |
| `@kiyasov/elysia-nest/testing` | Isolated test modules with provider overrides |
| `@kiyasov/elysia-nest/cache` | HTTP response caching with decorators |
| `@kiyasov/elysia-nest/rabbitmq` | Advanced RabbitMQ messaging |
| `@kiyasov/elysia-nest/graphql-pubsub` | Redis PubSub for GraphQL subscriptions |

## Quick Example

```typescript
import { createElysiaApplication, Controller, Get, Module, Injectable, Inject } from "@kiyasov/elysia-nest";

@Injectable()
class GreetService {
  hello() {
    return { message: "Hello from @kiyasov/elysia-nest!" };
  }
}

@Controller("/greet")
class GreetController {
  constructor(@Inject(GreetService) private greet: GreetService) {}

  @Get("/")
  sayHello() {
    return this.greet.hello();
  }
}

@Module({
  controllers: [GreetController],
  providers: [GreetService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Next Steps

- [Installation](/getting-started/installation) — Install @kiyasov/elysia-nest and its peer dependencies.
- [Quick Start](/getting-started/quick-start) — Build your first CRUD app in 5 minutes.
- [Modules](/core-concepts/modules) — Learn how modules organize your application.
- [Dependency Injection](/features/dependency-injection) — Constructor-based DI with multiple scopes.
