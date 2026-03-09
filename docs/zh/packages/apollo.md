---
title: Apollo GraphQL
icon: hexagon
description: 使用 Apollo Server 实现代码优先的 GraphQL
---

Apollo 包提供了一种代码优先的方式来构建 GraphQL API，使用装饰器定义类型、解析器、查询和变更。

## 安装

```bash
bun add @apollo/server graphql graphql-ws
```

## 配置

在应用程序中注册 GraphQL 模块：

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

## 类型定义

### 对象类型

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

### 输入类型

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

### 枚举

使用 `registerEnumType` 注册枚举，并始终向 `@Field()` 传递显式的类型工厂。TypeScript 对枚举字段的 `design:type` 输出 `String` 或 `Number`，因此 Schema 构建器无法自动推断枚举类型。

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

  // 枚举字段需要显式类型工厂
  @Field(() => Role)
  role: Role;
}
```

### 联合类型

使用 `createUnionType` 实现代码优先的联合类型。`resolveType` 函数可以返回类型名称字符串或类构造函数。

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

### 自定义标量

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

## 解析器

使用 `@Resolver()` 装饰器定义 GraphQL 解析器：

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

## 字段解析器

使用 `@FieldResolver()`（或别名 `@ResolveField()`）解析嵌套字段：

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

## 订阅

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

## Context 和 Info

```typescript
import { Context, Info } from "nestelia/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## 解析器上的守卫

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
