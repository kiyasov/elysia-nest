# Interface: GqlExecutionContext\<TContext\>

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:201](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L201)

Context accessor for GraphQL resolvers - mirrors the GqlExecutionContext API.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | [`GraphQLContext`](GraphQLContext.md) |

## Methods

### getArgs()

```ts
getArgs<T>(): T;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:203](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L203)

Gets the resolver arguments.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> |

#### Returns

`T`

***

### getContext()

```ts
getContext(): TContext;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:211](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L211)

Gets the GraphQL context.

#### Returns

`TContext`

***

### getFieldName()

```ts
getFieldName(): string;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:205](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L205)

Gets the name of the current field being resolved.

#### Returns

`string`

***

### getInfo()

```ts
getInfo(): GraphQLResolveInfo;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:215](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L215)

Gets the GraphQL resolve info.

#### Returns

`GraphQLResolveInfo`

***

### getOperation()

```ts
getOperation(): string | undefined;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:207](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L207)

Gets the operation type (query, mutation, subscription).

#### Returns

`string` \| `undefined`

***

### getParent()

```ts
getParent<T>(): T;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:213](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L213)

Gets the parent object (for field resolvers).

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Returns

`T`

***

### getVariables()

```ts
getVariables<T>(): T;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:209](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L209)

Gets the GraphQL variables.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `Record`\<`string`, `unknown`\> |

#### Returns

`T`
