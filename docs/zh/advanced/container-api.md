---
title: 容器 API
icon: box
description: 直接访问 DI 容器的高级用例
---

`DIContainer` 单例提供对依赖注入系统的底层访问。大多数应用程序不需要直接使用它，但它对于测试、动态提供者和框架扩展很有用。

## 获取实例

```typescript
import { DIContainer } from "nestelia";

const service = await DIContainer.get(UserService, UserModule);
```

## 注册提供者

```typescript
DIContainer.register([
  UserService,
  { provide: "CONFIG", useValue: { port: 3000 } },
], MyModuleClass);
```

## 注册控制器

```typescript
DIContainer.registerControllers([UserController, AdminController], MyModuleClass);
```

## 清空容器

用于测试隔离——移除所有已注册的模块和提供者：

```typescript
import { beforeEach } from "bun:test";
import { DIContainer } from "nestelia";

beforeEach(() => {
  DIContainer.clear();
});
```

## 模块管理

```typescript
// 添加模块
const moduleRef = DIContainer.addModule(MyModule, "MyModule");

// 按键获取模块
const moduleRef = DIContainer.getModuleByKey("MyModule");

// 获取所有模块
const modules = DIContainer.getModules();
```

## 请求作用域

容器使用 `AsyncLocalStorage` 管理请求作用域的提供者。当请求到来时：

1. `Container.runInRequestContext()` 创建新上下文
2. `REQUEST` 作用域的提供者在该上下文中获取新实例
3. 响应后清理上下文

```typescript
@Injectable({ scope: Scope.REQUEST })
class RequestLogger {
  private requestId = crypto.randomUUID();

  log(message: string) {
    console.log(`[${this.requestId}] ${message}`);
  }
}
```

## 模块键解析

提供者的作用域限定在模块内。调用 `DIContainer.get()` 时，传入模块类以在特定模块中查找提供者：

```typescript
const service = await DIContainer.get(UserService, UserModule);
```

如果省略，容器将在所有模块中搜索。

## 全局模块

```typescript
// 将模块标记为全局，使其提供者可在任何地方访问
const moduleRef = DIContainer.addModule(ConfigModule, "ConfigModule");
DIContainer.addGlobalModule(moduleRef);
DIContainer.bindGlobalScope();
```
