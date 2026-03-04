---
title: Forward References
icon: link
description: Resolve circular dependencies with forwardRef()
---

Circular dependencies occur when two services depend on each other. @kiyasov/elysia-nest provides `forwardRef()` to handle these cases.

## The Problem

```typescript
// This creates a circular dependency:
@Injectable()
class ServiceA {
  constructor(@Inject(ServiceB) private b: ServiceB) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

At resolve time, `ServiceA` needs `ServiceB` which needs `ServiceA` — a deadlock.

## The Solution

Use `forwardRef()` on at least one side of the circular reference:

```typescript
import { Injectable, Inject, forwardRef } from "@kiyasov/elysia-nest";

@Injectable()
class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB)) private b: ServiceB
  ) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

`forwardRef(() => ServiceB)` defers the resolution of `ServiceB` until all providers have been registered, breaking the circular chain.

## When to Use forwardRef

- Two services that reference each other
- A service that references a controller and vice versa
- Cross-module circular imports

## Best Practices

Circular dependencies often indicate a design issue. Before reaching for `forwardRef()`, consider:

1. **Extract shared logic** into a third service that both depend on
2. **Use events** — one service publishes, the other subscribes
3. **Restructure modules** — move shared providers to a common module

Use `forwardRef()` only when refactoring isn't practical.
