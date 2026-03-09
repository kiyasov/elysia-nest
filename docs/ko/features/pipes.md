---
title: 파이프
icon: funnel
description: 파이프로 핸들러 입력을 변환하고 검증합니다
---

파이프는 데이터를 변환하거나 검증하기 위한 `PipeTransform` 인터페이스를 정의합니다. 재사용 가능한 변환 로직을 만들기 위한 패턴입니다.

::: info
`@UsePipes()`를 통한 자동 파이프 실행은 아직 사용할 수 없습니다. 파이프는 핸들러 메서드나 서비스 내에서 수동으로 사용할 수 있습니다.
:::

## PipeTransform 인터페이스

```typescript
interface PipeTransform {
  transform(value: any, metadata?: PipeMetadata): Promise<any> | any;
}

interface PipeMetadata {
  type: string;
  data?: any;
}
```

## 파이프 만들기

### 검증 파이프

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

### ParseInt 파이프

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

### Trim 파이프

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

## 파이프 수동 사용

`@UsePipes()`가 사용 가능해질 때까지 파이프를 주입하고 명시적으로 적용합니다:

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

## 스키마 기반 검증

입력 검증에는 `@Body`, `@Param`, `@Query` 파라미터 데코레이터와 함께 TypeBox 스키마를 사용하는 것이 좋습니다 — Elysia의 런타임 검증과 직접 통합됩니다:

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
