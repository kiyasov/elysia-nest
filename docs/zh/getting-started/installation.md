---
title: 安装
icon: download
description: 安装 nestelia 并配置你的项目
---

## 前提条件

- [Bun](https://bun.sh/) v1.0 或更高版本
- TypeScript 5.0+

## 安装

```bash
bun add nestelia elysia
```

nestelia 需要 `elysia` ^1.2.0 作为对等依赖。

## TypeScript 配置

nestelia 依赖装饰器和元数据反射。请确保你的 `tsconfig.json` 包含以下配置：

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

## 可选对等依赖

所有子路径都包含在 `nestelia` 包中。只需安装你需要的对等依赖：

```bash
# 微服务 — Redis 传输
bun add ioredis

# 微服务 — RabbitMQ 传输
bun add amqplib

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Passport 认证
bun add passport

# 缓存管理器
bun add cache-manager

# RabbitMQ 消息传递
bun add amqplib

# GraphQL PubSub (Redis)
bun add ioredis
```

## 验证安装

创建一个最简应用来验证一切正常：

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
