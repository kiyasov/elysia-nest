---
title: Guards
icon: shield
description: "Защищайте маршруты с помощью логики авторизации и @UseGuards()"
---

Guards определяют, должен ли запрос перейти к обработчику маршрута. Они реализуют интерфейс `CanActivate` и автоматически выполняются до вызова обработчика.

## Интерфейс CanActivate

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

Если `canActivate` возвращает `false`, запрос отклоняется с ошибкой **403 Forbidden**. Если возвращает `true`, запрос проходит дальше.

## Создание Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from "nestelia";

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers.get("authorization") !== null;
  }
}
```

Guards также могут быть асинхронными:

```typescript
@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.get("authorization");
    const user = await this.userService.verifyToken(token);
    return user?.role === "admin";
  }
}
```

## Декоратор @UseGuards()

Применяйте guards на уровне **метода** (один маршрут) или **класса** (все маршруты controller). Если присутствуют оба, guards уровня класса выполняются первыми.

```typescript
import { Controller, Get, UseGuards } from "nestelia";

@Controller("/admin")
@UseGuards(AuthGuard)       // выполняется для каждого маршрута controller
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → обработчик
  stats() {
    return { data: "stats" };
  }
}
```

Несколько guards можно объединять в цепочку — они выполняются **по порядку**, и первый `false` останавливает цепочку:

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## Guards с поддержкой DI

Если guard зарегистрирован как provider в module, он будет разрешён из DI container (что позволяет инжектировать зависимости через конструктор). В противном случае он инстанциируется напрямую.

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard получает DI
})
class AdminModule {}
```

## ExecutionContext

`ExecutionContext`, передаваемый в `canActivate`, предоставляет доступ к текущему запросу и метаданным обработчика:

```typescript
interface ExecutionContext {
  /** Класс controller */
  getClass<T = any>(): T;
  /** Функция-обработчик маршрута */
  getHandler(): (...args: unknown[]) => unknown;
  /** Все аргументы обработчика */
  getArgs<T extends any[] = any[]>(): T;
  /** Отдельный аргумент по индексу */
  getArgByIndex<T = any>(index: number): T;
  /** Тип контекста — "http" для HTTP-маршрутов */
  getType<T extends string = string>(): T;
  /** Переключение на HTTP-контекст */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Объект Web API Request */
  getRequest<T = any>(): T;
  /** Контекст Elysia (содержит set.status, set.headers и т.д.) */
  getResponse<T = any>(): T;
}
```

### Доступ к сырому запросу

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### Доступ к контексту Elysia (статус, заголовки, cookie)

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## Конвейер запроса

Guards выполняются **после** разрешения controller и обработчика, **до** interceptors и самого обработчика:

```
Request → Controller resolved → Guards → Interceptors → Handler → Response
```