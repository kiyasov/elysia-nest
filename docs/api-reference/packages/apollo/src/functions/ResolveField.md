# Function: ResolveField()

```ts
function ResolveField(typeFn?, options?): MethodDecorator;
```

Defined in: [packages/apollo/src/decorators/field-resolver.decorator.ts:69](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L69)

Decorator for a field resolver.
Used to resolve individual fields of a type.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeFn?` | \| `string` \| () => `unknown` \| [`FieldResolverOptions`](../interfaces/FieldResolverOptions.md) | Return type factory, options object, or field name. |
| `options?` | [`FieldResolverOptions`](../interfaces/FieldResolverOptions.md) | Field resolver options when typeFn is a function. |

## Returns

`MethodDecorator`

## Example

```typescript
@Resolver('User')
class UserResolver {
  @FieldResolver()
  async posts(@Parent() user: User) {
    return this.postService.findByUserId(user.id);
  }

  @FieldResolver(() => [Post])
  async posts(@Parent() user: User) {
    return this.postService.findByUserId(user.id);
  }

  @FieldResolver('fullName')
  async getFullName(@Parent() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }

  @FieldResolver({ name: 'avatar', nullable: true, description: 'User avatar URL' })
  async getAvatar(@Parent() user: User) {
    return user.avatarUrl;
  }
}
```
