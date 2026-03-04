# Function: ArgsType()

```ts
function ArgsType(): <T>(target) => T;
```

Defined in: [packages/apollo/src/helpers/args-type.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/helpers/args-type.ts#L29)

Marks a class as GraphQL arguments DTO.
Classes decorated with

## Returns

```ts
<T>(target): T;
```

### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* (...`args`) => `unknown` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `T` |

### Returns

`T`

## Args Type

can be used as input types for resolver arguments.

## Example

```typescript
@ArgsType()
class GetUsersArgs {
  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}

@Resolver()
class UserResolver {
  @Query(() => [User])
  async users(@Args() args: GetUsersArgs) {
    return this.userService.findAll(args);
  }
}
```
