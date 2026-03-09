---
title: Hooks de Ciclo de Vida
icon: refresh-cw
description: Conecte-se a eventos do ciclo de vida da aplicação e dos módulos
---

O nestelia fornece hooks de ciclo de vida que permitem executar lógica em momentos específicos durante o processo de inicialização e desligamento da aplicação.

## Hooks de Ciclo de Vida do Módulo

Implemente essas interfaces nos seus services `@Injectable()` ou controllers:

### OnModuleInit

Chamado assim que os providers do módulo foram instanciados:

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

### OnApplicationBootstrap

Chamado após todos os módulos terem sido inicializados:

```typescript
@Injectable()
class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log("Application is ready");
  }
}
```

### OnModuleDestroy

Chamado quando o módulo está sendo destruído (durante o desligamento):

```typescript
@Injectable()
class CacheService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.cache.flush();
  }
}
```

### BeforeApplicationShutdown

Chamado antes de a aplicação começar a desligar. Recebe o sinal que disparou o desligamento:

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

Chamado após todos os módulos terem sido destruídos:

```typescript
@Injectable()
class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await this.releaseResources();
  }
}
```

## Ordem de Execução

Durante a inicialização:
1. `OnModuleInit` — por módulo, na ordem de importação
2. `OnApplicationBootstrap` — após todos os módulos inicializados

Durante o desligamento:
1. `BeforeApplicationShutdown`
2. `OnModuleDestroy`
3. `OnApplicationShutdown`

## Decoradores de Ciclo de Vida do Elysia

O nestelia também expõe os hooks de ciclo de vida de requisição do Elysia como decoradores de método nos controllers:

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
    // executado antes do handler de rota
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

Decoradores de ciclo de vida do Elysia disponíveis:

| Decorador | Hook |
|-----------|------|
| `@OnRequest()` | Antes do roteamento |
| `@OnParse()` | Análise do corpo |
| `@OnTransform()` | Transformação da requisição |
| `@OnBeforeHandle()` | Antes do handler |
| `@OnAfterHandle()` | Após o handler |
| `@OnMapResponse()` | Mapeamento da resposta |
| `@OnAfterResponse()` | Após o envio da resposta |
| `@OnError()` | Handler de erro |
