---
title: Cache Manager
icon: database
description: Cache de respostas HTTP com decoradores
---

O pacote cache manager fornece cache automático de respostas HTTP com configuração baseada em decoradores.

## Instalação

```bash
bun add cache-manager
```

## Configuração

```typescript
import { Module } from "nestelia";
import { CacheModule } from "nestelia/cache";

@Module({
  imports: [
    CacheModule.register({
      ttl: 60000, // TTL padrão em milissegundos (60 segundos)
    }),
  ],
})
class AppModule {}
```

### Configuração Assíncrona

```typescript
import { CacheModule } from "nestelia/cache";

CacheModule.registerAsync({
  useFactory: async (config: ConfigService) => ({
    ttl: config.get("CACHE_TTL"),      // em milissegundos
    store: config.get("CACHE_STORE"),  // "memory" ou um redis store
  }),
  inject: [ConfigService],
})
```

## Decoradores

### @CacheKey()

Define uma chave de cache customizada para uma rota:

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

Chaves de cache dinâmicas usando uma função factory:

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

Sobrescreve o TTL padrão para uma rota específica. O valor está em **milissegundos**:

```typescript
import { CacheTTL } from "nestelia/cache";

@Get("/stats")
@CacheTTL(300000) // cache por 5 minutos (300.000 ms)
getStats() {
  return this.statsService.compute();
}
```

TTL dinâmico:

```typescript
@Get("/data")
@CacheTTL((context: ExecutionContext) => {
  const ctx = context.switchToHttp().getRequest<any>();
  // cache mais curto para usuários autenticados
  return ctx.user ? 30000 : 300000;
})
getData() {
  return this.dataService.fetch();
}
```

## CacheInterceptor

Aplique o `CacheInterceptor` para fazer cache de respostas automaticamente:

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

## Injetando o Cache Manager

Injete a instância de cache diretamente para operações manuais de cache:

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

## Stores de Cache

- **Em memória** — padrão, sem dependências adicionais
- **Redis** — para cache distribuído entre múltiplas instâncias

```typescript
import { redisStore } from "cache-manager-redis-yet";

CacheModule.register({
  store: redisStore,
  host: "localhost",
  port: 6379,
  ttl: 60000,
})
```
