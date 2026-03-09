# Function: HideField()

```ts
function HideField(): PropertyDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:379](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L379)

Hides a field from the GraphQL schema.

## Returns

`PropertyDecorator`

## Example

```typescript
@ObjectType()
class User {
  @Field()
  id: string;

  @HideField()
  password: string;
}
```
