---
title: Instalación
icon: download
description: Instala nestelia y configura tu proyecto
---

## Requisitos Previos

- [Bun](https://bun.sh/) v1.0 o superior
- TypeScript 5.0+

## Instalar

```bash
bun add nestelia elysia
```

nestelia requiere `elysia` ^1.2.0 como dependencia de par.

## Configuración de TypeScript

nestelia depende de decoradores y reflexión de metadatos. Asegúrate de que tu `tsconfig.json` incluya:

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

## Dependencias de Pares Opcionales

Todos los subpaths están incluidos en el paquete `nestelia`. Instala únicamente las dependencias de pares que necesites:

```bash
# Microservicios — transporte Redis
bun add ioredis

# Microservicios — transporte RabbitMQ
bun add amqplib

# Apollo GraphQL
bun add @apollo/server graphql graphql-ws

# Autenticación con Passport
bun add passport

# Cache manager
bun add cache-manager

# Mensajería RabbitMQ
bun add amqplib

# GraphQL PubSub (Redis)
bun add ioredis
```

## Verificar la Instalación

Crea una aplicación mínima para verificar que todo funciona:

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
