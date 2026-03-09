# Function: InterfaceType()

```ts
function InterfaceType(options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:237](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L237)

Decorator for GraphQL Interface.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \| `string` \| \{ `description?`: `string`; `name?`: `string`; `resolveType?`: (`value`) => `string`; \} | Interface options or name. |

## Returns

`ClassDecorator`

## Example

```typescript
@InterfaceType()
abstract class Node {
  @Field()
  id: string;
}
```
