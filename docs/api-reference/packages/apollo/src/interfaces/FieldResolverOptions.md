# Interface: FieldResolverOptions

Defined in: [packages/apollo/src/decorators/field-resolver.decorator.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L9)

Options for the

## Field Resolver

decorator.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="deprecationreason"></a> `deprecationReason?` | `string` | Deprecation reason. | [packages/apollo/src/decorators/field-resolver.decorator.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L17) |
| <a id="description"></a> `description?` | `string` | Description for documentation. | [packages/apollo/src/decorators/field-resolver.decorator.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L13) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Additional extensions. | [packages/apollo/src/decorators/field-resolver.decorator.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L21) |
| <a id="name"></a> `name?` | `string` | Field name (defaults to method name). | [packages/apollo/src/decorators/field-resolver.decorator.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L11) |
| <a id="nullable"></a> `nullable?` | `boolean` | Whether the field can return null. | [packages/apollo/src/decorators/field-resolver.decorator.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L15) |
| <a id="returntype"></a> `returnType?` | () => `unknown` | Function returning the field type. | [packages/apollo/src/decorators/field-resolver.decorator.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/field-resolver.decorator.ts#L19) |
