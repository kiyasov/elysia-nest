# Function: ResolverReturnType()

```ts
function ResolverReturnType(typeFn, options?): MethodDecorator;
```

Defined in: [packages/apollo/src/decorators/field-resolver.decorator.ts:149](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L149)

Decorator to explicitly specify the return type of a field resolver.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeFn` | () => `unknown` | Function returning the type. |
| `options?` | \{ `deprecationReason?`: `string`; `description?`: `string`; `nullable?`: `boolean`; \} | Additional options. |
| `options.deprecationReason?` | `string` | - |
| `options.description?` | `string` | - |
| `options.nullable?` | `boolean` | - |

## Returns

`MethodDecorator`

## Example

```typescript
@Resolver('User')
class UserResolver {
  @FieldResolver()
  @ResolverReturnType(() => [Post])
  async posts(@Parent() user: User) {
    return this.postService.findByUserId(user.id);
  }
}
```
