# Function: Query()

```ts
function Query(typeFn?, options?): MethodDecorator;
```

Defined in: [packages/apollo/src/decorators/query.decorator.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/query.decorator.ts#L61)

Decorator for a GraphQL Query.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeFn?` | `string` \| () => `unknown` \| [`QueryOptions`](../interfaces/QueryOptions.md) | Return type factory, options object, or query name. |
| `options?` | [`QueryOptions`](../interfaces/QueryOptions.md) | Query options when typeFn is a function. |

## Returns

`MethodDecorator`

## Example

```typescript
@Query()
async users(): Promise<User[]> {
  return this.userService.findAll();
}

@Query('user')
async findUser(@Args('id') id: string): Promise<User> {
  return this.userService.findById(id);
}

@Query({ name: 'user', description: 'Find user by id', nullable: true })
async findUser(@Args('id') id: string): Promise<User | null> {
  return this.userService.findById(id);
}
```
