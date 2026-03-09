---
title: 控制器
icon: server
description: 使用装饰器定义 HTTP 路由处理器
---

控制器处理传入的 HTTP 请求并返回响应。它们使用 `@Controller()` 装饰，并使用 HTTP 方法装饰器定义路由。

## 定义控制器

```typescript
import { Controller, Get } from "nestelia";

@Controller("/cats")
class CatController {
  @Get("/")
  findAll() {
    return [{ name: "Tom" }, { name: "Garfield" }];
  }
}
```

`@Controller("/cats")` 装饰器设置路由前缀。`@Get("/")` 装饰器将 `GET /cats/` 映射到 `findAll()`。

## 注册控制器

控制器必须在模块中声明：

```typescript
@Module({
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}
```

## 注入服务

在构造函数中使用 `@Inject()` 从 DI 容器获取服务：

```typescript
@Controller("/cats")
class CatController {
  constructor(@Inject(CatService) private readonly catService: CatService) {}

  @Get("/")
  findAll() {
    return this.catService.findAll();
  }
}
```

## 路由方法

nestelia 为所有标准 HTTP 方法提供了装饰器：

```typescript
@Controller("/items")
class ItemController {
  @Get("/")       findAll() { /* ... */ }
  @Get("/:id")    findOne() { /* ... */ }
  @Post("/")      create()  { /* ... */ }
  @Put("/:id")    update()  { /* ... */ }
  @Patch("/:id")  patch()   { /* ... */ }
  @Delete("/:id") remove()  { /* ... */ }
  @Options("/")   options() { /* ... */ }
  @Head("/")      head()    { /* ... */ }
  @All("/wild")   any()     { /* ... */ }
}
```

## 返回响应

控制器方法可以返回：

- **普通对象/数组** — 自动序列化为 JSON
- **字符串** — 以纯文本形式返回
- **Promise** — 等待解析后序列化

```typescript
@Get("/")
async findAll() {
  const users = await this.userService.findAll();
  return users; // 序列化为 JSON
}
```

## 访问请求数据

使用 `@Ctx()` 获取完整的 Elysia 上下文，从而访问所有请求数据：

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;
  const q = ctx.query.q;
  return this.service.findById(id);
}
```

对于对请求体、路径参数和查询参数的类型化验证访问，使用基于 TypeBox 的装饰器：

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

详情请参阅[参数装饰器](/zh/features/parameter-decorators)。

## 设置状态码

使用 `@HttpCode()` 为路由设置自定义状态码：

```typescript
@Post("/")
@HttpCode(201)
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

或使用 Elysia 上下文设置动态状态码：

```typescript
@Post("/")
create(@Ctx() ctx: any, @Body(t.Object({ name: t.String() })) body: { name: string }) {
  ctx.set.status = 201;
  return this.userService.create(body);
}
```

## 设置响应头

使用 `@Header()` 添加静态响应头：

```typescript
@Get("/")
@Header("Cache-Control", "no-store")
findAll() {
  return this.service.findAll();
}
```
