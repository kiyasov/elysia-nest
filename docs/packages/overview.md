---
title: Packages Overview
icon: layout-grid
description: Optional extension modules for @kiyasov/elysia-nest
---

@kiyasov/elysia-nest ships a set of optional packages that extend the core framework. Install only what you need.

## Available Packages

| Package | Description | Peer Dependencies |
|---------|-------------|-------------------|
| `@kiyasov/elysia-nest/scheduler` | Cron jobs, intervals, timeouts | — |
| `@kiyasov/elysia-nest/microservices` | Multi-transport microservices | `ioredis` (optional), `amqplib` (optional) |
| `@kiyasov/elysia-nest/apollo` | Apollo GraphQL code-first | `@apollo/server`, `graphql` |
| `@kiyasov/elysia-nest/passport` | Passport.js strategies | `passport` |
| `@kiyasov/elysia-nest/testing` | Isolated test modules | — |
| `@kiyasov/elysia-nest/cache` | Response caching with decorators | `cache-manager` |
| `@kiyasov/elysia-nest/rabbitmq` | Advanced RabbitMQ messaging | `amqplib` |
| `@kiyasov/elysia-nest/graphql-pubsub` | Redis PubSub for GraphQL subscriptions | `ioredis` |

## Installation

All subpaths are part of the single `@kiyasov/elysia-nest` package. Install it once, then add only the peer dependencies you need:

```bash
# Core (required)
bun add @kiyasov/elysia-nest elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport authentication
bun add passport

# Cache manager
bun add cache-manager

# RabbitMQ / microservices (RabbitMQ transport)
bun add amqplib

# Microservices (Redis transport) / GraphQL PubSub
bun add ioredis
```

## Import Paths

All subpaths are available directly from `@kiyasov/elysia-nest`:

```typescript
import { ScheduleModule } from "@kiyasov/elysia-nest/scheduler";
import { Transport } from "@kiyasov/elysia-nest/microservices";
import { Resolver, Query } from "@kiyasov/elysia-nest/apollo";
import { AuthGuard } from "@kiyasov/elysia-nest/passport";
import { Test } from "@kiyasov/elysia-nest/testing";
import { CacheModule } from "@kiyasov/elysia-nest/cache";
import { RabbitMQModule } from "@kiyasov/elysia-nest/rabbitmq";
import { GraphQLPubSubModule } from "@kiyasov/elysia-nest/graphql-pubsub";
```
