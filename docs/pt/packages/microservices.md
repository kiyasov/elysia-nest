---
title: Microserviços
icon: network
description: Construa sistemas distribuídos com múltiplos transportes
---

O pacote de microserviços habilita comunicação multi-transporte entre serviços, com suporte a Redis, RabbitMQ, TCP e mais.

## Instalação

```bash
bun add ioredis   # transporte Redis
bun add amqplib   # transporte RabbitMQ
```

## Configuração

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000); // híbrido HTTP + microserviços
```

## Transportes

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

## Padrões de Mensagem

### Requisição/Resposta

Use `@MessagePattern()` para comunicação de requisição/resposta:

```typescript
import { Controller } from "nestelia";
import { MessagePattern, Payload } from "nestelia/microservices";

@Controller()
class MathController {
  @MessagePattern("sum")
  sum(@Payload() data: { numbers: number[] }) {
    return data.numbers.reduce((a, b) => a + b, 0);
  }
}
```

### Baseado em Eventos

Use `@EventPattern()` para eventos fire-and-forget:

```typescript
import { EventPattern, Payload } from "nestelia/microservices";

@Controller()
class NotificationController {
  @EventPattern("user.created")
  handleUserCreated(@Payload() data: { userId: string }) {
    console.log("New user:", data.userId);
  }
}
```

## Client Factory

Envie mensagens para outros microserviços:

```typescript
import { Injectable } from "nestelia";
import { ClientFactory, Transport } from "nestelia/microservices";

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

## Aplicação Híbrida

Execute listeners HTTP e de microserviço no mesmo processo:

```typescript
const app = await createElysiaApplication(AppModule);

// Rotas HTTP funcionam normalmente
// Mais handlers de mensagens de microserviços
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```
