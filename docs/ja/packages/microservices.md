---
title: マイクロサービス
icon: network
description: 複数のトランスポートで分散システムを構築する
---

マイクロサービスパッケージは、Redis、RabbitMQ、TCP などをサポートするサービス間のマルチトランスポート通信を可能にします。

## インストール

```bash
bun add ioredis   # Redis トランスポート
bun add amqplib   # RabbitMQ トランスポート
```

## セットアップ

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000); // HTTP + マイクロサービスのハイブリッド
```

## トランスポート

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

## メッセージパターン

### リクエスト/レスポンス

リクエスト/レスポンス通信には `@MessagePattern()` を使用します:

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

### イベントベース

ファイアアンドフォーゲットのイベントには `@EventPattern()` を使用します:

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

## クライアントファクトリー

他のマイクロサービスにメッセージを送信します:

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

## ハイブリッドアプリケーション

同一プロセスで HTTP とマイクロサービスのリスナーを実行します:

```typescript
const app = await createElysiaApplication(AppModule);

// HTTP ルートは通常通り動作
// マイクロサービスのメッセージハンドラーも追加
app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```
