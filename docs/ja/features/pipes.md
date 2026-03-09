---
title: パイプ
icon: funnel
description: パイプでハンドラー入力を変換・バリデーションする
---

パイプはデータの変換やバリデーションのための `PipeTransform` インターフェースを定義します。再利用可能な変換ロジックを作成するためのパターンです。

::: info
`@UsePipes()` による自動パイプ実行はまだ利用できません。パイプはハンドラーメソッドやサービス内で手動で使用できます。
:::

## PipeTransform インターフェース

```typescript
interface PipeTransform {
  transform(value: any, metadata?: PipeMetadata): Promise<any> | any;
}

interface PipeMetadata {
  type: string;
  data?: any;
}
```

## パイプの作成

### バリデーションパイプ

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

### ParseInt パイプ

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

### トリムパイプ

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

## パイプの手動使用

`@UsePipes()` が利用可能になるまで、パイプをインジェクトして明示的に適用します:

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

## スキーマベースのバリデーション

入力バリデーションには `@Body`、`@Param`、`@Query` パラメータデコレータと TypeBox スキーマを使用することをお勧めします — Elysia のランタイムバリデーションと直接統合されます:

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
