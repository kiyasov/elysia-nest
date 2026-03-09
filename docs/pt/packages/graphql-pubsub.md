---
title: GraphQL PubSub
icon: rss
description: PubSub baseado em Redis para subscriptions GraphQL
---

O pacote GraphQL PubSub fornece um sistema de publish/subscribe com suporte a Redis para subscriptions GraphQL, com suporte a async iterator.

## Instalação

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

// Publicar um evento
await pubsub.publish("user-created", { id: 1, name: "John" });

// Subscrever a eventos
const subId = await pubsub.subscribe("user-created", (message) => {
  console.log("New user:", message);
});

// Cancelar subscrição
pubsub.unsubscribe(subId);

// Fechar conexões
await pubsub.close();
```

## Registro do Módulo

### Configuração Estática

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

### Com Clientes Redis Existentes

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

### Configuração Assíncrona

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

## Usando com Resolvers GraphQL

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

## Subscriptions por Padrão

Subscreva usando padrões no estilo glob:

```typescript
const subId = await pubsub.subscribe(
  "user.*",
  (message) => {
    console.log("User event:", message);
  },
  { pattern: true } // usa Redis psubscribe
);
```

## Serialização Customizada

```typescript
const pubsub = new RedisPubSub({
  connection: { host: "localhost", port: 6379 },
  serializer: (payload) => JSON.stringify(payload),
  deserializer: (payload) => JSON.parse(payload),
});
```

## Referência da API

### RedisPubSub

| Método | Descrição |
|--------|-----------|
| `publish(trigger, payload)` | Publica uma mensagem em um canal |
| `subscribe(trigger, handler, options?)` | Subscreve a um canal. Retorna o ID numérico da subscrição |
| `unsubscribe(subId)` | Cancela uma subscrição |
| `asyncIterator(triggers)` | Cria um async iterator para subscriptions GraphQL |
| `getPublisher()` | Obtém o cliente Redis publisher |
| `getSubscriber()` | Obtém o cliente Redis subscriber |
| `close()` | Fecha todas as conexões |

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
