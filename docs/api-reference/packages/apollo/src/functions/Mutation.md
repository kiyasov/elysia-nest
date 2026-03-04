# Function: Mutation()

```ts
function Mutation(typeFn?, options?): MethodDecorator;
```

Defined in: [packages/apollo/src/decorators/mutation.decorator.ts:66](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L66)

Decorator for a GraphQL Mutation.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeFn?` | \| `string` \| () => `unknown` \| [`MutationOptions`](../interfaces/MutationOptions.md) | Return type factory, options object, or mutation name. |
| `options?` | [`MutationOptions`](../interfaces/MutationOptions.md) | Mutation options when typeFn is a function. |

## Returns

`MethodDecorator`

## Example

```typescript
@Mutation()
async createUser(@Args('input') input: CreateUserInput): Promise<User> {
  return this.userService.create(input);
}

@Mutation(() => User)
async create(@Args('input') input: CreateUserInput): Promise<User> {
  return this.userService.create(input);
}

@Mutation('updateUser')
async update(@Args('id') id: string, @Args('input') input: UpdateUserInput): Promise<User> {
  return this.userService.update(id, input);
}

@Mutation({ name: 'deleteUser', description: 'Delete user by id' })
async remove(@Args('id') id: string): Promise<boolean> {
  return this.userService.delete(id);
}
```
