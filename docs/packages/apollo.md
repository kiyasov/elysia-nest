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

## Type Definitions

### Object Types

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

### Input Types

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

### Enums

Register enums with `registerEnumType` and always pass an explicit type factory to `@Field()`.
TypeScript emits `String` or `Number` as `design:type` for enum fields, so the schema builder
cannot infer the enum type automatically.

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

  // Explicit type factory required for enum fields
  @Field(() => Role)
  role: Role;
}
```

### Union Types

Use `createUnionType` for code-first union types. The `resolveType` function can return
either a type name string or a class constructor.

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

### Built-in Scalars

Six ready-to-use scalars are included — no extra packages needed:

| Scalar | GraphQL type | JS type | Description |
|--------|-------------|---------|-------------|
| `GraphQLDateTime` | `DateTime` | `Date` | ISO 8601 string ↔ JS Date |
| `GraphQLJSON` | `JSON` | `any` | Any JSON value |
| `GraphQLURL` | `URL` | `string` | Validated URL string |
| `GraphQLBigInt` | `BigInt` | `bigint` | 64-bit integer, serialized as string |
| `GraphQLEmailAddress` | `EmailAddress` | `string` | Validated email address |
| `GraphQLUUID` | `UUID` | `string` | UUID, normalized to lowercase |

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

### Custom Scalars

Implement your own scalar with `@Scalar()`:

```typescript
import { Scalar } from "nestelia/apollo";

@Scalar("Currency")
class CurrencyScalar {
  description = "Monetary amount in cents (integer)";

  serialize(value: number) { return Math.round(value); }
  parseValue(value: unknown) {
    if (typeof value !== "number") throw new Error("Currency must be a number");
    return Math.round(value);
  }
}
```

## Args Types

`@ArgsType()` marks a class whose `@Field()` properties are expanded as individual top-level
arguments in the schema — no wrapper input object. Use it with `@Args()` (no name):

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

## Pagination

### Offset-based

`Paginated(ItemType)` creates a paginated response type with `items`, `total`, `hasNextPage`, `hasPreviousPage`:

```typescript
import { Paginated } from "nestelia/apollo";

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

### Relay (cursor-based)

`createEdgeType` and `createConnectionType` build standard Relay Connection types:

```typescript
import { createEdgeType, createConnectionType, PageInfo, Int } from "nestelia/apollo";

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
    pageInfo: {
      hasNextPage: first < this.store.length,
      hasPreviousPage: false,
      startCursor: edges[0]?.cursor,
      endCursor: edges.at(-1)?.cursor,
    },
    totalCount: this.store.length,
  };
}
```

`PageInfo` fields: `hasNextPage`, `hasPreviousPage`, `startCursor?`, `endCursor?`.

## Resolver

Define GraphQL resolvers with the `@Resolver()` decorator:

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

## Field Resolvers

Use `@FieldResolver()` (or the `@ResolveField()` alias) to resolve nested fields:

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

## Subscriptions

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

## Context and Info

```typescript
import { Context, Info } from "nestelia/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## Guards on Resolvers

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
