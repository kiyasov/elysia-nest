# Interface: GraphQLContext

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:49](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L49)

GraphQL context available in resolvers.

## Indexable

```ts
[key: string]: unknown
```

Additional context properties.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="ctx"></a> `ctx?` | [`GraphQLRuntimeContext`](GraphQLRuntimeContext.md) | Runtime context. | [packages/apollo/src/interfaces/apollo-options.interface.ts:53](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L53) |
| <a id="req"></a> `req?` | `Request` | HTTP request object. | [packages/apollo/src/interfaces/apollo-options.interface.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L51) |
| <a id="user"></a> `user?` | \| \{ `userId?`: `string`; \} \| `null` | Current user (if authenticated). | [packages/apollo/src/interfaces/apollo-options.interface.ts:55](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L55) |
