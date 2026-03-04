# Variable: Ctx()

```ts
const Ctx: (property?) => ParameterDecorator = Context;
```

Defined in: [packages/apollo/src/decorators/ctx.decorator.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/ctx.decorator.ts#L61)

Alias for

Decorator for the GraphQL context.
Provides access to the GraphQL request context.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `property?` | `string` | Optional property name to extract from context. |

## Returns

`ParameterDecorator`

## Example

```typescript
@Query()
async me(@Context() ctx: MyContext) {
  return ctx.currentUser;
}

@Query()
async users(@Context() ctx: GraphQLContext) {
  return this.userService.findAll(ctx.tenantId);
}

@Mutation()
async createPost(
  @Args('input') input: CreatePostInput,
  @Context() ctx: MyContext
) {
  return this.postService.create(input, ctx.userId);
}
```

## Context

decorator.
