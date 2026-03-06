<div align="center">

# elysia-nest

**Modular framework with decorators, dependency injection, modules, and lifecycle hooks for [Elysia](https://elysiajs.com/).**

[![npm version](https://img.shields.io/npm/v/@kiyasov/elysia-nest?style=flat-square&color=cb3837&logo=npm)](https://www.npmjs.com/package/@kiyasov/elysia-nest)
[![npm downloads](https://img.shields.io/npm/dm/@kiyasov/elysia-nest?style=flat-square&color=cb3837&logo=npm)](https://www.npmjs.com/package/@kiyasov/elysia-nest)
[![GitHub stars](https://img.shields.io/github/stars/kiyasov/elysia-nest?style=flat-square&logo=github)](https://github.com/kiyasov/elysia-nest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/kiyasov/elysia-nest/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/status-active%20development-orange?style=flat-square)](https://github.com/kiyasov/elysia-nest)

[Documentation](https://kiyasov.github.io/elysia-nest/) · [npm](https://www.npmjs.com/package/@kiyasov/elysia-nest) · [GitHub](https://github.com/kiyasov/elysia-nest)

</div>

---

## Features

- **Decorators** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, and more
- **Dependency Injection** — constructor-based DI with singleton, transient, and request scopes
- **Modules** — encapsulate controllers, providers, and imports
- **Lifecycle Hooks** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`
- **Guards, Interceptors, Pipes** — request pipeline extensibility
- **Middleware** — class-based and functional
- **Exception Handling** — built-in HTTP exceptions and custom filters
- **Swagger** — automatic OpenAPI documentation from decorators

## Installation

Requires [Elysia](https://elysiajs.com/) as a peer dependency.

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

## Packages

All subpath exports are part of the single `@kiyasov/elysia-nest` package.

| Import path | Description |
|-------------|-------------|
| `@kiyasov/elysia-nest/scheduler` | Cron jobs, intervals, and timeouts |
| `@kiyasov/elysia-nest/microservices` | Redis, RabbitMQ, TCP transports |
| `@kiyasov/elysia-nest/apollo` | Apollo GraphQL code-first |
| `@kiyasov/elysia-nest/passport` | Passport.js authentication |
| `@kiyasov/elysia-nest/testing` | Isolated test modules with provider overrides |
| `@kiyasov/elysia-nest/cache` | Response caching with decorators |
| `@kiyasov/elysia-nest/rabbitmq` | Advanced RabbitMQ messaging |
| `@kiyasov/elysia-nest/graphql-pubsub` | Redis PubSub for GraphQL subscriptions |

## Documentation

Full documentation is available at **[kiyasov.github.io/elysia-nest](https://kiyasov.github.io/elysia-nest/)** (powered by [VitePress](https://vitepress.dev/)).

To run docs locally:

```bash
bun run docs:dev
```

## License

[MIT](https://github.com/kiyasov/elysia-nest/blob/main/LICENSE) © [Islam Kiiasov](https://github.com/kiyasov)
