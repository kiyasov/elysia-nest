---
title: 패키지 개요
icon: layout-grid
description: nestelia를 위한 선택적 확장 모듈
---

nestelia는 코어 프레임워크를 확장하는 선택적 패키지 세트를 제공합니다. 필요한 것만 설치하세요.

## 사용 가능한 패키지

| 패키지 | 설명 | 피어 의존성 |
|---------|-------------|-------------------|
| `nestelia/scheduler` | 크론 작업, 인터벌, 타임아웃 | — |
| `nestelia/microservices` | 멀티 트랜스포트 마이크로서비스 | `ioredis` (선택), `amqplib` (선택) |
| `nestelia/apollo` | Apollo GraphQL 코드 우선 | `@apollo/server`, `graphql` |
| `nestelia/passport` | Passport.js 전략 | `passport` |
| `nestelia/testing` | 격리 테스트 모듈 | — |
| `nestelia/cache` | 데코레이터를 이용한 응답 캐싱 | `cache-manager` |
| `nestelia/rabbitmq` | 고급 RabbitMQ 메시징 | `amqplib` |
| `nestelia/graphql-pubsub` | GraphQL 구독을 위한 Redis PubSub | `ioredis` |
| `nestelia/drizzle` | Drizzle ORM — type-safe SQL | `drizzle-orm` |

## 설치

모든 서브패스는 단일 `nestelia` 패키지의 일부입니다. 한 번 설치하고 필요한 피어 의존성만 추가하세요:

```bash
# 코어 (필수)
bun add nestelia elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport 인증
bun add passport

# 캐시 매니저
bun add cache-manager

# RabbitMQ / 마이크로서비스 (RabbitMQ 트랜스포트)
bun add amqplib

# 마이크로서비스 (Redis 트랜스포트) / GraphQL PubSub
bun add ioredis
```

## 임포트 경로

모든 서브패스는 `nestelia`에서 직접 사용할 수 있습니다:

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
