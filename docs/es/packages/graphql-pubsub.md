---
title: GraphQL PubSub
icon: rss
description: PubSub basado en Redis para suscripciones GraphQL
---

El paquete GraphQL PubSub proporciona un sistema de publicación/suscripción respaldado por Redis para suscripciones GraphQL con soporte de iteradores asíncronos.

## Instalación

```bash
bun add ioredis
```

## Uso Básico

```typescript
import { RedisPubSub } from "nestelia/graphql-pubsub";

const pubsub = new RedisPubSub({
  connection: {
    host: "localhost",
    port: 6379,
  },
  keyPrefix: "myapp:",
});

// Publicar un evento
await pubsub.publish("user-created", { id: 1, name: "John" });

// Suscribirse a eventos
const subId = await pubsub.subscribe("user-created", (message) => {
  console.log("New user:", message);
});

// Cancelar suscripción
pubsub.unsubscribe(subId);

// Cerrar conexiones
await pubsub.close();
```

## Registro del Módulo

### Configuración Estática

```typescript
import { Module } from "nestelia";
import { GraphQLPubSubModule } from "nestelia/graphql-pubsub";

@Module({
  imports: [
    GraphQLPubSubModule.forRoot({
      useValue: {
        connection: {
          host: "localhost",
          port: 6379,
        },
        keyPrefix: "myapp:",
      },
    }),
  ],
})
class AppModule {}
```

### Con Clientes Redis Existentes

```typescript
import Redis from "ioredis";

const publisher = new Redis({ host: "localhost", port: 6379 });
const subscriber = new Redis({ host: "localhost", port: 6379 });

GraphQLPubSubModule.forRoot({
  useExisting: {
    publisher,
    subscriber,
    keyPrefix: "myapp:",
  },
})
```

### Configuración Asíncrona

```typescript
import { GraphQLPubSubModule } from "nestelia/graphql-pubsub";

GraphQLPubSubModule.forRootAsync({
  useFactory: async (config: ConfigService) => ({
    connection: {
      host: config.get("REDIS_HOST"),
      port: config.get("REDIS_PORT"),
      password: config.get("REDIS_PASSWORD"),
    },
    keyPrefix: config.get("REDIS_PREFIX"),
  }),
  inject: [ConfigService],
})
```

## Uso con Resolvers de GraphQL

```typescript
import { Resolver, Query, Mutation, Subscription } from "nestelia/apollo";
import { InjectPubSub, RedisPubSub } from "nestelia/graphql-pubsub";

@Resolver("User")
class UserResolver {
  constructor(
    @InjectPubSub() private pubsub: RedisPubSub,
    @Inject(UserService) private userService: UserService
  ) {}

  @Mutation(() => User)
  async createUser(@Args("input") input: CreateUserInput) {
    const user = await this.userService.create(input);
    await this.pubsub.publish("user-created", user);
    return user;
  }

  @Subscription(() => User)
  userCreated() {
    return this.pubsub.asyncIterator("user-created");
  }
}
```

## Suscripciones por Patrón

Suscríbete usando patrones de estilo glob:

```typescript
const subId = await pubsub.subscribe(
  "user.*",
  (message) => {
    console.log("User event:", message);
  },
  { pattern: true } // usa Redis psubscribe
);
```

## Serialización Personalizada

```typescript
const pubsub = new RedisPubSub({
  connection: { host: "localhost", port: 6379 },
  serializer: (payload) => JSON.stringify(payload),
  deserializer: (payload) => JSON.parse(payload),
});
```

## Referencia de la API

### RedisPubSub

| Método | Descripción |
|--------|-------------|
| `publish(trigger, payload)` | Publica un mensaje en un canal |
| `subscribe(trigger, handler, options?)` | Se suscribe a un canal. Devuelve un ID de suscripción numérico |
| `unsubscribe(subId)` | Cancela una suscripción |
| `asyncIterator(triggers)` | Crea un iterador asíncrono para suscripciones GraphQL |
| `getPublisher()` | Obtiene el cliente Redis publicador |
| `getSubscriber()` | Obtiene el cliente Redis suscriptor |
| `close()` | Cierra todas las conexiones |

### RedisPubSubOptions

```typescript
interface RedisPubSubOptions {
  keyPrefix?: string;
  publisher?: Redis;
  subscriber?: Redis;
  connection?: Redis.ConnectionOptions;
  triggerTransform?: TriggerTransform;
  serializer?: (payload: unknown) => string;
  deserializer?: (payload: string) => unknown;
  reviver?: (key: string, value: unknown) => unknown;
}
```
