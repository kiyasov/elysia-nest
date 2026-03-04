# Interface: InterfaceTypeMetadata

Defined in: [packages/apollo/src/decorators/types.ts:107](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L107)

## Interface Type

metadata.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="description"></a> `description?` | `string` | Description. | [packages/apollo/src/decorators/types.ts:111](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L111) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Extensions. | [packages/apollo/src/decorators/types.ts:119](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L119) |
| <a id="name"></a> `name?` | `string` | Type name (defaults to class name). | [packages/apollo/src/decorators/types.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L109) |
| <a id="resolvetype"></a> `resolveType?` | (`value`, `context`, `info`) => `string` \| `null` | Resolve type function. | [packages/apollo/src/decorators/types.ts:113](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L113) |
