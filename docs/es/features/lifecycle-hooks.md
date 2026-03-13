---
title: Hooks de Ciclo de Vida
icon: refresh-cw
description: Engancha eventos del ciclo de vida de la aplicación y los módulos
---

nestelia proporciona hooks de ciclo de vida que te permiten ejecutar lógica en puntos específicos durante el arranque y el apagado de la aplicación.

## Hooks del Ciclo de Vida del Módulo

Implementa estas interfaces en tus servicios `@Injectable()` o controladores:

### OnModuleInit

Se llama una vez que **todos** los proveedores de todos los módulos han sido instanciados. Esto garantiza que cualquier proveedor puede obtenerse de forma segura mediante `ModuleRef` en este momento:

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

Puedes usar `ModuleRef` para obtener dinámicamente otro proveedor dentro de `onModuleInit`:

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

Se llama después de que todos los módulos han sido inicializados:

```typescript
@Injectable()
class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log("Application is ready");
  }
}
```

### OnModuleDestroy

Se llama cuando el módulo está siendo destruido (durante el apagado):

```typescript
@Injectable()
class CacheService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.cache.flush();
  }
}
```

### BeforeApplicationShutdown

Se llama antes de que la aplicación comience a apagarse. Recibe la señal que desencadenó el apagado:

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

Se llama después de que todos los módulos han sido destruidos:

```typescript
@Injectable()
class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await this.releaseResources();
  }
}
```

## Orden de Ejecución

Durante el arranque:
1. `OnModuleInit` — por módulo, en orden de importación
2. `OnApplicationBootstrap` — después de que todos los módulos han sido inicializados

Durante el apagado:
1. `BeforeApplicationShutdown`
2. `OnModuleDestroy`
3. `OnApplicationShutdown`

## Decoradores de Ciclo de Vida de Elysia

nestelia también expone los hooks del ciclo de vida de solicitudes de Elysia como decoradores de métodos en los controladores:

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
    // se ejecuta antes del manejador de ruta
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

Decoradores de ciclo de vida de Elysia disponibles:

| Decorador | Hook |
|-----------|------|
| `@OnRequest()` | Antes del enrutamiento |
| `@OnParse()` | Parseo del cuerpo |
| `@OnTransform()` | Transformar solicitud |
| `@OnBeforeHandle()` | Antes del manejador |
| `@OnAfterHandle()` | Después del manejador |
| `@OnMapResponse()` | Mapear respuesta |
| `@OnAfterResponse()` | Después de enviar la respuesta |
| `@OnError()` | Manejador de errores |
