# Function: InputType()

```ts
function InputType(options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:76](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L76)

Decorator for GraphQL Input Type.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \| `string` \| \{ `description?`: `string`; `isAbstract?`: `boolean`; `name?`: `string`; \} | Type options or name. |

## Returns

`ClassDecorator`

## Example

```typescript
@InputType()
class CreateUserInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;
}
```
