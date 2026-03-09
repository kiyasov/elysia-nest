---
title: 설치
icon: download
description: nestelia를 설치하고 프로젝트를 설정합니다
---

## 사전 요구사항

- [Bun](https://bun.sh/) v1.0 이상
- TypeScript 5.0+

## 설치

```bash
bun add nestelia elysia
```

nestelia는 피어 의존성으로 `elysia` ^1.2.0을 요구합니다.

## TypeScript 설정

nestelia는 데코레이터와 메타데이터 리플렉션에 의존합니다. `tsconfig.json`에 다음 설정이 포함되어 있는지 확인하세요:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## 선택적 피어 의존성

모든 서브패스는 `nestelia` 패키지에 포함되어 있습니다. 필요한 피어 의존성만 설치하세요:

```bash
# 마이크로서비스 — Redis 트랜스포트
bun add ioredis

# 마이크로서비스 — RabbitMQ 트랜스포트
bun add amqplib

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport 인증
bun add passport

# 캐시 매니저
bun add cache-manager

# RabbitMQ 메시징
bun add amqplib

# GraphQL PubSub (Redis)
bun add ioredis
```

## 설치 확인

모든 것이 작동하는지 확인하기 위해 최소한의 앱을 만들어 보세요:

```typescript
import { createElysiaApplication, Controller, Get, Module } from "nestelia";

@Controller("/")
class AppController {
  @Get("/")
  hello() {
    return { status: "ok" };
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

```bash
bun run app.ts
```
