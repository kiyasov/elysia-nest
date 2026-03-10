---
title: Обзор пакетов
icon: layout-grid
description: Опциональные расширения для nestelia
---

nestelia поставляется с набором опциональных пакетов, расширяющих базовый фреймворк. Устанавливайте только то, что вам нужно.

## Доступные пакеты

| Пакет | Описание | Peer Dependencies |
|---------|-------------|-------------------|
| `nestelia/scheduler` | Cron-задачи, интервалы, таймауты | — |
| `nestelia/microservices` | Microservices с несколькими транспортами | `ioredis` (опционально), `amqplib` (опционально) |
| `nestelia/apollo` | Code-first Apollo GraphQL | `@apollo/server`, `graphql` |
| `nestelia/passport` | Стратегии Passport.js | `passport` |
| `nestelia/testing` | Изолированные тестовые modules | — |
| `nestelia/cache` | Кэширование ответов с декораторами | `cache-manager` |
| `nestelia/rabbitmq` | Расширенный обмен сообщениями RabbitMQ | `amqplib` |
| `nestelia/graphql-pubsub` | Redis PubSub для GraphQL subscriptions | `ioredis` |
| `nestelia/drizzle` | Типобезопасная SQL ORM через drizzle-orm | `drizzle-orm` |

## Установка

Все subpath-пути являются частью единого пакета `nestelia`. Установите его один раз, затем добавьте только нужные peer dependencies:

```bash
# Core (обязательно)
bun add nestelia elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Аутентификация Passport
bun add passport

# Cache manager
bun add cache-manager

# RabbitMQ / microservices (транспорт RabbitMQ)
bun add amqplib

# Microservices (транспорт Redis) / GraphQL PubSub
bun add ioredis
```

## Пути импорта

Все subpath-пути доступны напрямую из `nestelia`:

```typescript
import { ScheduleModule } from "nestelia/scheduler";
import { Transport } from "nestelia/microservices";
import { Resolver, Query } from "nestelia/apollo";
import { AuthGuard } from "nestelia/passport";
import { Test } from "nestelia/testing";
import { CacheModule } from "nestelia/cache";
import { RabbitMQModule } from "nestelia/rabbitmq";
import { GraphQLPubSubModule } from "nestelia/graphql-pubsub";
import { DrizzleModule } from "nestelia/drizzle";
```