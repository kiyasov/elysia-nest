---
title: 模块
icon: boxes
description: 将应用程序组织成内聚的功能块
---

模块是组织 nestelia 应用程序的主要方式。每个模块封装了一组控制器、提供者和导入项。

## 定义模块

使用 `@Module()` 装饰器来声明一个模块：

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## 模块选项

```typescript
interface ModuleOptions {
  controllers?: Type[];        // 路由处理器
  providers?: Provider[];      // 可注入的服务
  imports?: any[];             // 要导入的其他模块
  exports?: ProviderToken[];   // 供导入模块使用的提供者
  middlewares?: Middleware[];   // 基于类或函数式的中间件
  children?: (() => Promise<any>)[]; // 子模块
  prefix?: string;             // 所有控制器的路由前缀
}
```

## 导入模块

模块可以导入其他模块来访问其导出的提供者：

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

由于 `DatabaseModule` 导出了 `DatabaseService`，`UserService` 现在可以注入它。

## 根模块

每个应用程序都有一个根模块，传递给 `createElysiaApplication()`：

```typescript
@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
```

## 模块前缀

为模块内所有控制器应用路由前缀：

```typescript
@Module({
  controllers: [UserController], // 路由变为 /api/v1/users/...
  prefix: "/api/v1",
})
class ApiModule {}
```

## 全局模块

将模块标记为全局，使其提供者无需导入即可在任何地方使用：

```typescript
import { Global, Module } from "nestelia";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## 动态模块

模块可以暴露静态配置方法，如 `forRoot()` 和 `forRootAsync()`：

```typescript
@Module({})
class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        { provide: "CONFIG_OPTIONS", useValue: options },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// 用法
@Module({
  imports: [ConfigModule.forRoot({ path: ".env" })],
})
class AppModule {}
```

## 工作原理

在底层，`@Module()` 创建了一个 Elysia 插件。当调用 `createElysiaApplication()` 时：

1. DI 容器注册模块中的所有提供者
2. 控制器被实例化并注入依赖
3. HTTP 路由被注册到 Elysia 实例上
4. 生命周期钩子按顺序被调用
