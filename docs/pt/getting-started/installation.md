---
title: Instalação
icon: download
description: Instale o nestelia e configure seu projeto
---

## Pré-requisitos

- [Bun](https://bun.sh/) v1.0 ou superior
- TypeScript 5.0+

## Instalar

```bash
bun add nestelia elysia
```

O nestelia requer `elysia` ^1.2.0 como dependência peer.

## Configuração do TypeScript

O nestelia depende de decoradores e reflexão de metadados. Certifique-se de que seu `tsconfig.json` inclua:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## Dependências Peer Opcionais

Todos os subpaths estão incluídos no pacote `nestelia`. Instale apenas as dependências peer que você precisar:

```bash
# Microserviços — transporte Redis
bun add ioredis

# Microserviços — transporte RabbitMQ
bun add amqplib

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Autenticação Passport
bun add passport

# Cache manager
bun add cache-manager

# Mensageria RabbitMQ
bun add amqplib

# GraphQL PubSub (Redis)
bun add ioredis
```

## Verificar a Instalação

Crie um app mínimo para verificar se tudo está funcionando:

```typescript
import { createElysiaApplication, Controller, Get, Module } from "nestelia";

@Controller("/")
class AppController {
  @Get("/")
  hello() {
    return { status: "ok" };
  }
}

@Module({ controllers: [AppController] })
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

```bash
bun run app.ts
```
