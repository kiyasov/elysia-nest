---
title: 管道
icon: funnel
description: 使用管道转换和验证处理器输入
---

管道定义了一个 `PipeTransform` 接口，用于转换或验证数据。它们是创建可复用转换逻辑的模式。

::: info
通过 `@UsePipes()` 自动执行管道的功能尚不可用。管道目前可以在处理方法或服务中手动使用。
:::

## PipeTransform 接口

```typescript
interface PipeTransform {
  transform(value: any, metadata?: PipeMetadata): Promise<any> | any;
}

interface PipeMetadata {
  type: string;
  data?: any;
}
```

## 创建管道

### 验证管道

```typescript
import { Injectable, PipeTransform, BadRequestException } from "nestelia";

@Injectable()
class ValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException("Value is required");
    }
    return value;
  }
}
```

### ParseInt 管道

```typescript
@Injectable()
class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new BadRequestException(`"${value}" is not a valid integer`);
    }
    return parsed;
  }
}
```

### Trim 管道

```typescript
@Injectable()
class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === "string") {
      return value.trim();
    }
    if (typeof value === "object" && value !== null) {
      for (const key of Object.keys(value)) {
        if (typeof value[key] === "string") {
          value[key] = value[key].trim();
        }
      }
    }
    return value;
  }
}
```

## 手动使用管道

在 `@UsePipes()` 可用之前，注入管道并显式应用：

```typescript
@Controller("/users")
class UserController {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(ParseIntPipe) private parseIntPipe: ParseIntPipe,
    @Inject(TrimPipe) private trimPipe: TrimPipe,
  ) {}

  @Post("/")
  create(@Ctx() ctx: any) {
    const body = this.trimPipe.transform(ctx.body);
    return this.userService.create(body);
  }

  @Get("/:id")
  findOne(@Ctx() ctx: any) {
    const id = this.parseIntPipe.transform(ctx.params.id);
    return this.userService.findById(id);
  }
}
```

## 基于 Schema 的验证

对于输入验证，建议使用带有 `@Body`、`@Param` 和 `@Query` 参数装饰器的 TypeBox Schema——它们直接与 Elysia 的运行时验证集成：

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: "email" }),
})) body: { name: string; email: string }) {
  return this.userService.create(body);
}
```
