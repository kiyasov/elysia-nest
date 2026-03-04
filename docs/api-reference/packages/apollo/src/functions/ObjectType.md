# Function: ObjectType()

```ts
function ObjectType(options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L37)

Decorator for GraphQL Object Type.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \| `string` \| \{ `description?`: `string`; `interfaces?`: () => `unknown`[]; `isAbstract?`: `boolean`; `name?`: `string`; \} | Type options or name. |

## Returns

`ClassDecorator`

## Example

```typescript
@ObjectType()
class User {
  @Field()
  id: string;

  @Field()
  name: string;
}

// with description
@ObjectType({ description: 'System user' })
class User {
  // ...
}
```
