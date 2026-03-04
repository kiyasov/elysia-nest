# Interface: MutationOptions

Defined in: [packages/apollo/src/decorators/mutation.decorator.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L8)

Options for the

## Mutation

decorator.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="defaultvalue"></a> `defaultValue?` | `unknown` | Default value for the mutation result. | [packages/apollo/src/decorators/mutation.decorator.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L16) |
| <a id="deprecationreason"></a> `deprecationReason?` | `string` | Deprecation reason. | [packages/apollo/src/decorators/mutation.decorator.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L18) |
| <a id="description"></a> `description?` | `string` | Description for documentation. | [packages/apollo/src/decorators/mutation.decorator.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L12) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Additional extensions. | [packages/apollo/src/decorators/mutation.decorator.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L20) |
| <a id="name"></a> `name?` | `string` | Mutation name (defaults to method name). | [packages/apollo/src/decorators/mutation.decorator.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L10) |
| <a id="nullable"></a> `nullable?` | `boolean` | Whether the mutation can return null. | [packages/apollo/src/decorators/mutation.decorator.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L14) |
| <a id="returntype"></a> `returnType?` | () => `unknown` | Return type factory function. | [packages/apollo/src/decorators/mutation.decorator.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/mutation.decorator.ts#L22) |
