---
title: Container API
icon: box
description: Direct access to the DI container for advanced use cases
---

The `DIContainer` singleton provides low-level access to the dependency injection system. Most applications won't need this directly, but it is useful for testing, dynamic providers, and framework extensions.

## Getting an Instance

```typescript
import { DIContainer } from "@kiyasov/elysia-nest";

const service = await DIContainer.get(UserService, UserModule);
```

## Registering Providers

```typescript
DIContainer.register([
  UserService,
  { provide: "CONFIG", useValue: { port: 3000 } },
], MyModuleClass);
```

## Registering Controllers

```typescript
DIContainer.registerControllers([UserController, AdminController], MyModuleClass);
```

## Clearing the Container

Useful for test isolation — removes all registered modules and providers:

```typescript
import { beforeEach } from "bun:test";
import { DIContainer } from "@kiyasov/elysia-nest";

beforeEach(() => {
  DIContainer.clear();
});
```

## Module Management

```typescript
// Add a module
const moduleRef = DIContainer.addModule(MyModule, "MyModule");

// Get a module by key
const moduleRef = DIContainer.getModuleByKey("MyModule");

// Get all modules
const modules = DIContainer.getModules();
```

## Request Scope

The container uses `AsyncLocalStorage` to manage request-scoped providers. When a request arrives:

1. `Container.runInRequestContext()` creates a new context
2. `REQUEST`-scoped providers get a fresh instance for that context
3. The context is cleaned up after the response

```typescript
@Injectable({ scope: Scope.REQUEST })
class RequestLogger {
  private requestId = crypto.randomUUID();

  log(message: string) {
    console.log(`[${this.requestId}] ${message}`);
  }
}
```

## Module Key Resolution

Providers are scoped to modules. When calling `DIContainer.get()`, pass the module class to look up providers within a specific module:

```typescript
const service = await DIContainer.get(UserService, UserModule);
```

If omitted, the container searches all modules.

## Global Modules

```typescript
// Mark a module as global so its providers are accessible everywhere
const moduleRef = DIContainer.addModule(ConfigModule, "ConfigModule");
DIContainer.addGlobalModule(moduleRef);
DIContainer.bindGlobalScope();
```
