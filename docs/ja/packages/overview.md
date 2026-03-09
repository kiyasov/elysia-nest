---
title: パッケージ概要
icon: layout-grid
description: nestelia のオプション拡張モジュール
---

nestelia はコアフレームワークを拡張するオプションのパッケージセットを提供します。必要なものだけインストールしてください。

## 利用可能なパッケージ

| パッケージ | 説明 | ピア依存関係 |
|---------|-------------|-------------------|
| `nestelia/scheduler` | Cron ジョブ、インターバル、タイムアウト | — |
| `nestelia/microservices` | マルチトランスポートマイクロサービス | `ioredis` (任意)、`amqplib` (任意) |
| `nestelia/apollo` | Apollo GraphQL コードファースト | `@apollo/server`、`graphql` |
| `nestelia/passport` | Passport.js ストラテジー | `passport` |
| `nestelia/testing` | 隔離テストモジュール | — |
| `nestelia/cache` | デコレータによるレスポンスキャッシュ | `cache-manager` |
| `nestelia/rabbitmq` | 高度な RabbitMQ メッセージング | `amqplib` |
| `nestelia/graphql-pubsub` | GraphQL サブスクリプション用 Redis PubSub | `ioredis` |

## インストール

すべてのサブパスは単一の `nestelia` パッケージの一部です。一度インストールして、必要なピア依存関係だけ追加します:

```bash
# コア (必須)
bun add nestelia elysia

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport 認証
bun add passport

# キャッシュマネージャー
bun add cache-manager

# RabbitMQ / マイクロサービス (RabbitMQ トランスポート)
bun add amqplib

# マイクロサービス (Redis トランスポート) / GraphQL PubSub
bun add ioredis
```

## インポートパス

すべてのサブパスは `nestelia` から直接利用できます:

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
