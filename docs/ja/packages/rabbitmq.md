---
title: RabbitMQ
icon: mail
description: デコレータによる高度な RabbitMQ メッセージング
---

RabbitMQ パッケージは、サブスクリプション、RPC、リトライ、デッドレターキュー、バッチ処理をサポートするデコレータ駆動の RabbitMQ メッセージングアプローチを提供します。

## インストール

```bash
bun add amqplib
```

## セットアップ

```typescript
import { Module } from "nestelia";
import { RabbitMQModule } from "nestelia/rabbitmq";

@Module({
  imports: [
    RabbitMQModule.forRoot({
      urls: ["amqp://localhost:5672"],
      queuePrefix: "myapp",
      exchangePrefix: "myapp",
      prefetchCount: 10,
    }),
  ],
})
class AppModule {}
```

### 非同期設定

```typescript
import { RabbitMQModule } from "nestelia/rabbitmq";

RabbitMQModule.forRootAsync({
  useFactory: async (config: ConfigService) => ({
    urls: [config.get("RABBITMQ_URL")],
    queuePrefix: config.get("RABBITMQ_QUEUE_PREFIX"),
    prefetchCount: config.get("RABBITMQ_PREFETCH", 10),
  }),
  inject: [ConfigService],
})
```

## メッセージのサブスクライブ

```typescript
import { Injectable } from "nestelia";
import { RabbitSubscribe, RabbitMQMessage } from "nestelia/rabbitmq";

@Injectable()
class OrdersHandler {
  @RabbitSubscribe({
    exchange: "orders",
    routingKey: "order.created",
    queue: "orders-created-queue",
  })
  async handleOrderCreated(message: RabbitMQMessage<Order>) {
    console.log("Order created:", message.content);
    message.ack();
  }
}
```

## RPC パターン

```typescript
import { RabbitRPC } from "nestelia/rabbitmq";

@RabbitRPC({
  exchange: "rpc",
  routingKey: "orders.calculate-total",
  queue: "orders-rpc-queue",
})
async calculateTotal(data: { items: { price: number; qty: number }[] }) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total }; // 呼び出し元に返される
}
```

## メッセージのパブリッシュ

```typescript
import { Injectable } from "nestelia";
import { RabbitMQService } from "nestelia/rabbitmq";

@Injectable()
class OrdersService {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  async createOrder(orderData: CreateOrderDto) {
    const order = await this.repository.save(orderData);

    await this.rabbitMQ.publish("orders", "order.created", {
      id: order.id,
      amount: order.total,
      status: "pending",
    });

    return order;
  }
}
```

## 高度な機能

### リトライ

```typescript
import { RabbitSubscribe, RabbitRetry } from "nestelia/rabbitmq";

@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.process",
  queue: "orders-process-queue",
})
@RabbitRetry(5, 10000) // 5 回試行、10 秒の遅延
async processOrder(message: RabbitMQMessage<Order>) {
  // 失敗時にリトライ
}
```

### デッドレターキュー

```typescript
@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.critical",
  queue: "orders-critical-queue",
})
@RabbitDLQ("dlx.exchange", "failed.orders")
async criticalOperation(message: RabbitMQMessage<Order>) {
  // 失敗したメッセージは DLQ に送られる
}
```

### バッチ処理

```typescript
@RabbitSubscribe({
  exchange: "logs",
  routingKey: "log.entry",
  queue: "logs-queue",
})
@RabbitBatch(100, 5000) // 100 件のメッセージまたは 5 秒のタイムアウト
async processLogs(messages: RabbitMQMessage<LogEntry>[]) {
  await this.logRepository.insertMany(messages.map((m) => m.content));
  messages.forEach((m) => m.ack());
}
```

### 遅延メッセージ

[rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange) プラグインが必要です。

`x-delayed-message` エクスチェンジを宣言し、メッセージヘッダーで `x-delay`（ミリ秒）を渡します:

```typescript
RabbitMQModule.forRoot({
  urls: ["amqp://localhost:5672"],
  exchanges: [
    {
      name: "delayed",
      type: "x-delayed-message",
      options: {
        durable: true,
        arguments: { "x-delayed-type": "direct" },
      },
      createIfNotExists: true,
    },
  ],
})
```

```typescript
await this.rabbitMQ.publish(
  "delayed",
  "order.reminder",
  { orderId: 42 },
  { headers: { "x-delay": 30_000 } }, // 30 秒後に配信
);
```

### 複数コネクション

```typescript
@RabbitConnection("analytics")
@Injectable()
class AnalyticsHandler {
  @RabbitSubscribe({
    exchange: "events",
    routingKey: "user.action",
    queue: "analytics-queue",
  })
  async handleEvent(message: RabbitMQMessage<Event>) {
    // "analytics" コネクションを使用
  }
}
```

## デコレータ

| デコレータ | 説明 |
|-----------|-------------|
| `@RabbitSubscribe()` | キューメッセージをサブスクライブ |
| `@RabbitRPC()` | RPC ハンドラー |
| `@RabbitRetry(attempts, delay)` | 失敗時のリトライ |
| `@RabbitDLQ(exchange, routingKey)` | デッドレターキュー |
| `@RabbitBatch(size, timeout)` | バッチ処理 |
| `@RabbitConnection(name)` | 特定のコネクションを使用 |
| `@RabbitPriority(level)` | メッセージ優先度 |
| `@RabbitTTL(ms)` | 有効期限 |

## RabbitMQService API

```typescript
class RabbitMQService {
  connect(): Promise<void>
  disconnect(): Promise<void>
  isConnectionReady(): boolean

  assertExchange(config): Promise<void>
  assertQueue(config): Promise<void>

  publish<T>(exchange, routingKey, message, options?): Promise<boolean>
  sendToQueue<T>(queue, message, options?): Promise<boolean>
  subscribe<T>(queue, handler): Promise<void>

  getChannel(): Channel | null
  getConnection(): Connection | null
}
```
