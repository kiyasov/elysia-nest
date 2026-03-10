---
title: Visão Geral dos Pacotes
icon: layout-grid
description: Módulos de extensão opcionais para nestelia
---

O nestelia fornece um conjunto de pacotes opcionais que estendem o framework core. Instale apenas o que você precisar.

## Pacotes Disponíveis

| Pacote | Descrição | Dependências Peer |
|--------|-----------|-------------------|
| `nestelia/scheduler` | Cron jobs, intervalos, timeouts | — |
| `nestelia/microservices` | Microserviços multi-transporte | `ioredis` (opcional), `amqplib` (opcional) |
| `nestelia/apollo` | Apollo GraphQL code-first | `@apollo/server`, `graphql` |
| `nestelia/passport` | Estratégias Passport.js | `passport` |
| `nestelia/testing` | Módulos de teste isolados | — |
| `nestelia/cache` | Cache de respostas com decoradores | `cache-manager` |
| `nestelia/rabbitmq` | Mensageria avançada com RabbitMQ | `amqplib` |
| `nestelia/graphql-pubsub` | Redis PubSub para subscriptions GraphQL | `ioredis` |
| `nestelia/drizzle` | Drizzle ORM — type-safe SQL | `drizzle-orm` |

## Instalação

Todos os subpaths fazem parte do pacote único `nestelia`. Instale-o uma vez e adicione apenas as dependências peer que você precisar:

```bash
# Core (obrigatório)
bun add nestelia elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Autenticação Passport
bun add passport

# Cache manager
bun add cache-manager

# RabbitMQ / microserviços (transporte RabbitMQ)
bun add amqplib

# Microserviços (transporte Redis) / GraphQL PubSub
bun add ioredis
```

## Caminhos de Importação

Todos os subpaths estão disponíveis diretamente do `nestelia`:

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
