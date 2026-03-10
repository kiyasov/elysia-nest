---
title: Apollo GraphQL
icon: hexagon
description: Apollo Server によるコードファースト GraphQL
---

Apollo パッケージは、型、リゾルバー、クエリ、ミューテーションのデコレータを使った GraphQL API のコードファーストアプローチを提供します。

## インストール

```bash
bun add @apollo/server graphql graphql-ws
```

## セットアップ

アプリケーションに GraphQL モジュールを登録します:

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

## 型定義

### オブジェクト型

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

### 入力型

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

### 列挙型

列挙型は `registerEnumType` で登録し、`@Field()` には必ず明示的な型ファクトリーを渡してください。
TypeScript は列挙型フィールドの `design:type` として `String` や `Number` を出力するため、スキーマビルダーは列挙型を自動的に推論できません。

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

  // 列挙型フィールドには明示的な型ファクトリーが必要
  @Field(() => Role)
  role: Role;
}
```

### ユニオン型

コードファーストのユニオン型には `createUnionType` を使用します。`resolveType` 関数は型名の文字列またはクラスコンストラクタを返せます。

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

### カスタムスカラー

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

### 組み込みスカラー

追加設定不要で使える 6 つのスカラーが含まれています:

| スカラー | GraphQL 型 | JS 型 | 説明 |
|---------|-----------|-------|------|
| `GraphQLDateTime` | `DateTime` | `Date` | ISO 8601 文字列 ↔ JS Date |
| `GraphQLJSON` | `JSON` | `any` | 任意の JSON 値 |
| `GraphQLURL` | `URL` | `string` | 検証済み URL 文字列 |
| `GraphQLBigInt` | `BigInt` | `bigint` | 64 ビット整数、文字列としてシリアライズ |
| `GraphQLEmailAddress` | `EmailAddress` | `string` | 検証済みメールアドレス |
| `GraphQLUUID` | `UUID` | `string` | UUID、小文字に正規化 |

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

## Args 型

`@ArgsType()` は、クラスの `@Field()` プロパティをスキーマ内の個別のトップレベル引数として展開します — ラッパーの input オブジェクトは不要です。名前なしの `@Args()` と組み合わせて使用します:

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

## ページネーション

### オフセットベース

`Paginated(ItemType)` は `items`、`total`、`hasNextPage`、`hasPreviousPage` を含むページネーションレスポンスを作成します:

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

### Relay（カーソルベース）

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

## リゾルバー

`@Resolver()` デコレータで GraphQL リゾルバーを定義します:

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

## フィールドリゾルバー

ネストされたフィールドを解決するために `@FieldResolver()`（または `@ResolveField()` エイリアス）を使用します:

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

## サブスクリプション

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

## コンテキストと Info

```typescript
import { Context, Info } from "nestelia/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## リゾルバーでガードを使う

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
