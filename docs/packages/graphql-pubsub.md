---
title: GraphQL PubSub
icon: rss
description: Redis-based PubSub for GraphQL subscriptions
---

The GraphQL PubSub package provides a Redis-backed publish/subscribe system for GraphQL subscriptions with async iterator support.

## Installation

```bash
bun add ioredis
```

## Basic Usage

```typescript
import { RedisPubSub } from "@kiyasov/elysia-nest/graphql-pubsub";

const pubsub = new RedisPubSub({
  connection: {
    host: "localhost",
    port: 6379,
  },
  keyPrefix: "myapp:",
});

// Publish an event
await pubsub.publish("user-created", { id: 1, name: "John" });

// Subscribe to events
const subId = await pubsub.subscribe("user-created", (message) => {
  console.log("New user:", message);
});

// Unsubscribe
pubsub.unsubscribe(subId);

// Close connections
await pubsub.close();
```

## Module Registration

### Static Configuration

```typescript
import { Module } from "@kiyasov/elysia-nest";
import { GraphQLPubSubModule } from "@kiyasov/elysia-nest/graphql-pubsub";

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

### With Existing Redis Clients

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

### Async Configuration

```typescript
import { GraphQLPubSubModule } from "@kiyasov/elysia-nest/graphql-pubsub";

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

## Using with GraphQL Resolvers

```typescript
import { Resolver, Query, Mutation, Subscription } from "@kiyasov/elysia-nest/apollo";
import { InjectPubSub, RedisPubSub } from "@kiyasov/elysia-nest/graphql-pubsub";

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

## Pattern Subscriptions

Subscribe using glob-style patterns:

```typescript
const subId = await pubsub.subscribe(
  "user.*",
  (message) => {
    console.log("User event:", message);
  },
  { pattern: true } // uses Redis psubscribe
);
```

## Custom Serialization

```typescript
const pubsub = new RedisPubSub({
  connection: { host: "localhost", port: 6379 },
  serializer: (payload) => JSON.stringify(payload),
  deserializer: (payload) => JSON.parse(payload),
});
```

## API Reference

### RedisPubSub

| Method | Description |
|--------|-------------|
| `publish(trigger, payload)` | Publish a message to a channel |
| `subscribe(trigger, handler, options?)` | Subscribe to a channel. Returns numeric subscription ID |
| `unsubscribe(subId)` | Cancel a subscription |
| `asyncIterator(triggers)` | Create an async iterator for GraphQL subscriptions |
| `getPublisher()` | Get the Redis publisher client |
| `getSubscriber()` | Get the Redis subscriber client |
| `close()` | Close all connections |

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
