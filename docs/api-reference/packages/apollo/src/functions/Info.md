# Function: Info()

```ts
function Info(): ParameterDecorator;
```

Defined in: [packages/apollo/src/decorators/info.decorator.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/info.decorator.ts#L36)

Decorator for GraphQL resolve info.
Provides access to GraphQL request information (AST, field nodes, etc.).

## Returns

`ParameterDecorator`

## Example

```typescript
import { GraphQLResolveInfo } from 'graphql';

@Query()
async users(@Info() info: GraphQLResolveInfo) {
  // Access request AST for optimization
  const fields = getFieldNames(info);
  return this.userService.findAll({ fields });
}

@Query()
async user(
  @Args('id') id: string,
  @Info() info: GraphQLResolveInfo
) {
  // Use info for DataLoader or query optimization
  return this.userService.findById(id, info);
}
```
