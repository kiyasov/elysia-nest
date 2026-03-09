---
title: RabbitMQ
icon: mail
description: 데코레이터를 이용한 고급 RabbitMQ 메시징
---

RabbitMQ 패키지는 구독, RPC, 재시도, 데드 레터 큐, 배치 처리를 지원하는 데코레이터 기반 RabbitMQ 메시징 방식을 제공합니다.

## 설치

```bash
bun add amqplib
```

## 설정

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

### 비동기 설정

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

## 메시지 구독

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

## RPC 패턴

```typescript
import { RabbitRPC } from "nestelia/rabbitmq";

@RabbitRPC({
  exchange: "rpc",
  routingKey: "orders.calculate-total",
  queue: "orders-rpc-queue",
})
async calculateTotal(data: { items: { price: number; qty: number }[] }) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total }; // 호출자에게 반환됩니다
}
```

## 메시지 발행

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

## 고급 기능

### 재시도

```typescript
import { RabbitSubscribe, RabbitRetry } from "nestelia/rabbitmq";

@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.process",
  queue: "orders-process-queue",
})
@RabbitRetry(5, 10000) // 5번 시도, 10초 지연
async processOrder(message: RabbitMQMessage<Order>) {
  // 실패 시 재시도합니다
}
```

### 데드 레터 큐

```typescript
@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.critical",
  queue: "orders-critical-queue",
})
@RabbitDLQ("dlx.exchange", "failed.orders")
async criticalOperation(message: RabbitMQMessage<Order>) {
  // 실패한 메시지는 DLQ로 이동합니다
}
```

### 배치 처리

```typescript
@RabbitSubscribe({
  exchange: "logs",
  routingKey: "log.entry",
  queue: "logs-queue",
})
@RabbitBatch(100, 5000) // 100개 메시지 또는 5초 타임아웃
async processLogs(messages: RabbitMQMessage<LogEntry>[]) {
  await this.logRepository.insertMany(messages.map((m) => m.content));
  messages.forEach((m) => m.ack());
}
```

### 지연 메시지

[rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange) 플러그인이 필요합니다.

`x-delayed-message` 교환기를 선언하고 메시지 헤더에 `x-delay` (밀리초)를 전달합니다:

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
  { headers: { "x-delay": 30_000 } }, // 30초 후 전달
);
```

### 여러 연결

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
    // "analytics" 연결을 사용합니다
  }
}
```

## 데코레이터

| 데코레이터 | 설명 |
|-----------|-------------|
| `@RabbitSubscribe()` | 큐 메시지 구독 |
| `@RabbitRPC()` | RPC 핸들러 |
| `@RabbitRetry(attempts, delay)` | 실패 시 재시도 |
| `@RabbitDLQ(exchange, routingKey)` | 데드 레터 큐 |
| `@RabbitBatch(size, timeout)` | 배치 처리 |
| `@RabbitConnection(name)` | 특정 연결 사용 |
| `@RabbitPriority(level)` | 메시지 우선순위 |
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
