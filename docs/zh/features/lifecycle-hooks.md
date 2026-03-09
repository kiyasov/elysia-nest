---
title: 生命周期钩子
icon: refresh-cw
description: 钩入应用程序和模块的生命周期事件
---

nestelia 提供生命周期钩子，让你在应用程序启动和关闭过程中的特定时间点运行逻辑。

## 模块生命周期钩子

在 `@Injectable()` 服务或控制器上实现这些接口：

### OnModuleInit

在模块的提供者实例化完成后调用：

```typescript
import { Injectable, OnModuleInit } from "nestelia";

@Injectable()
class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log("Database connected");
  }
}
```

### OnApplicationBootstrap

所有模块初始化完成后调用：

```typescript
@Injectable()
class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log("Application is ready");
  }
}
```

### OnModuleDestroy

模块被销毁时调用（在关闭期间）：

```typescript
@Injectable()
class CacheService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.cache.flush();
  }
}
```

### BeforeApplicationShutdown

应用程序开始关闭前调用。接收触发关闭的信号：

```typescript
@Injectable()
class GracefulService implements BeforeApplicationShutdown {
  async beforeApplicationShutdown(signal?: string) {
    console.log(`Shutting down due to: ${signal}`);
    await this.drainRequests();
  }
}
```

### OnApplicationShutdown

所有模块被销毁后调用：

```typescript
@Injectable()
class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await this.releaseResources();
  }
}
```

## 执行顺序

启动期间：
1. `OnModuleInit` — 按导入顺序逐模块执行
2. `OnApplicationBootstrap` — 所有模块初始化完成后执行

关闭期间：
1. `BeforeApplicationShutdown`
2. `OnModuleDestroy`
3. `OnApplicationShutdown`

## Elysia 生命周期装饰器

nestelia 还将 Elysia 的请求生命周期钩子作为方法装饰器暴露在控制器上：

```typescript
import {
  OnRequest,
  OnBeforeHandle,
  OnAfterHandle,
  OnAfterResponse,
  OnError,
} from "nestelia";

@Controller("/")
class AppController {
  @OnRequest()
  logRequest(ctx: any) {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
  }

  @OnBeforeHandle()
  checkAuth(ctx: any) {
    // 在路由处理器之前运行
  }

  @OnAfterHandle()
  addHeaders(ctx: any) {
    ctx.set.headers["x-powered-by"] = "nestelia";
  }

  @OnError()
  handleError(ctx: any) {
    console.error("Error:", ctx.error);
  }

  @OnAfterResponse()
  logResponse(ctx: any) {
    console.log("Response sent");
  }
}
```

可用的 Elysia 生命周期装饰器：

| 装饰器 | 钩子 |
|--------|------|
| `@OnRequest()` | 路由前 |
| `@OnParse()` | 请求体解析 |
| `@OnTransform()` | 转换请求 |
| `@OnBeforeHandle()` | 处理器前 |
| `@OnAfterHandle()` | 处理器后 |
| `@OnMapResponse()` | 映射响应 |
| `@OnAfterResponse()` | 响应发送后 |
| `@OnError()` | 错误处理 |
