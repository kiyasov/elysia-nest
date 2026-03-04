# Function: ReturnType()

```ts
function ReturnType(typeFn, options?): MethodDecorator;
```

Defined in: [packages/apollo/src/decorators/query.decorator.ts:127](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/query.decorator.ts#L127)

Decorator to explicitly specify the return type of a Query.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeFn` | () => `unknown` | Function returning the type. |
| `options?` | \{ `deprecationReason?`: `string`; `description?`: `string`; `nullable?`: `boolean`; \} | Additional options. |
| `options.deprecationReason?` | `string` | - |
| `options.description?` | `string` | - |
| `options.nullable?` | `boolean` | - |

## Returns

`MethodDecorator`

## Example

```typescript
@Query()
@ReturnType(() => User)
async user() { }

@Query()
@ReturnType(() => [User])
async users() { }

@Query()
@ReturnType(() => User, { nullable: true })
async userOptional() { }
```
