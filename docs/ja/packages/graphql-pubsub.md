---
title: GraphQL PubSub
icon: rss
description: GraphQL サブスクリプション用 Redis ベースの PubSub
---

GraphQL PubSub パッケージは、非同期イテレーターをサポートする GraphQL サブスクリプション用の Redis バックの発行/購読システムを提供します。

## インストール

```bash
bun add ioredis
```

## 基本的な使い方

```typescript
import { RedisPubSub } from "nestelia/graphql-pubsub";

const pubsub = new RedisPubSub({
  connection: {
    host: "localhost",
    port: 6379,
  },
  keyPrefix: "myapp:",
});

// イベントをパブリッシュ
await pubsub.publish("user-created", { id: 1, name: "John" });

// イベントをサブスクライブ
const subId = await pubsub.subscribe("user-created", (message) => {
  console.log("New user:", message);
});

// サブスクライブ解除
pubsub.unsubscribe(subId);

// コネクションを閉じる
await pubsub.close();
```

## モジュール登録

### 静的設定

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

### 既存の Redis クライアントを使う

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

### 非同期設定

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

## GraphQL リゾルバーで使う

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

## パターンサブスクリプション

グロブスタイルのパターンを使ってサブスクライブします:

```typescript
const subId = await pubsub.subscribe(
  "user.*",
  (message) => {
    console.log("User event:", message);
  },
  { pattern: true } // Redis の psubscribe を使用
);
```

## カスタムシリアライゼーション

```typescript
const pubsub = new RedisPubSub({
  connection: { host: "localhost", port: 6379 },
  serializer: (payload) => JSON.stringify(payload),
  deserializer: (payload) => JSON.parse(payload),
});
```

## API リファレンス

### RedisPubSub

| メソッド | 説明 |
|--------|-------------|
| `publish(trigger, payload)` | チャンネルにメッセージをパブリッシュする |
| `subscribe(trigger, handler, options?)` | チャンネルをサブスクライブする。数値のサブスクリプション ID を返す |
| `unsubscribe(subId)` | サブスクリプションをキャンセルする |
| `asyncIterator(triggers)` | GraphQL サブスクリプション用の非同期イテレーターを作成する |
| `getPublisher()` | Redis パブリッシャークライアントを取得する |
| `getSubscriber()` | Redis サブスクライバークライアントを取得する |
| `close()` | すべてのコネクションを閉じる |

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
