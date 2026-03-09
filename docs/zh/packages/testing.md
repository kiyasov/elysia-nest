---
title: 测试
icon: beaker
description: 带提供者覆盖的隔离测试模块
---

测试包提供了用于 nestelia 应用程序单元测试和集成测试的工具。

## 快速开始

```typescript
import { describe, expect, it, beforeAll } from "bun:test";
import { Injectable } from "nestelia";
import { Test, TestingModule } from "nestelia/testing";

@Injectable()
class UserService {
  getUsers() {
    return [{ id: 1, name: "John" }];
  }
}

describe("UserService", () => {
  let module: TestingModule;
  let userService: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get(UserService);
  });

  it("should return users", () => {
    expect(userService.getUsers()).toEqual([{ id: 1, name: "John" }]);
  });
});
```

## 模拟依赖

### 使用值覆盖

```typescript
const mockDb = {
  query: () => [{ id: 1, name: "Mock User" }],
};

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useValue(mockDb)
  .compile();
```

### 使用类覆盖

```typescript
class MockDatabaseService {
  query() {
    return [{ id: 1, name: "Mock" }];
  }
}

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useClass(MockDatabaseService)
  .compile();
```

### 使用工厂覆盖

```typescript
const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useFactory(() => ({
    query: () => [{ id: 1, name: "Factory Mock" }],
  }))
  .compile();
```

## API 参考

### Test.createTestingModule(metadata)

创建一个 `TestingModuleBuilder`。

**参数：**
- `metadata` — 模块配置（`providers`、`imports`、`controllers`）

### TestingModuleBuilder

| 方法 | 描述 |
|------|------|
| `.overrideProvider(token)` | 开始覆盖一个提供者 |
| `.useValue(value)` | 用静态值替换 |
| `.useClass(metatype)` | 用不同的类替换 |
| `.useFactory(factory, inject?)` | 用工厂函数替换 |
| `.compile()` | 构建并返回 `Promise<TestingModule>` |

### TestingModule

| 方法 | 描述 |
|------|------|
| `.get<T>(token)` | 获取提供者实例（同步） |
| `.resolve<T>(token)` | 解析提供者（异步，用于请求作用域） |
| `.has(token)` | 检查提供者是否已注册 |
