---
title: RabbitMQ
icon: mail
description: 使用装饰器实现高级 RabbitMQ 消息传递
---

RabbitMQ 包提供了一种装饰器驱动的 RabbitMQ 消息传递方式，支持订阅、RPC、重试、死信队列和批量处理。

## 安装

```bash
bun add amqplib
```

## 配置

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

### 异步配置

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

## 订阅消息

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

## RPC 模式

```typescript
import { RabbitRPC } from "nestelia/rabbitmq";

@RabbitRPC({
  exchange: "rpc",
  routingKey: "orders.calculate-total",
  queue: "orders-rpc-queue",
})
async calculateTotal(data: { items: { price: number; qty: number }[] }) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total }; // 返回给调用方
}
```

## 发布消息

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

## 高级功能

### 重试

```typescript
import { RabbitSubscribe, RabbitRetry } from "nestelia/rabbitmq";

@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.process",
  queue: "orders-process-queue",
})
@RabbitRetry(5, 10000) // 5 次尝试，延迟 10 秒
async processOrder(message: RabbitMQMessage<Order>) {
  // 失败时重试
}
```

### 死信队列

```typescript
@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.critical",
  queue: "orders-critical-queue",
})
@RabbitDLQ("dlx.exchange", "failed.orders")
async criticalOperation(message: RabbitMQMessage<Order>) {
  // 失败的消息进入 DLQ
}
```

### 批量处理

```typescript
@RabbitSubscribe({
  exchange: "logs",
  routingKey: "log.entry",
  queue: "logs-queue",
})
@RabbitBatch(100, 5000) // 100 条消息或 5 秒超时
async processLogs(messages: RabbitMQMessage<LogEntry>[]) {
  await this.logRepository.insertMany(messages.map((m) => m.content));
  messages.forEach((m) => m.ack());
}
```

### 延迟消息

需要 [rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange) 插件。

声明一个 `x-delayed-message` 交换机，并在消息头中传递 `x-delay`（毫秒）：

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
  { headers: { "x-delay": 30_000 } }, // 30 秒后投递
);
```

### 多连接

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
    // 使用 "analytics" 连接
  }
}
```

## 装饰器

| 装饰器 | 描述 |
|--------|------|
| `@RabbitSubscribe()` | 订阅队列消息 |
| `@RabbitRPC()` | RPC 处理器 |
| `@RabbitRetry(attempts, delay)` | 失败时重试 |
| `@RabbitDLQ(exchange, routingKey)` | 死信队列 |
| `@RabbitBatch(size, timeout)` | 批量处理 |
| `@RabbitConnection(name)` | 使用特定连接 |
| `@RabbitPriority(level)` | 消息优先级 |
| `@RabbitTTL(ms)` | 消息存活时间 |

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
