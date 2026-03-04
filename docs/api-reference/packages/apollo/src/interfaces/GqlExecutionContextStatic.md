# Interface: GqlExecutionContextStatic

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:219](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L219)

Static interface for creating GqlExecutionContext instances.

## Methods

### create()

```ts
create<TContext>(context): GqlExecutionContext<TContext>;
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:225](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L225)

Creates a GqlExecutionContext from an ExecutionContext.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | [`GraphQLContext`](GraphQLContext.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) | The execution context. |

#### Returns

[`GqlExecutionContext`](GqlExecutionContext.md)\<`TContext`\>

A GqlExecutionContext instance.
