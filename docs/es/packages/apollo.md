---
title: Apollo GraphQL
icon: hexagon
description: GraphQL code-first con Apollo Server
---

El paquete Apollo proporciona un enfoque code-first para construir APIs GraphQL con decoradores para tipos, resolvers, queries y mutaciones.

## Instalación

```bash
bun add @apollo/server graphql graphql-ws
```

## Configuración

Registra el módulo GraphQL en tu aplicación:

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

## Definición de Tipos

### Tipos de Objeto

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

### Tipos de Entrada

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

### Enumeraciones

Registra las enumeraciones con `registerEnumType` y siempre pasa una fábrica de tipo explícita a `@Field()`.
TypeScript emite `String` o `Number` como `design:type` para campos de enumeración, por lo que el constructor de esquemas no puede inferir el tipo de enumeración automáticamente.

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

  // Se requiere fábrica de tipo explícita para campos de enumeración
  @Field(() => Role)
  role: Role;
}
```

### Tipos Unión

Usa `createUnionType` para tipos unión code-first. La función `resolveType` puede devolver un nombre de tipo como cadena o un constructor de clase.

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

### Escalares Personalizados

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

### Escalares Integrados

Se incluyen seis escalares listos para usar — sin configuración adicional:

| Escalar | Tipo GraphQL | Tipo JS | Descripción |
|---------|-------------|---------|-------------|
| `GraphQLDateTime` | `DateTime` | `Date` | String ISO 8601 ↔ JS Date |
| `GraphQLJSON` | `JSON` | `any` | Cualquier valor JSON |
| `GraphQLURL` | `URL` | `string` | String de URL validada |
| `GraphQLBigInt` | `BigInt` | `bigint` | Entero de 64 bits, serializado como string |
| `GraphQLEmailAddress` | `EmailAddress` | `string` | Dirección de correo electrónico validada |
| `GraphQLUUID` | `UUID` | `string` | UUID, normalizado a minúsculas |

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

## Tipos de Args

`@ArgsType()` marca una clase cuyas propiedades `@Field()` se expanden como argumentos individuales de nivel superior en el schema — sin objeto de input envolvente. Úsalo con `@Args()` (sin nombre):

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

## Paginación

### Basada en offset

`Paginated(ItemType)` crea una respuesta paginada con `items`, `total`, `hasNextPage`, `hasPreviousPage`:

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

### Relay (basada en cursor)

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

## Resolver

Define resolvers de GraphQL con el decorador `@Resolver()`:

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

Usa `@FieldResolver()` (o el alias `@ResolveField()`) para resolver campos anidados:

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

## Suscripciones

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

## Context e Info

```typescript
import { Context, Info } from "nestelia/apollo";

@Query(() => User)
async me(@Context("user") user: User, @Info() info: GraphQLResolveInfo) {
  return user;
}
```

## Guards en Resolvers

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
