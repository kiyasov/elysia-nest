---
title: Testing
icon: beaker
description: Isolated test modules with provider overrides
---

The testing package provides utilities for unit and integration testing of @kiyasov/elysia-nest applications.

## Quick Start

```typescript
import { describe, expect, it, beforeAll } from "bun:test";
import { Injectable } from "@kiyasov/elysia-nest";
import { Test, TestingModule } from "@kiyasov/elysia-nest/testing";

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

## Mocking Dependencies

### Override with Value

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

### Override with Class

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

### Override with Factory

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

## API Reference

### Test.createTestingModule(metadata)

Creates a `TestingModuleBuilder`.

**Parameters:**
- `metadata` — Module configuration (`providers`, `imports`, `controllers`)

### TestingModuleBuilder

| Method | Description |
|--------|-------------|
| `.overrideProvider(token)` | Start overriding a provider |
| `.useValue(value)` | Replace with a static value |
| `.useClass(metatype)` | Replace with a different class |
| `.useFactory(factory, inject?)` | Replace with a factory function |
| `.compile()` | Build and return a `Promise<TestingModule>` |

### TestingModule

| Method | Description |
|--------|-------------|
| `.get<T>(token)` | Get a provider instance (synchronous) |
| `.resolve<T>(token)` | Resolve a provider (async, for request-scoped) |
| `.has(token)` | Check if a provider is registered |
