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

## Type Definitions

### Object Types

```typescript
import { ObjectType, Field } from "@kiyasov/elysia-nest/apollo";

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

### Input Types

```typescript
import { InputType, Field } from "@kiyasov/elysia-nest/apollo";

@InputType()
class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;
}
```

### Enums

Register enums with `registerEnumType` and always pass an explicit type factory to `@Field()`.
TypeScript emits `String` or `Number` as `design:type` for enum fields, so the schema builder
cannot infer the enum type automatically.

```typescript
import { registerEnumType } from "@kiyasov/elysia-nest/apollo";

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

registerEnumType(Role, { name: "Role", description: "User role" });

@ObjectType()
class User {
  @Field()
  name: string;

  // Explicit type factory required for enum fields
  @Field(() => Role)
  role: Role;
}
```

### Union Types

Use `createUnionType` for code-first union types. The `resolveType` function can return
either a type name string or a class constructor.

```typescript
import { createUnionType } from "@kiyasov/elysia-nest/apollo";

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

### Custom Scalars

```typescript
import { Scalar } from "@kiyasov/elysia-nest/apollo";

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

## Resolver

Define GraphQL resolvers with the `@Resolver()` decorator:

```typescript
import { Resolver, Query, Mutation, Args } from "@kiyasov/elysia-nest/apollo";
import { Injectable, Inject } from "@kiyasov/elysia-nest";

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

## Field Resolvers

Use `@FieldResolver()` (or the `@ResolveField()` alias) to resolve nested fields:

```typescript
import { Resolver, FieldResolver, Parent } from "@kiyasov/elysia-nest/apollo";

@Resolver(() => Post)
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

@Resolver(() => User)
class UserResolver {
  @Subscription(() => User)
  userCreated() {
    return pubsub.asyncIterator("USER_CREATED");
  }
}
```

## Context and Info

```typescript
import { Context, Info } from "@kiyasov/elysia-nest/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## Guards on Resolvers

```typescript
import { UseGuards } from "@kiyasov/elysia-nest";

@Resolver(() => User)
class AdminResolver {
  @Query(() => [User])
  @UseGuards(AdminGuard)
  async allUsers() {
    return this.userService.findAll();
  }
}
```
