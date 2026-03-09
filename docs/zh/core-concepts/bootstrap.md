---
title: 启动
icon: power
description: 初始化并启动你的 nestelia 应用程序
---

`createElysiaApplication` 函数初始化根模块并返回一个准备好监听请求的 Elysia 实例。

## 基本用法

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## createElysiaApplication 的工作流程

1. **解析模块树** — 递归处理导入、提供者和控制器
2. **注册提供者** — 将所有提供者添加到 DI 容器
3. **实例化控制器** — 创建控制器实例并注入依赖
4. **注册路由** — 将装饰后的方法映射到 Elysia 路由
5. **运行生命周期钩子** — 按顺序调用 `onModuleInit` 和 `onApplicationBootstrap`
6. **返回 ElysiaNestApplication** — 准备好调用 `.listen()`

## 与微服务配合使用

使用微服务包时，`createElysiaApplication` 返回一个支持 HTTP + 微服务混合模式的 `ElysiaNestApplication`：

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```

## 优雅关闭

nestelia 支持关闭生命周期钩子。当进程接收到终止信号时：

1. `BeforeApplicationShutdown` 钩子首先运行
2. `OnModuleDestroy` 钩子运行以进行清理
3. `OnApplicationShutdown` 钩子最后运行

```typescript
@Injectable()
class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.connection.close();
  }
}
```
