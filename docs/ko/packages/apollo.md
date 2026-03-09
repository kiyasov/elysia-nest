---
title: Apollo GraphQL
icon: hexagon
description: Apollo Server로 코드 우선 GraphQL 구현
---

Apollo 패키지는 타입, 리졸버, 쿼리, 뮤테이션을 위한 데코레이터로 GraphQL API를 코드 우선 방식으로 구축할 수 있는 기능을 제공합니다.

## 설치

```bash
bun add @apollo/server graphql graphql-ws
```

## 설정

애플리케이션에 GraphQL 모듈을 등록합니다:

```typescript
import { Module } from "nestelia";
import { GraphQLModule } from "nestelia/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
    }),
    UserModule,
  ],
})
class AppModule {}
```

## 타입 정의

### 객체 타입

```typescript
import { ObjectType, Field } from "nestelia/apollo";

@ObjectType()
class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;
}
```

### 입력 타입

```typescript
import { InputType, Field } from "nestelia/apollo";

@InputType()
class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;
}
```

### 열거형

`registerEnumType`으로 열거형을 등록하고 `@Field()`에 항상 명시적인 타입 팩토리를 전달하세요.
TypeScript는 열거형 필드에 대해 `design:type`으로 `String` 또는 `Number`를 내보내기 때문에 스키마 빌더가 자동으로 열거형 타입을 추론할 수 없습니다.

```typescript
import { registerEnumType } from "nestelia/apollo";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

registerEnumType(Role, { name: "Role", description: "User role" });

@ObjectType()
class User {
  @Field()
  name: string;

  // 열거형 필드에는 명시적인 타입 팩토리가 필요합니다
  @Field(() => Role)
  role: Role;
}
```

### 유니온 타입

코드 우선 유니온 타입에는 `createUnionType`을 사용합니다. `resolveType` 함수는 타입 이름 문자열이나 클래스 생성자를 반환할 수 있습니다.

```typescript
import { createUnionType } from "nestelia/apollo";

@ObjectType()
class Cat {
  @Field()
  meow: string;
}

@ObjectType()
class Dog {
  @Field()
  bark: string;
}

const PetUnion = createUnionType({
  name: "PetUnion",
  types: () => [Cat, Dog] as const,
  resolveType(value) {
    return "meow" in value ? Cat : Dog;
  },
});

@ObjectType()
class Owner {
  @Field(() => PetUnion)
  pet: typeof PetUnion;
}
```

### 커스텀 스칼라

```typescript
import { Scalar } from "nestelia/apollo";

@Scalar("DateTime")
class DateTimeScalar {
  description = "ISO 8601 date-time string";

  serialize(value: Date) {
    return value.toISOString();
  }

  parseValue(value: string) {
    return new Date(value);
  }
}
```

## 리졸버

`@Resolver()` 데코레이터로 GraphQL 리졸버를 정의합니다:

```typescript
import { Resolver, Query, Mutation, Args } from "nestelia/apollo";
import { Injectable, Inject } from "nestelia";

@Resolver(() => User)
@Injectable()
class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => User)
  async user(@Args("id") id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args("input") input: CreateUserInput) {
    return this.userService.create(input);
  }
}
```

## 필드 리졸버

`@FieldResolver()` (또는 `@ResolveField()` 별칭)를 사용해 중첩 필드를 해결합니다:

```typescript
import { Resolver, FieldResolver, Parent } from "nestelia/apollo";

@Resolver(() => Post)
class PostResolver {
  @FieldResolver()
  async author(@Parent() post: Post) {
    return this.userService.findById(post.authorId);
  }
}
```

## 구독

```typescript
import { Resolver, Subscription } from "nestelia/apollo";

@Resolver(() => User)
class UserResolver {
  @Subscription(() => User)
  userCreated() {
    return pubsub.asyncIterator("USER_CREATED");
  }
}
```

## 컨텍스트 및 Info

```typescript
import { Context, Info } from "nestelia/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## 리졸버에 가드 적용

```typescript
import { UseGuards } from "nestelia";

@Resolver(() => User)
class AdminResolver {
  @Query(() => [User])
  @UseGuards(AdminGuard)
  async allUsers() {
    return this.userService.findAll();
  }
}
```
