---
title: Microservicios
icon: network
description: Construye sistemas distribuidos con múltiples transportes
---

El paquete de microservicios habilita la comunicación multi-transporte entre servicios, soportando Redis, RabbitMQ, TCP y más.

## Instalación

```bash
bun add ioredis   # transporte Redis
bun add amqplib   # transporte RabbitMQ
```

## Configuración

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000); // modo híbrido HTTP + microservicios
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

## Patrones de Mensajes

### Solicitud/Respuesta

Usa `@MessagePattern()` para comunicación de solicitud/respuesta:

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

### Basado en Eventos

Usa `@EventPattern()` para eventos de tipo fire-and-forget:

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

## ClientFactory

Envía mensajes a otros microservicios:

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

## Aplicación Híbrida

Ejecuta los listeners HTTP y de microservicios en el mismo proceso:

```typescript
const app = await createElysiaApplication(AppModule);

// Las rutas HTTP funcionan normalmente
// Más los manejadores de mensajes de microservicio
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```
