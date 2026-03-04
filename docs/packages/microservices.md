---
title: Microservices
icon: network
description: Build distributed systems with multiple transports
---

The microservices package enables multi-transport communication between services, supporting Redis, RabbitMQ, TCP, and more.

## Installation

```bash
bun add ioredis   # Redis transport
bun add amqplib   # RabbitMQ transport
```

## Setup

```typescript
import { createElysiaApplication } from "@kiyasov/elysia-nest";
import { Transport } from "@kiyasov/elysia-nest/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000); // HTTP + microservices hybrid
```

## Transports

```typescript
enum Transport {
  REDIS = "REDIS",
  RABBITMQ = "RABBITMQ",
  TCP = "TCP",
  GRPC = "GRPC",
  KAFKA = "KAFKA",
  MQTT = "MQTT",
  NATS = "NATS",
}
```

## Message Patterns

### Request/Response

Use `@MessagePattern()` for request/response communication:

```typescript
import { Controller } from "@kiyasov/elysia-nest";
import { MessagePattern, Payload } from "@kiyasov/elysia-nest/microservices";

@Controller()
class MathController {
  @MessagePattern("sum")
  sum(@Payload() data: { numbers: number[] }) {
    return data.numbers.reduce((a, b) => a + b, 0);
  }
}
```

### Event-Based

Use `@EventPattern()` for fire-and-forget events:

```typescript
import { EventPattern, Payload } from "@kiyasov/elysia-nest/microservices";

@Controller()
class NotificationController {
  @EventPattern("user.created")
  handleUserCreated(@Payload() data: { userId: string }) {
    console.log("New user:", data.userId);
  }
}
```

## Client Factory

Send messages to other microservices:

```typescript
import { Injectable } from "@kiyasov/elysia-nest";
import { ClientFactory, Transport } from "@kiyasov/elysia-nest/microservices";

@Injectable()
class OrderService {
  private client = ClientFactory.create({
    transport: Transport.REDIS,
    options: { host: "localhost", port: 6379 },
  });

  async calculateTotal(items: any[]) {
    return this.client.send("sum", { numbers: items.map((i) => i.price) });
  }
}
```

## Hybrid Application

Run HTTP and microservice listeners in the same process:

```typescript
const app = await createElysiaApplication(AppModule);

// HTTP routes work as normal
// Plus microservice message handlers
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```
