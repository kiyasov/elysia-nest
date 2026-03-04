# Interface: SubscriptionMetadata

Defined in: [packages/apollo/src/decorators/types.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L65)

## Subscription

metadata.

## Extends

- `BaseFieldMetadata`

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="deprecationreason"></a> `deprecationReason?` | `string` | Deprecation reason. | `BaseFieldMetadata.deprecationReason` | [packages/apollo/src/decorators/types.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L29) |
| <a id="description"></a> `description?` | `string` | Description. | `BaseFieldMetadata.description` | [packages/apollo/src/decorators/types.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L25) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Extensions. | `BaseFieldMetadata.extensions` | [packages/apollo/src/decorators/types.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L33) |
| <a id="kind"></a> `kind` | `"subscription"` | - | - | [packages/apollo/src/decorators/types.ts:66](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L66) |
| <a id="methodname"></a> `methodName` | `string` | - | - | [packages/apollo/src/decorators/types.ts:67](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L67) |
| <a id="name"></a> `name?` | `string` | Field name (defaults to method name). | `BaseFieldMetadata.name` | [packages/apollo/src/decorators/types.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L23) |
| <a id="nullable"></a> `nullable?` | `boolean` | Whether field is nullable. | `BaseFieldMetadata.nullable` | [packages/apollo/src/decorators/types.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L27) |
| <a id="resolve"></a> `resolve?` | `ResolveFn`\<`unknown`\> | Resolve function to transform payload. | - | [packages/apollo/src/decorators/types.ts:71](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L71) |
| <a id="returntype"></a> `returnType?` | `string` \| `Constructor`\<`unknown`\> \| () => `unknown` | Return type. | `BaseFieldMetadata.returnType` | [packages/apollo/src/decorators/types.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L31) |
| <a id="subscribe"></a> `subscribe?` | `SubscribeFn`\<`unknown`\> | Subscribe function (for custom pub/sub). | - | [packages/apollo/src/decorators/types.ts:69](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/types.ts#L69) |
