# Interface: FieldResolverMetadata

Defined in: [packages/apollo/src/decorators/types.ts:75](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L75)

## Field Resolver

metadata.

## Extends

- `BaseFieldMetadata`

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="deprecationreason"></a> `deprecationReason?` | `string` | Deprecation reason. | `BaseFieldMetadata.deprecationReason` | [packages/apollo/src/decorators/types.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L29) |
| <a id="description"></a> `description?` | `string` | Description. | `BaseFieldMetadata.description` | [packages/apollo/src/decorators/types.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L25) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Extensions. | `BaseFieldMetadata.extensions` | [packages/apollo/src/decorators/types.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L33) |
| <a id="fieldname"></a> `fieldName?` | `string` | Name of the field being resolved. | - | [packages/apollo/src/decorators/types.ts:79](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L79) |
| <a id="kind"></a> `kind` | `"fieldResolver"` | - | - | [packages/apollo/src/decorators/types.ts:76](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L76) |
| <a id="methodname"></a> `methodName` | `string` | - | - | [packages/apollo/src/decorators/types.ts:77](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L77) |
| <a id="name"></a> `name?` | `string` | Field name (defaults to method name). | `BaseFieldMetadata.name` | [packages/apollo/src/decorators/types.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L23) |
| <a id="nullable"></a> `nullable?` | `boolean` | Whether field is nullable. | `BaseFieldMetadata.nullable` | [packages/apollo/src/decorators/types.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L27) |
| <a id="returntype"></a> `returnType?` | `string` \| `Constructor`\<`unknown`\> \| () => `unknown` | Return type. | `BaseFieldMetadata.returnType` | [packages/apollo/src/decorators/types.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L31) |
