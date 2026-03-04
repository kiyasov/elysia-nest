# Function: Resolver()

```ts
function Resolver(options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/resolver.decorator.ts:47](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L47)

Decorator for a GraphQL resolver class.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \| `string` \| [`ResolverOptions`](../interfaces/ResolverOptions.md) \| () => `Constructor` | Resolver options, type name string, or type factory function. |

## Returns

`ClassDecorator`

## Example

```typescript
@Resolver('User')
class UserResolver {
  @Query()
  async user(@Args('id') id: string) {
    return this.userService.findById(id);
  }
}

// or
@Resolver(() => User)
class UserResolver {
  // ...
}

// or with options
@Resolver({ name: 'User', description: 'User resolver' })
class UserResolver {
  // ...
}
```
