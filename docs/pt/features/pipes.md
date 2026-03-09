---
title: Pipes
icon: funnel
description: Transforme e valide entradas do handler com pipes
---

Pipes definem uma interface `PipeTransform` para transformar ou validar dados. São um padrão para criar lógica de transformação reutilizável.

::: info
A execução automática de pipes via `@UsePipes()` ainda não está disponível. Os pipes podem ser usados manualmente dentro de métodos de handler ou services.
:::

## Interface PipeTransform

```typescript
interface PipeTransform {
  transform(value: any, metadata?: PipeMetadata): Promise<any> | any;
}

interface PipeMetadata {
  type: string;
  data?: any;
}
```

## Criando um Pipe

### Pipe de Validação

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

### Pipe ParseInt

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

### Pipe Trim

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

## Usando Pipes Manualmente

Até que `@UsePipes()` esteja disponível, injete um pipe e aplique-o explicitamente:

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

## Validação Baseada em Schema

Para validação de entrada, prefira schemas TypeBox com os decoradores de parâmetro `@Body`, `@Param` e `@Query` — eles se integram diretamente com a validação em tempo de execução do Elysia:

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
