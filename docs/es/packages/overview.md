---
title: Resumen de Paquetes
icon: layout-grid
description: Módulos de extensión opcionales para nestelia
---

nestelia incluye un conjunto de paquetes opcionales que extienden el framework principal. Instala únicamente lo que necesites.

## Paquetes Disponibles

| Paquete | Descripción | Dependencias de Pares |
|---------|-------------|----------------------|
| `nestelia/scheduler` | Cron jobs, intervalos, timeouts | — |
| `nestelia/microservices` | Microservicios multi-transporte | `ioredis` (opcional), `amqplib` (opcional) |
| `nestelia/apollo` | Apollo GraphQL code-first | `@apollo/server`, `graphql` |
| `nestelia/passport` | Estrategias Passport.js | `passport` |
| `nestelia/testing` | Módulos de prueba aislados | — |
| `nestelia/cache` | Caché de respuestas con decoradores | `cache-manager` |
| `nestelia/rabbitmq` | Mensajería avanzada con RabbitMQ | `amqplib` |
| `nestelia/graphql-pubsub` | Redis PubSub para suscripciones GraphQL | `ioredis` |

## Instalación

Todos los subpaths forman parte del paquete único `nestelia`. Instálalo una vez y luego agrega solo las dependencias de pares que necesites:

```bash
# Núcleo (requerido)
bun add nestelia elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Autenticación con Passport
bun add passport

# Cache manager
bun add cache-manager

# RabbitMQ / microservicios (transporte RabbitMQ)
bun add amqplib

# Microservicios (transporte Redis) / GraphQL PubSub
bun add ioredis
```

## Rutas de Importación

Todos los subpaths están disponibles directamente desde `nestelia`:

```typescript
import { ScheduleModule } from "nestelia/scheduler";
import { Transport } from "nestelia/microservices";
import { Resolver, Query } from "nestelia/apollo";
import { AuthGuard } from "nestelia/passport";
import { Test } from "nestelia/testing";
import { CacheModule } from "nestelia/cache";
import { RabbitMQModule } from "nestelia/rabbitmq";
import { GraphQLPubSubModule } from "nestelia/graphql-pubsub";
```
