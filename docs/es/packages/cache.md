---
title: Cache Manager
icon: database
description: Caché de respuestas HTTP con decoradores
---

El paquete cache manager proporciona caché automático de respuestas HTTP con configuración basada en decoradores.

## Instalación

```bash
bun add cache-manager
```

## Configuración

```typescript
import { Module } from "nestelia";
import { CacheModule } from "nestelia/cache";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // TTL por defecto en milisegundos (60 segundos)
    }),
  ],
})
class AppModule {}
```

### Configuración Asíncrona

```typescript
import { CacheModule } from "nestelia/cache";

CacheModule.registerAsync({
  useFactory: async (config: ConfigService) => ({
    ttl: config.get("CACHE_TTL"),      // en milisegundos
    store: config.get("CACHE_STORE"),  // "memory" o un store de redis
  }),
  inject: [ConfigService],
})
```

## Decoradores

### @CacheKey()

Establece una clave de caché personalizada para una ruta:

```typescript
import { CacheKey } from "nestelia/cache";

@Controller("/users")
class UserController {
  @Get("/")
  @CacheKey("all-users")
  findAll() {
    return this.userService.findAll();
  }
}
```

Claves de caché dinámicas usando una función de fábrica:

```typescript
import { CacheKey } from "nestelia/cache";

@Get("/:id")
@CacheKey((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  return `user-${ctx.params.id}`;
})
findOne(@Ctx() ctx: any) {
  return this.userService.findById(ctx.params.id);
}
```

### @CacheTTL()

Sobreescribe el TTL por defecto para una ruta específica. El valor está en **milisegundos**:

```typescript
import { CacheTTL } from "nestelia/cache";

@Get("/stats")
@CacheTTL(300000) // caché por 5 minutos (300,000 ms)
getStats() {
  return this.statsService.compute();
}
```

TTL dinámico:

```typescript
@Get("/data")
@CacheTTL((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  // caché más corto para usuarios autenticados
  return ctx.user ? 30000 : 300000;
})
getData() {
  return this.dataService.fetch();
}
```

## CacheInterceptor

Aplica el `CacheInterceptor` para cachear respuestas automáticamente:

```typescript
import { CacheInterceptor } from "nestelia/cache";

@Controller("/products")
@UseInterceptors(CacheInterceptor)
class ProductController {
  @Get("/")
  @CacheTTL(120000) // 2 minutos
  findAll() {
    return this.productService.findAll();
  }
}
```

## Inyectar el Cache Manager

Inyecta la instancia de caché directamente para operaciones de caché manuales:

```typescript
import { Injectable, Inject } from "nestelia";
import { CACHE_MANAGER, Cache } from "nestelia/cache";

@Injectable()
class UserService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async findAll() {
    const cached = await this.cache.get("all-users");
    if (cached) return cached;

    const users = await this.db.users.findMany();
    await this.cache.set("all-users", users, 60000); // 60 segundos
    return users;
  }
}
```

## Stores de Caché

- **En memoria** — por defecto, sin dependencias adicionales
- **Redis** — para caché distribuido entre múltiples instancias

```typescript
import { redisStore } from "cache-manager-redis-yet";

CacheModule.register({
  store: redisStore,
  host: "localhost",
  port: 6379,
  ttl: 60000,
})
```
