---
title: 前向引用
icon: link
description: 使用 forwardRef() 解决循环依赖
---

循环依赖发生在两个服务互相依赖时。nestelia 提供 `forwardRef()` 来处理这种情况。

## 问题

```typescript
// 这会创建循环依赖：
@Injectable()
class ServiceA {
  constructor(@Inject(ServiceB) private b: ServiceB) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

在解析时，`ServiceA` 需要 `ServiceB`，而 `ServiceB` 又需要 `ServiceA`——形成死锁。

## 解决方案

在循环引用的至少一端使用 `forwardRef()`：

```typescript
import { Injectable, Inject, forwardRef } from "nestelia";

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

`forwardRef(() => ServiceB)` 将 `ServiceB` 的解析推迟到所有提供者注册完成之后，从而打破循环链。

## 何时使用 forwardRef

- 两个互相引用的服务
- 服务引用控制器，反之亦然
- 跨模块的循环导入

## 最佳实践

循环依赖通常表明存在设计问题。在使用 `forwardRef()` 之前，请考虑：

1. **提取共享逻辑** — 将公共逻辑提取到两者都依赖的第三个服务中
2. **使用事件** — 一个服务发布，另一个订阅
3. **重构模块** — 将共享提供者移到公共模块

仅在重构不可行时才使用 `forwardRef()`。
