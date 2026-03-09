# Function: Field()

```ts
function Field(typeFnOrOptions?, fieldOptions?): PropertyDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:131](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L131)

Decorator for a GraphQL field.

The type is inferred from TypeScript's `design:type` metadata for primitive types
(`string` → `String`, `number` → `Number`, `boolean` → `Boolean`).
For all other types — enums, classes, union types — an explicit type factory
**must** be provided; omitting it throws an error at decoration time.

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

## Throws

When no explicit type is given and `design:type` is `Object`.

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

  // Enum — explicit type factory required
  @Field(() => Role)
  role: Role;
}
```
