# @kiyasov/elysia-nest

> Modular framework with decorators, dependency injection, modules, and lifecycle hooks for Elysia.

![Under Active Development](https://img.shields.io/badge/status-under%20active%20development-orange)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Decorators** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, and more
- **Dependency Injection** — constructor-based DI with singleton, transient, and request scopes
- **Modules** — encapsulate controllers, providers, and imports
- **Lifecycle Hooks** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`
- **Guards, Interceptors, Pipes** — request pipeline extensibility
- **Middleware** — class-based and functional
- **Exception Handling** — built-in HTTP exceptions
- **Swagger** — automatic OpenAPI documentation from decorators

## Packages

| Subpath | Description |
|---------|-------------|
| `@kiyasov/elysia-nest/scheduler` | Cron jobs, intervals, and timeouts |
| `@kiyasov/elysia-nest/microservices` | Redis, RabbitMQ, TCP transports |
| `@kiyasov/elysia-nest/apollo` | Apollo GraphQL code-first |
| `@kiyasov/elysia-nest/passport` | Passport.js authentication |
| `@kiyasov/elysia-nest/testing` | Isolated test modules with provider overrides |
| `@kiyasov/elysia-nest/cache` | Response caching with decorators |
| `@kiyasov/elysia-nest/rabbitmq` | Advanced RabbitMQ messaging |
| `@kiyasov/elysia-nest/graphql-pubsub` | Redis PubSub for GraphQL subscriptions |

## Installation

```bash
bun add @kiyasov/elysia-nest elysia
```

## Quick Start

```typescript
import "reflect-metadata";
import { Controller, Get, Injectable, Module, createElysiaApplication } from "@kiyasov/elysia-nest";

@Injectable()
class GreetingService {
  greet(name: string) {
    return `Hello, ${name}!`;
  }
}

@Controller("/")
class AppController {
  constructor(private readonly greeting: GreetingService) {}

  @Get("/hello/:name")
  hello(@Param("name") name: string) {
    return this.greeting.greet(name);
  }
}

@Module({
  controllers: [AppController],
  providers: [GreetingService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
```

## Documentation

Full documentation is available at [https://kiyasov.github.io/elysia-nest/](https://kiyasov.github.io/elysia-nest/) (powered by [VitePress](https://vitepress.dev/)).

To run docs locally:

```bash
bun run docs:dev
```

## License

MIT
