---
title: 依赖注入
icon: plug
description: 支持多种作用域的基于构造函数的 DI
---

nestelia 提供完整的依赖注入系统。服务在模块中注册，并自动注入到控制器和其他服务中。

## @Injectable()

将类标记为可注入，使 DI 容器能够管理它：

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  findAll() {
    return [{ id: 1, name: "John" }];
  }
}
```

## @Inject()

在构造函数中明确指定依赖令牌：

```typescript
@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
}
```

## @Optional()

将依赖标记为可选——如果不可用则返回 `undefined`：

```typescript
constructor(
  @Inject("ANALYTICS") @Optional() private analytics?: AnalyticsService
) {}
```

## 作用域

通过作用域控制服务的生命周期：

```typescript
import { Injectable, Scope } from "nestelia";

// 默认 — 全局共享一个实例
@Injectable()
class SingletonService {}

// 每次注入时创建新实例
@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}

// 每个 HTTP 请求创建新实例（通过 AsyncLocalStorage）
@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}
```

| 作用域 | 行为 |
|--------|------|
| `SINGLETON` | 整个应用程序共享单一实例（默认） |
| `TRANSIENT` | 每次注入时创建新实例 |
| `REQUEST` | 每个 HTTP 请求创建新实例 |

## 注册提供者

提供者在模块的 `providers` 数组中注册：

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
class UserModule {}
```

## 导出提供者

要使提供者对其他模块可用，将其添加到 `exports`：

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService], // 可以注入 DatabaseService
})
class UserModule {}
```

## 自定义提供者

参阅[自定义提供者](/zh/advanced/custom-providers)页面，了解值提供者、类提供者、工厂提供者和别名提供者。

## 循环依赖

参阅[前向引用](/zh/advanced/forward-ref)页面，了解如何使用 `forwardRef()` 解决循环依赖。
