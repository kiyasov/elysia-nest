---
title: 扩展包概览
icon: layout-grid
description: nestelia 的可选扩展模块
---

nestelia 提供了一套可选扩展包来扩展核心框架。按需安装即可。

## 可用扩展包

| 包名 | 描述 | 对等依赖 |
|------|------|----------|
| `nestelia/scheduler` | Cron 任务、定时器、超时 | — |
| `nestelia/microservices` | 多传输微服务 | `ioredis`（可选）、`amqplib`（可选） |
| `nestelia/apollo` | Apollo GraphQL 代码优先 | `@apollo/server`、`graphql` |
| `nestelia/passport` | Passport.js 策略 | `passport` |
| `nestelia/testing` | 隔离测试模块 | — |
| `nestelia/cache` | 使用装饰器的响应缓存 | `cache-manager` |
| `nestelia/rabbitmq` | 高级 RabbitMQ 消息传递 | `amqplib` |
| `nestelia/graphql-pubsub` | 用于 GraphQL 订阅的 Redis PubSub | `ioredis` |

## 安装

所有子路径都是单个 `nestelia` 包的一部分。只需安装一次，然后添加所需的对等依赖：

```bash
# 核心（必需）
bun add nestelia elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport 认证
bun add passport

# 缓存管理器
bun add cache-manager

# RabbitMQ / 微服务（RabbitMQ 传输）
bun add amqplib

# 微服务（Redis 传输）/ GraphQL PubSub
bun add ioredis
```

## 导入路径

所有子路径都可以直接从 `nestelia` 导入：

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
