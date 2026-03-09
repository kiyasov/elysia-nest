---
title: Pipes
icon: funnel
description: Transforma y valida la entrada del manejador con pipes
---

Los pipes definen una interfaz `PipeTransform` para transformar o validar datos. Son un patrón para crear lógica de transformación reutilizable.

::: info
La ejecución automática de pipes mediante `@UsePipes()` aún no está disponible. Los pipes pueden usarse manualmente dentro de los métodos del manejador o de los servicios.
:::

## Interfaz PipeTransform

```typescript
interface PipeTransform {
  transform(value: any, metadata?: PipeMetadata): Promise<any> | any;
}

interface PipeMetadata {
  type: string;
  data?: any;
}
```

## Crear un Pipe

### Pipe de Validación

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

## Usar Pipes Manualmente

Hasta que `@UsePipes()` esté disponible, inyecta un pipe y aplícalo explícitamente:

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

## Validación Basada en Esquemas

Para la validación de entrada, se prefiere usar esquemas TypeBox con los decoradores de parámetros `@Body`, `@Param` y `@Query` — se integran directamente con la validación en tiempo de ejecución de Elysia:

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
