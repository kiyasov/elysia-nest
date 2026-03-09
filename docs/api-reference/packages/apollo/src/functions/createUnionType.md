# Function: createUnionType()

```ts
function createUnionType<T>(options): (...args) => InstanceType<T[number]>;
```

Defined in: [packages/apollo/src/helpers/create-union-type.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/helpers/create-union-type.ts#L29)

Creates a GraphQL Union type from the given options.
The returned class can be used as a `@Field(() => UnionType)` type.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* readonly (...`args`) => `object`[] | Tuple of union member constructors. |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `description?`: `string`; `name`: `string`; `resolveType?`: (`value`) => `string` \| `T`\[`number`\] \| `null` \| `undefined`; `types`: () => `T`; \} | Union type configuration. |
| `options.description?` | `string` | Description of the union type. |
| `options.name` | `string` | Name of the union type in the GraphQL schema. |
| `options.resolveType?` | (`value`) => `string` \| `T`\[`number`\] \| `null` \| `undefined` | Function to determine the concrete type of a resolved value. May return a type name string or a class constructor from the union. |
| `options.types` | () => `T` | Factory function returning array of types in the union. |

## Returns

A class that can be used as a GraphQL union type.

```ts
new createUnionType(...args): InstanceType<T[number]>;
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `unknown`[] |

### Returns

`InstanceType`\<`T`\[`number`\]\>

## Example

```typescript
export const SearchResult = createUnionType({
  name: 'SearchResult',
  types: () => [User, Post] as const,
  resolveType(value) {
    return 'name' in value ? User : Post;
  },
});

@Query(() => [SearchResult])
async search(@Args('query') query: string) {
  return this.searchService.search(query);
}
```
