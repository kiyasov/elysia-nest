# Function: Enum()

```ts
function Enum(options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:183](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L183)

Decorator for GraphQL Enum.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | \| `string` \| \{ `description?`: `string`; `name?`: `string`; \} | Enum options or name. |

## Returns

`ClassDecorator`

## Example

```typescript
@Enum()
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
```
