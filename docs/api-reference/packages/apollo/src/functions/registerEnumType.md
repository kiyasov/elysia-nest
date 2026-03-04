# Function: registerEnumType()

```ts
function registerEnumType<TEnum>(enumObj, config): void;
```

Defined in: [packages/apollo/src/helpers/register-enum-type.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/helpers/register-enum-type.ts#L33)

Registers an enum type with a custom name and description for GraphQL schema generation.
Must be called before the schema is built (e.g., at module level).

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `TEnum` *extends* `object` | The enum type. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `enumObj` | `TEnum` | The enum object to register. |
| `config` | \{ `description?`: `string`; `name`: `string`; \} | Configuration for the enum type. |
| `config.description?` | `string` | - |
| `config.name` | `string` | - |

## Returns

`void`

## Example

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User roles in the system',
});

@ObjectType()
class User {
  @Field(() => UserRole)
  role: UserRole;
}
```
