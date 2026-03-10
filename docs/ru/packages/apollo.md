---
title: Apollo GraphQL
icon: hexagon
description: Code-first GraphQL с Apollo Server
---

Пакет Apollo предоставляет code-first подход к созданию GraphQL API с декораторами для типов, resolvers, queries и mutations.

## Установка

```bash
bun add @apollo/server graphql graphql-ws
```

## Настройка

Зарегистрируйте GraphQL module в вашем приложении:

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

## Определение типов

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

Регистрируйте enums с помощью `registerEnumType` и всегда передавайте явную type factory в `@Field()`. TypeScript эмитирует `String` или `Number` как `design:type` для полей с enum, поэтому построитель схемы не может автоматически определить тип enum.

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

  // Для полей с enum требуется явная type factory
  @Field(() => Role)
  role: Role;
}
```

### Union Types

Используйте `createUnionType` для code-first union types. Функция `resolveType` может возвращать либо строку с именем типа, либо конструктор класса.

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

### Встроенные скаляры

Шесть готовых скалярных типов — без дополнительных пакетов:

| Скаляр | GraphQL тип | JS тип | Описание |
|--------|-------------|--------|----------|
| `GraphQLDateTime` | `DateTime` | `Date` | ISO 8601 строка ↔ JS Date |
| `GraphQLJSON` | `JSON` | `any` | Любое JSON-значение |
| `GraphQLURL` | `URL` | `string` | Валидированная URL строка |
| `GraphQLBigInt` | `BigInt` | `bigint` | 64-битное целое, сериализуется как строка |
| `GraphQLEmailAddress` | `EmailAddress` | `string` | Валидированный email адрес |
| `GraphQLUUID` | `UUID` | `string` | UUID, нормализуется к нижнему регистру |

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

Реализуйте собственный скаляр с помощью `@Scalar()`:

```typescript
import { Scalar } from "nestelia/apollo";

@Scalar("Currency")
class CurrencyScalar {
  description = "Денежная сумма в копейках (целое число)";

  serialize(value: number) { return Math.round(value); }
  parseValue(value: unknown) {
    if (typeof value !== "number") throw new Error("Currency must be a number");
    return Math.round(value);
  }
}
```

## Args Types

`@ArgsType()` помечает класс, поля `@Field()` которого разворачиваются как отдельные аргументы верхнего уровня в схеме — без оборачивающего input-объекта. Используйте с `@Args()` (без имени):

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

## Пагинация

### Offset-based

`Paginated(ItemType)` создаёт тип пагинированного ответа с полями `items`, `total`, `hasNextPage`, `hasPreviousPage`:

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

`createEdgeType` и `createConnectionType` строят стандартные Relay Connection типы:

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

Поля `PageInfo`: `hasNextPage`, `hasPreviousPage`, `startCursor?`, `endCursor?`.

## Resolver

Определяйте GraphQL resolvers с помощью декоратора `@Resolver()`:

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

Используйте `@FieldResolver()` (или псевдоним `@ResolveField()`) для разрешения вложенных полей:

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

## Context и Info

```typescript
import { Context, Info } from "nestelia/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## Guards на Resolvers

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
