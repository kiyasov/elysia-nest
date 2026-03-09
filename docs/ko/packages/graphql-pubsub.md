---
title: GraphQL PubSub
icon: rss
description: GraphQL 구독을 위한 Redis 기반 PubSub
---

GraphQL PubSub 패키지는 비동기 이터레이터 지원으로 GraphQL 구독을 위한 Redis 기반 발행/구독 시스템을 제공합니다.

## 설치

```bash
bun add ioredis
```

## 기본 사용법

```typescript
import { RedisPubSub } from "nestelia/graphql-pubsub";

const pubsub = new RedisPubSub({
  connection: {
    host: "localhost",
    port: 6379,
  },
  keyPrefix: "myapp:",
});

// 이벤트 발행
await pubsub.publish("user-created", { id: 1, name: "John" });

// 이벤트 구독
const subId = await pubsub.subscribe("user-created", (message) => {
  console.log("New user:", message);
});

// 구독 취소
pubsub.unsubscribe(subId);

// 연결 종료
await pubsub.close();
```

## 모듈 등록

### 정적 설정

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

### 기존 Redis 클라이언트 사용

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

### 비동기 설정

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

## GraphQL 리졸버와 함께 사용

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

## 패턴 구독

글로브 스타일 패턴을 사용해 구독합니다:

```typescript
const subId = await pubsub.subscribe(
  "user.*",
  (message) => {
    console.log("User event:", message);
  },
  { pattern: true } // Redis psubscribe 사용
);
```

## 커스텀 직렬화

```typescript
const pubsub = new RedisPubSub({
  connection: { host: "localhost", port: 6379 },
  serializer: (payload) => JSON.stringify(payload),
  deserializer: (payload) => JSON.parse(payload),
});
```

## API 참조

### RedisPubSub

| 메서드 | 설명 |
|--------|-------------|
| `publish(trigger, payload)` | 채널에 메시지를 발행합니다 |
| `subscribe(trigger, handler, options?)` | 채널을 구독합니다. 숫자형 구독 ID를 반환합니다 |
| `unsubscribe(subId)` | 구독을 취소합니다 |
| `asyncIterator(triggers)` | GraphQL 구독을 위한 비동기 이터레이터를 생성합니다 |
| `getPublisher()` | Redis 발행자 클라이언트를 가져옵니다 |
| `getSubscriber()` | Redis 구독자 클라이언트를 가져옵니다 |
| `close()` | 모든 연결을 종료합니다 |

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
