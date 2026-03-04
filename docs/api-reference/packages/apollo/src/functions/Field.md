# Function: Field()

```ts
function Field(typeFnOrOptions?, fieldOptions?): PropertyDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:118](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L118)

Decorator for a GraphQL field.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `typeFnOrOptions?` | \| () => `unknown` \| \{ `defaultValue?`: `unknown`; `deprecationReason?`: `string`; `description?`: `string`; `nullable?`: `boolean`; `type?`: () => `unknown`; \} |
| `fieldOptions?` | \{ `defaultValue?`: `unknown`; `deprecationReason?`: `string`; `description?`: `string`; `nullable?`: `boolean`; \} |
| `fieldOptions.defaultValue?` | `unknown` |
| `fieldOptions.deprecationReason?` | `string` |
| `fieldOptions.description?` | `string` |
| `fieldOptions.nullable?` | `boolean` |

## Returns

`PropertyDecorator`

## Example

```typescript
@ObjectType()
class User {
  @Field()
  id: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => [Post])
  posts: Post[];
}
```
