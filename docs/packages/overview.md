---
title: Packages Overview
icon: layout-grid
description: Optional extension modules for nestelia
---

nestelia ships a set of optional packages that extend the core framework. Install only what you need.

## Available Packages

| Package | Description | Peer Dependencies |
|---------|-------------|-------------------|
| `nestelia/scheduler` | Cron jobs, intervals, timeouts | — |
| `nestelia/microservices` | Multi-transport microservices | `ioredis` (optional), `amqplib` (optional) |
| `nestelia/apollo` | Apollo GraphQL code-first | `@apollo/server`, `graphql` |
| `nestelia/passport` | Passport.js strategies | `passport` |
| `nestelia/testing` | Isolated test modules | — |
| `nestelia/cache` | Response caching with decorators | `cache-manager` |
| `nestelia/rabbitmq` | Advanced RabbitMQ messaging | `amqplib` |
| `nestelia/graphql-pubsub` | Redis PubSub for GraphQL subscriptions | `ioredis` |
| `nestelia/drizzle` | Type-safe SQL ORM via drizzle-orm | `drizzle-orm` |

## Installation

All subpaths are part of the single `nestelia` package. Install it once, then add only the peer dependencies you need:

```bash
# Core (required)
bun add nestelia elysia

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

All subpaths are available directly from `nestelia`:

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
