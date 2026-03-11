---
title: Introdução
description: Um framework modular orientado a decoradores construído sobre o Elysia
---

# nestelia

**nestelia** é um framework modular orientado a decoradores construído sobre o [Elysia](https://elysiajs.com/) e o [Bun](https://bun.sh/). Ele fornece decoradores, injeção de dependências, módulos e hooks de ciclo de vida para a construção de aplicações server-side estruturadas.

::: warning
O nestelia está em desenvolvimento ativo. As APIs podem mudar antes do lançamento estável.
:::

## Por que nestelia?

O Elysia é um dos frameworks HTTP nativos do Bun mais rápidos que existem. O nestelia adiciona uma arquitetura modular e estruturada sobre ele — sem sacrificar a performance do Elysia.

- **Decoradores** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param` e muito mais
- **Injeção de Dependências** — DI baseada em construtor com escopos singleton, transient e request
- **Módulos** — encapsule controllers, providers e imports em unidades coesas
- **Hooks de Ciclo de Vida** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy` e outros
- **Guards, Interceptors, Pipes** — extensibilidade do pipeline de requisições
- **Middleware** — suporte a middleware baseado em classe e funcional
- **Tratamento de Exceções** — exceções HTTP integradas com respostas de erro automáticas
- **Validação TypeBox** — validação de requisições baseada em schema via integração nativa do TypeBox do Elysia

## Pacotes

Além do core, o nestelia fornece pacotes opcionais:

| Pacote | Descrição |
|--------|-----------|
| `nestelia/scheduler` | Cron jobs, intervalos e timeouts |
| `nestelia/microservices` | Transportes Redis, RabbitMQ e TCP |
| `nestelia/apollo` | Integração Apollo GraphQL code-first |
| `nestelia/passport` | Estratégias de autenticação Passport.js |
| `nestelia/testing` | Módulos de teste isolados com substituição de providers |
| `nestelia/cache` | Cache de respostas HTTP com decoradores |
| `nestelia/rabbitmq` | Mensageria avançada com RabbitMQ |
| `nestelia/graphql-pubsub` | Redis PubSub para subscriptions GraphQL |

## Exemplo Rápido

```typescript
import { createElysiaApplication, Controller, Get, Module, Injectable, Inject } from "nestelia";

@Injectable()
class GreetService {
  hello() {
    return { message: "Hello from nestelia!" };
  }
}

@Controller("/greet")
class GreetController {
  constructor(@Inject(GreetService) private greet: GreetService) {}

  @Get("/")
  sayHello() {
    return this.greet.hello();
  }
}

@Module({
  controllers: [GreetController],
  providers: [GreetService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Skill para Claude Code

Uma skill do [Claude Code](https://claude.ai/claude-code) está disponível para o nestelia. Ela fornece templates de scaffolding, uso de decoradores e boas práticas diretamente no seu assistente de IA.

```bash
npx skills add nestelia/nestelia
```

Após a instalação, o Claude Code usará automaticamente os padrões corretos ao trabalhar com o `nestelia`.

## Próximos Passos

- [Instalação](/pt/getting-started/installation) — Instale o nestelia e suas dependências peer.
- [Quick Start](/pt/getting-started/quick-start) — Construa seu primeiro app CRUD em 5 minutos.
- [Módulos](/pt/core-concepts/modules) — Aprenda como os módulos organizam sua aplicação.
- [Injeção de Dependências](/pt/features/dependency-injection) — DI baseada em construtor com múltiplos escopos.
