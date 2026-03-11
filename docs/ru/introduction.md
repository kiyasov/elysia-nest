---
title: Введение
description: Модульный фреймворк на основе декораторов, построенный поверх Elysia
---

# nestelia

**nestelia** — это модульный фреймворк на основе декораторов, построенный поверх [Elysia](https://elysiajs.com/) и [Bun](https://bun.sh/). Он предоставляет decorators, dependency injection, modules и lifecycle hooks для создания структурированных серверных приложений.

::: warning
nestelia находится в стадии активной разработки. API может измениться до выхода стабильного релиза.
:::

## Зачем nestelia?

Elysia — один из самых быстрых HTTP-фреймворков, нативных для Bun. nestelia добавляет поверх него структурированную модульную архитектуру — без потери производительности Elysia.

- **Decorators** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param` и другие
- **Dependency Injection** — constructor-based DI со scope-ами singleton, transient и request
- **Modules** — объединяют controllers, providers и imports в целостные единицы
- **Lifecycle Hooks** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy` и другие
- **Guards, Interceptors, Pipes** — расширяемость конвейера обработки запросов
- **Middleware** — поддержка class-based и функционального middleware
- **Exception Handling** — встроенные HTTP-исключения с автоматическими ответами об ошибках
- **TypeBox validation** — валидация запросов на основе схем через нативную интеграцию TypeBox в Elysia

## Пакеты

Помимо ядра, nestelia поставляется с набором опциональных пакетов:

| Пакет | Описание |
|---------|-------------|
| `nestelia/scheduler` | Cron-задачи, интервалы и таймауты |
| `nestelia/microservices` | Транспорты Redis, RabbitMQ, TCP |
| `nestelia/apollo` | Code-first интеграция с Apollo GraphQL |
| `nestelia/passport` | Стратегии аутентификации Passport.js |
| `nestelia/testing` | Изолированные тестовые модули с подменой providers |
| `nestelia/cache` | Кэширование HTTP-ответов с декораторами |
| `nestelia/rabbitmq` | Расширенный обмен сообщениями через RabbitMQ |
| `nestelia/graphql-pubsub` | Redis PubSub для GraphQL subscriptions |

## Быстрый пример

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

Для nestelia доступен skill [Claude Code](https://claude.ai/claude-code). Он предоставляет шаблоны для скаффолдинга, примеры использования decorators и лучшие практики прямо в вашем AI-ассистенте.

```bash
npx skills add nestelia/nestelia
```

После установки Claude Code будет автоматически использовать корректные паттерны при работе с `nestelia`.

## Следующие шаги

- [Установка](/getting-started/installation) — установите nestelia и необходимые peer dependencies.
- [Быстрый старт](/getting-started/quick-start) — создайте своё первое CRUD-приложение за 5 минут.
- [Modules](/core-concepts/modules) — узнайте, как modules организуют ваше приложение.
- [Dependency Injection](/features/dependency-injection) — constructor-based DI с несколькими scope-ами.