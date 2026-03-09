---
title: GraphQL PubSub
icon: rss
description: 基于 Redis 的 GraphQL 订阅 PubSub
---

GraphQL PubSub 包提供了支持异步迭代器的 Redis 支持的发布/订阅系统，用于 GraphQL 订阅。

## 安装

```bash
bun add ioredis
```

## 基本用法

```typescript
import { RedisPubSub } from "nestelia/graphql-pubsub";

const pubsub = new RedisPubSub({
  connection: {
    host: "localhost",
    port: 6379,
  },
  keyPrefix: "myapp:",
});

// 发布事件
await pubsub.publish("user-created", { id: 1, name: "John" });

// 订阅事件
const subId = await pubsub.subscribe("user-created", (message) => {
  console.log("New user:", message);
});

// 取消订阅
pubsub.unsubscribe(subId);

// 关闭连接
await pubsub.close();
```

## 模块注册

### 静态配置

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

### 使用现有 Redis 客户端

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

### 异步配置

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

## 与 GraphQL 解析器配合使用

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

## 模式订阅

使用 glob 风格模式订阅：

```typescript
const subId = await pubsub.subscribe(
  "user.*",
  (message) => {
    console.log("User event:", message);
  },
  { pattern: true } // 使用 Redis psubscribe
);
```

## 自定义序列化

```typescript
const pubsub = new RedisPubSub({
  connection: { host: "localhost", port: 6379 },
  serializer: (payload) => JSON.stringify(payload),
  deserializer: (payload) => JSON.parse(payload),
});
```

## API 参考

### RedisPubSub

| 方法 | 描述 |
|------|------|
| `publish(trigger, payload)` | 向频道发布消息 |
| `subscribe(trigger, handler, options?)` | 订阅频道，返回数字订阅 ID |
| `unsubscribe(subId)` | 取消订阅 |
| `asyncIterator(triggers)` | 为 GraphQL 订阅创建异步迭代器 |
| `getPublisher()` | 获取 Redis 发布客户端 |
| `getSubscriber()` | 获取 Redis 订阅客户端 |
| `close()` | 关闭所有连接 |

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
