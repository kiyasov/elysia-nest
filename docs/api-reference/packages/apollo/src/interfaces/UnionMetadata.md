# Interface: UnionMetadata

Defined in: [packages/apollo/src/decorators/types.ts:207](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L207)

## Union

metadata.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="description"></a> `description?` | `string` | Description. | [packages/apollo/src/decorators/types.ts:211](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L211) |
| <a id="name"></a> `name?` | `string` | Union name (defaults to class name). | [packages/apollo/src/decorators/types.ts:209](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L209) |
| <a id="resolvetype"></a> `resolveType?` | (`value`) => `string` \| `null` | Resolve type function. | [packages/apollo/src/decorators/types.ts:215](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L215) |
| <a id="types"></a> `types` | `Constructor`\<`unknown`\>[] | Types in the union. | [packages/apollo/src/decorators/types.ts:213](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L213) |
