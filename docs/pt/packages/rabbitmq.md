---
title: RabbitMQ
icon: mail
description: Mensageria avançada com RabbitMQ usando decoradores
---

O pacote RabbitMQ fornece uma abordagem orientada a decoradores para mensageria com RabbitMQ, com suporte a subscriptions, RPC, retentativas, dead letter queues e processamento em lote.

## Instalação

```bash
bun add amqplib
```

## Configuração

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

### Configuração Assíncrona

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

## Subscrever a Mensagens

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

## Padrão RPC

```typescript
import { RabbitRPC } from "nestelia/rabbitmq";

@RabbitRPC({
  exchange: "rpc",
  routingKey: "orders.calculate-total",
  queue: "orders-rpc-queue",
})
async calculateTotal(data: { items: { price: number; qty: number }[] }) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total }; // retornado ao chamador
}
```

## Publicando Mensagens

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

## Recursos Avançados

### Retry

```typescript
import { RabbitSubscribe, RabbitRetry } from "nestelia/rabbitmq";

@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.process",
  queue: "orders-process-queue",
})
@RabbitRetry(5, 10000) // 5 tentativas, 10s de atraso
async processOrder(message: RabbitMQMessage<Order>) {
  // retenta em caso de falha
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
  // mensagens com falha vão para a DLQ
}
```

### Processamento em Lote

```typescript
@RabbitSubscribe({
  exchange: "logs",
  routingKey: "log.entry",
  queue: "logs-queue",
})
@RabbitBatch(100, 5000) // 100 mensagens ou timeout de 5s
async processLogs(messages: RabbitMQMessage<LogEntry>[]) {
  await this.logRepository.insertMany(messages.map((m) => m.content));
  messages.forEach((m) => m.ack());
}
```

### Mensagens com Atraso

Requer o plugin [rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange).

Declare um exchange `x-delayed-message` e passe `x-delay` (milissegundos) nos headers da mensagem:

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
  { headers: { "x-delay": 30_000 } }, // entregar após 30 s
);
```

### Múltiplas Conexões

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
    // usa a conexão "analytics"
  }
}
```

## Decoradores

| Decorador | Descrição |
|-----------|-----------|
| `@RabbitSubscribe()` | Subscreve a mensagens de uma fila |
| `@RabbitRPC()` | Handler RPC |
| `@RabbitRetry(attempts, delay)` | Retenta em caso de falha |
| `@RabbitDLQ(exchange, routingKey)` | Dead letter queue |
| `@RabbitBatch(size, timeout)` | Processamento em lote |
| `@RabbitConnection(name)` | Usa uma conexão específica |
| `@RabbitPriority(level)` | Prioridade da mensagem |
| `@RabbitTTL(ms)` | Time-to-live |

## API do RabbitMQService

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
