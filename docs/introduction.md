---
title: Introduction
description: A modular, decorator-driven framework built on top of Elysia
---

# nestelia

**nestelia** is a modular, decorator-driven framework built on top of [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/). It provides decorators, dependency injection, modules, and lifecycle hooks for building structured server-side applications.

::: warning
nestelia is under active development. APIs may change before the stable release.
:::

## Why nestelia?

Elysia is one of the fastest Bun-native HTTP frameworks. nestelia adds a structured, modular architecture on top of it — without sacrificing Elysia's performance.

- **Decorators** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, and more
- **Dependency Injection** — constructor-based DI with singleton, transient, and request scopes
- **Modules** — encapsulate controllers, providers, and imports into cohesive units
- **Lifecycle Hooks** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, and others
- **Guards, Interceptors, Pipes** — request pipeline extensibility
- **Middleware** — class-based and functional middleware support
- **Exception Handling** — built-in HTTP exceptions with automatic error responses
- **TypeBox validation** — schema-based request validation via Elysia's native TypeBox integration

## Packages

Beyond the core, nestelia ships optional packages:

| Package | Description |
|---------|-------------|
| `nestelia/scheduler` | Cron jobs, intervals, and timeouts |
| `nestelia/microservices` | Redis, RabbitMQ, TCP transports |
| `nestelia/apollo` | Apollo GraphQL code-first integration |
| `nestelia/passport` | Passport.js authentication strategies |
| `nestelia/testing` | Isolated test modules with provider overrides |
| `nestelia/cache` | HTTP response caching with decorators |
| `nestelia/rabbitmq` | Advanced RabbitMQ messaging |
| `nestelia/graphql-pubsub` | Redis PubSub for GraphQL subscriptions |

## Quick Example

```typescript
import { createElysiaApplication, Controller, Get, Module, Injectable, Inject } from "nestelia";

@Injectable()
class GreetService {
  hello() {
    return { message: "Hello from nestelia!" };
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

## Claude Code Skill

A [Claude Code](https://claude.ai/claude-code) skill is available for nestelia. It provides scaffolding templates, decorator usage, and best practices directly in your AI assistant.

```bash
npx skills add nestelia/nestelia
```

Once installed, Claude Code will automatically use the correct patterns when working with `nestelia`.

## Next Steps

- [Installation](/getting-started/installation) — Install nestelia and its peer dependencies.
- [Quick Start](/getting-started/quick-start) — Build your first CRUD app in 5 minutes.
- [Modules](/core-concepts/modules) — Learn how modules organize your application.
- [Dependency Injection](/features/dependency-injection) — Constructor-based DI with multiple scopes.
