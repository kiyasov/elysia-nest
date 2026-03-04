---
title: RabbitMQ
icon: mail
description: Advanced RabbitMQ messaging with decorators
---

The RabbitMQ package provides a decorator-driven approach to RabbitMQ messaging with support for subscriptions, RPC, retries, dead letter queues, and batch processing.

## Installation

```bash
bun add amqplib
```

## Setup

```typescript
import { Module } from "@kiyasov/elysia-nest";
import { RabbitMQModule } from "@kiyasov/elysia-nest/rabbitmq";

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

### Async Configuration

```typescript
import { RabbitMQModule } from "@kiyasov/elysia-nest/rabbitmq";

RabbitMQModule.forRootAsync({
  useFactory: async (config: ConfigService) => ({
    urls: [config.get("RABBITMQ_URL")],
    queuePrefix: config.get("RABBITMQ_QUEUE_PREFIX"),
    prefetchCount: config.get("RABBITMQ_PREFETCH", 10),
  }),
  inject: [ConfigService],
})
```

## Subscribe to Messages

```typescript
import { Injectable } from "@kiyasov/elysia-nest";
import { RabbitSubscribe, RabbitMQMessage } from "@kiyasov/elysia-nest/rabbitmq";

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

## RPC Pattern

```typescript
import { RabbitRPC } from "@kiyasov/elysia-nest/rabbitmq";

@RabbitRPC({
  exchange: "rpc",
  routingKey: "orders.calculate-total",
  queue: "orders-rpc-queue",
})
async calculateTotal(data: { items: { price: number; qty: number }[] }) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total }; // returned to the caller
}
```

## Publishing Messages

```typescript
import { Injectable } from "@kiyasov/elysia-nest";
import { RabbitMQService } from "@kiyasov/elysia-nest/rabbitmq";

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

## Advanced Features

### Retry

```typescript
import { RabbitSubscribe, RabbitRetry } from "@kiyasov/elysia-nest/rabbitmq";

@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.process",
  queue: "orders-process-queue",
})
@RabbitRetry(5, 10000) // 5 attempts, 10s delay
async processOrder(message: RabbitMQMessage<Order>) {
  // retries on failure
}
```

### Dead Letter Queue

```typescript
@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.critical",
  queue: "orders-critical-queue",
})
@RabbitDLQ("dlx.exchange", "failed.orders")
async criticalOperation(message: RabbitMQMessage<Order>) {
  // failed messages go to DLQ
}
```

### Batch Processing

```typescript
@RabbitSubscribe({
  exchange: "logs",
  routingKey: "log.entry",
  queue: "logs-queue",
})
@RabbitBatch(100, 5000) // 100 messages or 5s timeout
async processLogs(messages: RabbitMQMessage<LogEntry>[]) {
  await this.logRepository.insertMany(messages.map((m) => m.content));
  messages.forEach((m) => m.ack());
}
```

### Delayed Messages

Requires the [rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange) plugin.

Declare an `x-delayed-message` exchange and pass `x-delay` (milliseconds) in the message headers:

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
  { headers: { "x-delay": 30_000 } }, // deliver after 30 s
);
```

### Multiple Connections

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
    // uses the "analytics" connection
  }
}
```

## Decorators

| Decorator | Description |
|-----------|-------------|
| `@RabbitSubscribe()` | Subscribe to queue messages |
| `@RabbitRPC()` | RPC handler |
| `@RabbitRetry(attempts, delay)` | Retry on failure |
| `@RabbitDLQ(exchange, routingKey)` | Dead letter queue |
| `@RabbitBatch(size, timeout)` | Batch processing |
| `@RabbitConnection(name)` | Use a specific connection |
| `@RabbitPriority(level)` | Message priority |
| `@RabbitTTL(ms)` | Time-to-live |

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
