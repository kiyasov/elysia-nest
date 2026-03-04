# Function: createUnionType()

```ts
function createUnionType<T>(options): (...args) => T;
```

Defined in: [packages/apollo/src/helpers/create-union-type.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/helpers/create-union-type.ts#L27)

Creates a GraphQL Union type from the given options.
The returned class can be used as a `@Field(() => UnionType)` type.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* `object` | The union member type. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `description?`: `string`; `name`: `string`; `resolveType?`: (`value`) => `string` \| `null`; `types`: () => readonly (...`args`) => `T`[]; \} | Union type configuration. |
| `options.description?` | `string` | Description of the union type. |
| `options.name` | `string` | Name of the union type in the GraphQL schema. |
| `options.resolveType?` | (`value`) => `string` \| `null` | Function to determine the type of a value. |
| `options.types` | () => readonly (...`args`) => `T`[] | Factory function returning array of types in the union. |

## Returns

A class that can be used as a GraphQL union type.

```ts
new createUnionType(...args): T;
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `unknown`[] |

### Returns

`T`

## Example

```typescript
export const SearchResult = createUnionType({
  name: 'SearchResult',
  types: () => [User, Post] as const,
  resolveType: (value) => value.__typename,
});

@Query(() => [SearchResult])
async search(@Args('query') query: string) {
  return this.searchService.search(query);
}
```
