---
title: Lifecycle Hooks
icon: refresh-cw
description: Подключайтесь к событиям жизненного цикла приложения и module
---

nestelia предоставляет lifecycle hooks, позволяющие выполнять логику в определённые моменты запуска и завершения работы приложения.

## Lifecycle Hooks модуля

Реализуйте эти интерфейсы в ваших `@Injectable()` services или controllers:

### OnModuleInit

Вызывается после того, как **все** providers во всех модулях были инстанциированы. Это гарантирует, что любой provider можно безопасно получить через `ModuleRef` в этот момент:

```typescript
import { Injectable, OnModuleInit } from "nestelia";

@Injectable()
class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log("Database connected");
  }
}
```

Используйте `ModuleRef` для динамического получения другого provider внутри `onModuleInit`:

```typescript
import { Injectable, ModuleRef, OnModuleInit } from "nestelia";

@Injectable()
class CacheService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    const db = this.moduleRef.get(DatabaseService);
    console.log(`Cache connected to ${db.getUrl()}`);
  }
}
```

### OnApplicationBootstrap

Вызывается после того, как все modules были инициализированы:

```typescript
@Injectable()
class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log("Application is ready");
  }
}
```

### OnModuleDestroy

Вызывается при уничтожении module (во время завершения работы):

```typescript
@Injectable()
class CacheService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.cache.flush();
  }
}
```

### BeforeApplicationShutdown

Вызывается перед началом завершения работы приложения. Получает сигнал, инициировавший завершение:

```typescript
@Injectable()
class GracefulService implements BeforeApplicationShutdown {
  async beforeApplicationShutdown(signal?: string) {
    console.log(`Shutting down due to: ${signal}`);
    await this.drainRequests();
  }
}
```

### OnApplicationShutdown

Вызывается после уничтожения всех modules:

```typescript
@Injectable()
class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await this.releaseResources();
  }
}
```

## Порядок выполнения

При запуске:
1. `OnModuleInit` — для каждого module в порядке импорта
2. `OnApplicationBootstrap` — после инициализации всех modules

При завершении:
1. `BeforeApplicationShutdown`
2. `OnModuleDestroy`
3. `OnApplicationShutdown`

## Декораторы lifecycle Elysia

nestelia также предоставляет lifecycle hooks запроса Elysia в виде декораторов методов на controllers:

```typescript
import {
  OnRequest,
  OnBeforeHandle,
  OnAfterHandle,
  OnAfterResponse,
  OnError,
} from "nestelia";

@Controller("/")
class AppController {
  @OnRequest()
  logRequest(ctx: any) {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
  }

  @OnBeforeHandle()
  checkAuth(ctx: any) {
    // выполняется перед обработчиком маршрута
  }

  @OnAfterHandle()
  addHeaders(ctx: any) {
    ctx.set.headers["x-powered-by"] = "nestelia";
  }

  @OnError()
  handleError(ctx: any) {
    console.error("Error:", ctx.error);
  }

  @OnAfterResponse()
  logResponse(ctx: any) {
    console.log("Response sent");
  }
}
```

Доступные декораторы lifecycle Elysia:

| Декоратор | Hook |
|-----------|------|
| `@OnRequest()` | До маршрутизации |
| `@OnParse()` | Разбор тела запроса |
| `@OnTransform()` | Трансформация запроса |
| `@OnBeforeHandle()` | До обработчика |
| `@OnAfterHandle()` | После обработчика |
| `@OnMapResponse()` | Маппинг ответа |
| `@OnAfterResponse()` | После отправки ответа |
| `@OnError()` | Обработчик ошибок |