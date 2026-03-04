# Function: Parent()

```ts
function Parent(): ParameterDecorator;
```

Defined in: [packages/apollo/src/decorators/parent.decorator.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/parent.decorator.ts#L39)

Decorator for the parent/root value in a field resolver.
Provides access to the parent object from the field resolver.

## Returns

`ParameterDecorator`

## Example

```typescript
@Resolver('User')
class UserResolver {
  @FieldResolver()
  async posts(@Parent() user: User) {
    return this.postService.findByUserId(user.id);
  }

  @FieldResolver()
  async fullName(@Parent() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }
}

@Resolver('Post')
class PostResolver {
  @FieldResolver()
  async author(@Parent() post: Post) {
    return this.userService.findById(post.authorId);
  }
}
```
