---
title: 介绍
description: 一个基于 Elysia 的模块化装饰器驱动框架
---

# nestelia

**nestelia** 是一个基于 [Elysia](https://elysiajs.com/) 和 [Bun](https://bun.sh/) 构建的模块化装饰器驱动框架。它提供装饰器、依赖注入 (Dependency Injection)、模块系统和生命周期钩子，用于构建结构化的服务端应用程序。

::: warning
nestelia 正在积极开发中。在稳定版本发布之前，API 可能会有所变动。
:::

## 为什么选择 nestelia？

Elysia 是最快的 Bun 原生 HTTP 框架之一。nestelia 在其之上增加了结构化的模块化架构——同时不牺牲 Elysia 的性能。

- **装饰器** — `@Controller`、`@Get`、`@Post`、`@Body`、`@Param` 等
- **依赖注入** — 基于构造函数的 DI，支持单例、瞬态和请求作用域
- **模块** — 将控制器、提供者和导入封装成内聚单元
- **生命周期钩子** — `OnModuleInit`、`OnApplicationBootstrap`、`OnModuleDestroy` 等
- **守卫、拦截器、管道** — 请求管道的可扩展性
- **中间件** — 支持基于类和函数式的中间件
- **异常处理** — 内置 HTTP 异常，自动生成错误响应
- **TypeBox 验证** — 通过 Elysia 原生 TypeBox 集成实现基于 Schema 的请求验证

## 扩展包

除核心功能外，nestelia 还提供了可选扩展包：

| 包名 | 描述 |
|------|------|
| `nestelia/scheduler` | Cron 任务、定时器和超时 |
| `nestelia/microservices` | Redis、RabbitMQ、TCP 传输 |
| `nestelia/apollo` | Apollo GraphQL 代码优先集成 |
| `nestelia/passport` | Passport.js 认证策略 |
| `nestelia/testing` | 带提供者覆盖的隔离测试模块 |
| `nestelia/cache` | 使用装饰器的 HTTP 响应缓存 |
| `nestelia/rabbitmq` | 高级 RabbitMQ 消息传递 |
| `nestelia/graphql-pubsub` | 用于 GraphQL 订阅的 Redis PubSub |

## 快速示例

```typescript
import { createElysiaApplication, Controller, Get, Module, Injectable, Inject } from "nestelia";

@Injectable()
class GreetService {
  hello() {
    return { message: "Hello from nestelia!" };
  }
}

@Controller("/greet")
class GreetController {
  constructor(@Inject(GreetService) private greet: GreetService) {}

  @Get("/")
  sayHello() {
    return this.greet.hello();
  }
}

@Module({
  controllers: [GreetController],
  providers: [GreetService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Claude Code 技能

nestelia 提供了 [Claude Code](https://claude.ai/claude-code) 技能，直接在 AI 助手中提供脚手架模板、装饰器用法和最佳实践。

```bash
npx skills add kiyasov/nestelia
```

安装后，Claude Code 将在使用 `nestelia` 时自动应用正确的模式。

## 下一步

- [安装](/zh/getting-started/installation) — 安装 nestelia 及其对等依赖。
- [快速开始](/zh/getting-started/quick-start) — 在 5 分钟内构建你的第一个 CRUD 应用。
- [模块](/zh/core-concepts/modules) — 了解模块如何组织你的应用程序。
- [依赖注入](/zh/features/dependency-injection) — 支持多种作用域的基于构造函数的 DI。
