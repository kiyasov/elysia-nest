---
title: RabbitMQ
icon: mail
description: Mensajería avanzada con RabbitMQ usando decoradores
---

El paquete RabbitMQ provee un enfoque orientado a decoradores para la mensajería con RabbitMQ, con soporte para suscripciones, RPC, reintentos, colas de mensajes muertos y procesamiento por lotes.

## Instalación

```bash
bun add amqplib
```

## Configuración

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

### Configuración Asíncrona

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

## Suscribirse a Mensajes

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

## Patrón RPC

```typescript
import { RabbitRPC } from "nestelia/rabbitmq";

@RabbitRPC({
  exchange: "rpc",
  routingKey: "orders.calculate-total",
  queue: "orders-rpc-queue",
})
async calculateTotal(data: { items: { price: number; qty: number }[] }) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total }; // se devuelve al llamador
}
```

## Publicar Mensajes

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

## Funcionalidades Avanzadas

### Reintento

```typescript
import { RabbitSubscribe, RabbitRetry } from "nestelia/rabbitmq";

@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.process",
  queue: "orders-process-queue",
})
@RabbitRetry(5, 10000) // 5 intentos, 10s de retardo
async processOrder(message: RabbitMQMessage<Order>) {
  // reintenta en caso de fallo
}
```

### Cola de Mensajes Muertos (Dead Letter Queue)

```typescript
@RabbitSubscribe({
  exchange: "orders",
  routingKey: "order.critical",
  queue: "orders-critical-queue",
})
@RabbitDLQ("dlx.exchange", "failed.orders")
async criticalOperation(message: RabbitMQMessage<Order>) {
  // los mensajes fallidos van a la DLQ
}
```

### Procesamiento por Lotes

```typescript
@RabbitSubscribe({
  exchange: "logs",
  routingKey: "log.entry",
  queue: "logs-queue",
})
@RabbitBatch(100, 5000) // 100 mensajes o 5s de timeout
async processLogs(messages: RabbitMQMessage<LogEntry>[]) {
  await this.logRepository.insertMany(messages.map((m) => m.content));
  messages.forEach((m) => m.ack());
}
```

### Mensajes con Retardo

Requiere el plugin [rabbitmq-delayed-message-exchange](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange).

Declara un exchange `x-delayed-message` y pasa `x-delay` (milisegundos) en los headers del mensaje:

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
  { headers: { "x-delay": 30_000 } }, // entregar después de 30 s
);
```

### Múltiples Conexiones

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
    // usa la conexión "analytics"
  }
}
```

## Decoradores

| Decorador | Descripción |
|-----------|-------------|
| `@RabbitSubscribe()` | Suscribirse a mensajes de una cola |
| `@RabbitRPC()` | Manejador RPC |
| `@RabbitRetry(attempts, delay)` | Reintento en caso de fallo |
| `@RabbitDLQ(exchange, routingKey)` | Cola de mensajes muertos |
| `@RabbitBatch(size, timeout)` | Procesamiento por lotes |
| `@RabbitConnection(name)` | Usar una conexión específica |
| `@RabbitPriority(level)` | Prioridad del mensaje |
| `@RabbitTTL(ms)` | Tiempo de vida (TTL) |

## API de RabbitMQService

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
