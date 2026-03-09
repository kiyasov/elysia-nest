---
title: 微服务
icon: network
description: 使用多种传输方式构建分布式系统
---

微服务包支持服务间的多传输通信，支持 Redis、RabbitMQ、TCP 等。

## 安装

```bash
bun add ioredis   # Redis 传输
bun add amqplib   # RabbitMQ 传输
```

## 配置

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000); // HTTP + 微服务混合模式
```

## 传输方式

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

## 消息模式

### 请求/响应

使用 `@MessagePattern()` 进行请求/响应通信：

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

### 基于事件

使用 `@EventPattern()` 进行发布即忘型事件：

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

## 客户端工厂

向其他微服务发送消息：

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

## 混合应用程序

在同一进程中同时运行 HTTP 和微服务监听器：

```typescript
const app = await createElysiaApplication(AppModule);

// HTTP 路由正常工作
// 加上微服务消息处理器
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```
