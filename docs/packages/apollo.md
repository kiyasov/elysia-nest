---
title: Apollo GraphQL
icon: hexagon
description: Code-first GraphQL with Apollo Server
---

The Apollo package provides a code-first approach to building GraphQL APIs with decorators for types, resolvers, queries, and mutations.

## Installation

```bash
bun add @apollo/server graphql graphql-ws
```

## Resolver

Define GraphQL resolvers with the `@Resolver()` decorator:

```typescript
import { Resolver, Query, Mutation, Args } from "@kiyasov/elysia-nest/apollo";
import { Injectable, Inject } from "@kiyasov/elysia-nest";

@Resolver("User")
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

## Type Definitions

### Object Types

```typescript
import { ObjectType, Field } from "@kiyasov/elysia-nest/apollo";

@ObjectType("User")
class User {
  @Field({ type: "ID" })
  id: string;

  @Field({ type: "String" })
  name: string;

  @Field({ type: "String" })
  email: string;
}
```

### Input Types

```typescript
import { InputType, Field } from "@kiyasov/elysia-nest/apollo";

@InputType("CreateUserInput")
class CreateUserInput {
  @Field({ type: "String", nullable: false })
  name: string;

  @Field({ type: "String", nullable: false })
  email: string;
}
```

### Enums

```typescript
import { Enum } from "@kiyasov/elysia-nest/apollo";

@Enum("Role", "User role in the system")
class Role {
  static ADMIN = "ADMIN";
  static USER = "USER";
}
```

### Union Types

```typescript
import { Union } from "@kiyasov/elysia-nest/apollo";

const SearchResult = Union(
  [User, Post],
  "SearchResult",
  (value) => (value.email ? "User" : "Post")
);
```

### Custom Scalars

```typescript
import { Scalar } from "@kiyasov/elysia-nest/apollo";

@Scalar("DateTime", "ISO date-time string")
class DateTime {
  static serialize(value: Date) {
    return value.toISOString();
  }
  static parseValue(value: string) {
    return new Date(value);
  }
}
```

## Field Resolvers

Use `@FieldResolver()` (or the `@ResolveField()` alias) to resolve nested fields:

```typescript
import { Resolver, FieldResolver, Parent, Root } from "@kiyasov/elysia-nest/apollo";

@Resolver("Post")
class PostResolver {
  @FieldResolver()
  async author(@Parent() post: Post) {
    return this.userService.findById(post.authorId);
  }
}
```

## Subscriptions

```typescript
import { Resolver, Subscription } from "@kiyasov/elysia-nest/apollo";

@Resolver("User")
class UserResolver {
  @Subscription(() => User)
  userCreated() {
    return pubsub.asyncIterator("USER_CREATED");
  }
}
```

## Context and Info

```typescript
import { Context, Info, Parent } from "@kiyasov/elysia-nest/apollo";

@Query(() => User)
async me(@Context("user") user: any, @Info() info: any) {
  return user;
}
```

## Guards on Resolvers

```typescript
import { UseGuards } from "@kiyasov/elysia-nest";

@Resolver("Admin")
class AdminResolver {
  @Query(() => [User])
  @UseGuards(AdminGuard)
  async allUsers() {
    return this.userService.findAll();
  }
}
```

## Setup

Register the GraphQL module in your application:

```typescript
import { Module } from "@kiyasov/elysia-nest";
import { GraphQLModule } from "@kiyasov/elysia-nest/apollo";

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
