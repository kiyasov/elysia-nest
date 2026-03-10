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

### 内置标量

六个开箱即用的标量，无需额外配置：

| 标量 | GraphQL 类型 | JS 类型 | 描述 |
|------|-------------|---------|------|
| `GraphQLDateTime` | `DateTime` | `Date` | ISO 8601 字符串 ↔ JS Date |
| `GraphQLJSON` | `JSON` | `any` | 任意 JSON 值 |
| `GraphQLURL` | `URL` | `string` | 经验证的 URL 字符串 |
| `GraphQLBigInt` | `BigInt` | `bigint` | 64 位整数，序列化为字符串 |
| `GraphQLEmailAddress` | `EmailAddress` | `string` | 经验证的电子邮件地址 |
| `GraphQLUUID` | `UUID` | `string` | UUID，规范化为小写 |

```typescript
import { GraphQLDateTime, GraphQLEmailAddress, GraphQLJSON, GraphQLUUID } from "nestelia/apollo";

@ObjectType()
class User {
  @Field(() => GraphQLUUID)
  id!: string;

  @Field(() => GraphQLEmailAddress)
  email!: string;

  @Field(() => GraphQLDateTime)
  createdAt!: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown>;
}
```

## Args 类型

`@ArgsType()` 将类的 `@Field()` 属性展开为 schema 中独立的顶级参数，无需包装输入对象。配合不带名称的 `@Args()` 使用：

```typescript
import { ArgsType, Field, Int } from "nestelia/apollo";

@ArgsType()
class BooksArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset!: number;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit!: number;
}

@Resolver(() => Book)
class BooksResolver {
  @Query(() => [Book])
  books(@Args() args: BooksArgs): Book[] {
    return this.store.slice(args.offset, args.offset + args.limit);
  }
}
```

## 分页

### 基于偏移量

`Paginated(ItemType)` 创建包含 `items`、`total`、`hasNextPage`、`hasPreviousPage` 的分页响应：

```typescript
import { Paginated, Int } from "nestelia/apollo";

@ObjectType()
class BooksPage extends Paginated(Book) {}

@Query(() => BooksPage)
books(@Args() args: BooksArgs): BooksPage {
  const items = this.store.slice(args.offset, args.offset + args.limit);
  return {
    items,
    total: this.store.length,
    hasNextPage: args.offset + args.limit < this.store.length,
    hasPreviousPage: args.offset > 0,
  };
}
```

### Relay（基于游标）

```typescript
import { createEdgeType, createConnectionType, PageInfo } from "nestelia/apollo";

@ObjectType()
class BookEdge extends createEdgeType(Book) {}

@ObjectType()
class BookConnection extends createConnectionType(Book, BookEdge) {}

@Query(() => BookConnection)
booksConnection(@Args("first", { type: () => Int }) first: number): BookConnection {
  const edges = this.store.slice(0, first).map((book, i) => ({
    node: book,
    cursor: Buffer.from(String(i)).toString("base64"),
  }));
  return {
    edges,
    pageInfo: { hasNextPage: first < this.store.length, hasPreviousPage: false,
      startCursor: edges[0]?.cursor, endCursor: edges.at(-1)?.cursor },
    totalCount: this.store.length,
  };
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
