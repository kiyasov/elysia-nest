# Function: Union()

```ts
function Union(
   name, 
   types, 
   options?): ClassDecorator;
```

Defined in: [packages/apollo/src/decorators/type.decorator.ts:323](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/type.decorator.ts#L323)

Decorator for GraphQL Union.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | Union name. |
| `types` | () => `unknown`[] | Array of type factory functions. |
| `options?` | \{ `description?`: `string`; `resolveType?`: (`value`) => `string`; \} | Union options. |
| `options.description?` | `string` | - |
| `options.resolveType?` | (`value`) => `string` | - |

## Returns

`ClassDecorator`

## Example

```typescript
@Union('SearchResult', [Book, Movie])
class SearchResult {}
```
