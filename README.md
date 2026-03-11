<div align="center">

# nestelia

**Modular framework with decorators, dependency injection, modules, and lifecycle hooks for [Elysia](https://elysiajs.com/).**

[![npm version](https://img.shields.io/npm/v/nestelia?style=flat-square&color=cb3837&logo=npm)](https://www.npmjs.com/package/nestelia)
[![npm downloads](https://img.shields.io/npm/dm/nestelia?style=flat-square&color=cb3837&logo=npm)](https://www.npmjs.com/package/nestelia)
[![GitHub stars](https://img.shields.io/github/stars/nestelia/nestelia?style=flat-square&logo=github)](https://github.com/nestelia/nestelia)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://github.com/nestelia/nestelia/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/status-active%20development-orange?style=flat-square)](https://github.com/nestelia/nestelia)

[Documentation](https://nestelia.dev) · [npm](https://www.npmjs.com/package/nestelia) · [GitHub](https://github.com/nestelia/nestelia)

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
bun add nestelia elysia
```

## Quick Start

```typescript
import "reflect-metadata";
import { Controller, Get, Injectable, Module, createElysiaApplication } from "nestelia";

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

All subpath exports are part of the single `nestelia` package.

| Import path | Description |
|-------------|-------------|
| `nestelia/scheduler` | Cron jobs, intervals, and timeouts |
| `nestelia/microservices` | Redis, RabbitMQ, TCP transports |
| `nestelia/apollo` | Apollo GraphQL code-first |
| `nestelia/passport` | Passport.js authentication |
| `nestelia/testing` | Isolated test modules with provider overrides |
| `nestelia/cache` | Response caching with decorators |
| `nestelia/rabbitmq` | Advanced RabbitMQ messaging |
| `nestelia/graphql-pubsub` | Redis PubSub for GraphQL subscriptions |

## Documentation

Full documentation is available at **[nestelia.dev](https://nestelia.dev)** (powered by [VitePress](https://vitepress.dev/)).

To run docs locally:

```bash
bun run docs:dev
```

## Claude Code Skill

A [Claude Code](https://claude.ai/claude-code) skill is available for nestelia. It provides scaffolding templates, decorator usage, and best practices directly in your AI assistant.

```bash
npx skills add nestelia/nestelia
```

Once installed, Claude Code will automatically use the correct patterns when working with `nestelia`.

## License

[MIT](https://github.com/nestelia/nestelia/blob/main/LICENSE) © [Islam Kiiasov](https://github.com/kiyasov)
