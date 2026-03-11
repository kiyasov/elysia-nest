---
title: Introducción
description: Un framework modular orientado a decoradores construido sobre Elysia
---

# nestelia

**nestelia** es un framework modular orientado a decoradores construido sobre [Elysia](https://elysiajs.com/) y [Bun](https://bun.sh/). Provee decoradores, inyección de dependencias, módulos y hooks de ciclo de vida para construir aplicaciones del lado del servidor con estructura clara.

::: warning
nestelia se encuentra en desarrollo activo. Las APIs pueden cambiar antes del lanzamiento estable.
:::

## ¿Por qué nestelia?

Elysia es uno de los frameworks HTTP nativos de Bun más rápidos. nestelia agrega una arquitectura modular y estructurada sobre él, sin sacrificar el rendimiento de Elysia.

- **Decoradores** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param` y más
- **Inyección de Dependencias** — DI basada en constructores con alcances singleton, transient y request
- **Módulos** — encapsulan controladores, proveedores e imports en unidades cohesivas
- **Hooks de Ciclo de Vida** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy` y otros
- **Guards, Interceptores, Pipes** — extensibilidad del pipeline de solicitudes
- **Middleware** — soporte de middleware basado en clases y funcional
- **Manejo de Excepciones** — excepciones HTTP integradas con respuestas de error automáticas
- **Validación con TypeBox** — validación de solicitudes basada en esquemas mediante la integración nativa de TypeBox de Elysia

## Paquetes

Además del núcleo, nestelia incluye paquetes opcionales:

| Paquete | Descripción |
|---------|-------------|
| `nestelia/scheduler` | Cron jobs, intervalos y timeouts |
| `nestelia/microservices` | Transportes Redis, RabbitMQ, TCP |
| `nestelia/apollo` | Integración Apollo GraphQL code-first |
| `nestelia/passport` | Estrategias de autenticación Passport.js |
| `nestelia/testing` | Módulos de prueba aislados con sobreescritura de proveedores |
| `nestelia/cache` | Caché de respuestas HTTP con decoradores |
| `nestelia/rabbitmq` | Mensajería avanzada con RabbitMQ |
| `nestelia/graphql-pubsub` | Redis PubSub para suscripciones GraphQL |

## Ejemplo Rápido

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

Hay un skill de [Claude Code](https://claude.ai/claude-code) disponible para nestelia. Proporciona plantillas de andamiaje, uso de decoradores y buenas prácticas directamente en tu asistente de IA.

```bash
npx skills add nestelia/nestelia
```

Una vez instalado, Claude Code utilizará automáticamente los patrones correctos al trabajar con `nestelia`.

## Próximos Pasos

- [Instalación](/es/getting-started/installation) — Instala nestelia y sus dependencias de pares.
- [Inicio Rápido](/es/getting-started/quick-start) — Construye tu primera app CRUD en 5 minutos.
- [Módulos](/es/core-concepts/modules) — Aprende cómo los módulos organizan tu aplicación.
- [Inyección de Dependencias](/es/features/dependency-injection) — DI basada en constructores con múltiples alcances.
