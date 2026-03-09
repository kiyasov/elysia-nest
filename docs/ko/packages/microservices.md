---
title: 마이크로서비스
icon: network
description: 여러 트랜스포트로 분산 시스템을 구축합니다
---

마이크로서비스 패키지는 Redis, RabbitMQ, TCP 등을 지원하는 서비스 간 멀티 트랜스포트 통신을 가능하게 합니다.

## 설치

```bash
bun add ioredis   # Redis 트랜스포트
bun add amqplib   # RabbitMQ 트랜스포트
```

## 설정

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000); // HTTP + 마이크로서비스 하이브리드
```

## 트랜스포트

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

## 메시지 패턴

### 요청/응답

요청/응답 통신에는 `@MessagePattern()`을 사용합니다:

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

### 이벤트 기반

Fire-and-forget 이벤트에는 `@EventPattern()`을 사용합니다:

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

## 클라이언트 팩토리

다른 마이크로서비스에 메시지를 전송합니다:

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

## 하이브리드 애플리케이션

동일한 프로세스에서 HTTP와 마이크로서비스 리스너를 함께 실행합니다:

```typescript
const app = await createElysiaApplication(AppModule);

// HTTP 라우트는 정상적으로 작동합니다
// 마이크로서비스 메시지 핸들러도 함께 동작합니다
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```
