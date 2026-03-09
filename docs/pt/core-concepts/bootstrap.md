---
title: Bootstrap
icon: power
description: Inicialize e inicie sua aplicação nestelia
---

A função `createElysiaApplication` inicializa o módulo raiz e retorna uma instância do Elysia pronta para escutar requisições.

## Uso Básico

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## O que createElysiaApplication Faz

1. **Resolve a árvore de módulos** — processa imports, providers e controllers recursivamente
2. **Registra providers** — adiciona todos os providers ao container de DI
3. **Instancia controllers** — cria instâncias de controllers com dependências injetadas
4. **Registra rotas** — mapeia métodos decorados para rotas do Elysia
5. **Executa hooks de ciclo de vida** — chama `onModuleInit` e `onApplicationBootstrap` em ordem
6. **Retorna um ElysiaNestApplication** — pronto para chamar `.listen()`

## Com Microserviços

Ao usar o pacote de microserviços, `createElysiaApplication` retorna um `ElysiaNestApplication` que suporta modo híbrido HTTP + microserviço:

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```

## Desligamento Gracioso

O nestelia suporta hooks de ciclo de vida para desligamento. Quando o processo recebe um sinal de terminação:

1. Hooks `BeforeApplicationShutdown` são executados primeiro
2. Hooks `OnModuleDestroy` são executados para limpeza
3. Hooks `OnApplicationShutdown` são executados por último

```typescript
@Injectable()
class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.connection.close();
  }
}
```
