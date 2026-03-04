---
title: Dependency Injection
icon: plug
description: Constructor-based DI with multiple scopes
---

@kiyasov/elysia-nest provides a full dependency injection system. Services are registered in modules and automatically injected into controllers and other services.

## @Injectable()

Mark a class as injectable so the DI container can manage it:

```typescript
import { Injectable } from "@kiyasov/elysia-nest";

@Injectable()
class UserService {
  findAll() {
    return [{ id: 1, name: "John" }];
  }
}
```

## @Inject()

Explicitly specify a dependency token in the constructor:

```typescript
@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
}
```

## @Optional()

Mark a dependency as optional — returns `undefined` if not available:

```typescript
constructor(
  @Inject("ANALYTICS") @Optional() private analytics?: AnalyticsService
) {}
```

## Scopes

Control the lifecycle of your services with scopes:

```typescript
import { Injectable, Scope } from "@kiyasov/elysia-nest";

// Default — one instance shared everywhere
@Injectable()
class SingletonService {}

// New instance for every injection
@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}

// New instance for every HTTP request (via AsyncLocalStorage)
@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}
```

| Scope | Behavior |
|-------|----------|
| `SINGLETON` | Single instance for the entire application (default) |
| `TRANSIENT` | New instance every time it is injected |
| `REQUEST` | New instance per HTTP request |

## Registering Providers

Providers are registered in the `providers` array of a module:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
class UserModule {}
```

## Exporting Providers

To make a provider available to other modules, add it to `exports`:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService], // can inject DatabaseService
})
class UserModule {}
```

## Custom Providers

See the [Custom Providers](/advanced/custom-providers) page for value, class, factory, and alias providers.

## Circular Dependencies

See the [Forward References](/advanced/forward-ref) page for resolving circular dependencies with `forwardRef()`.
