# Interface: ResolverOptions

Defined in: [packages/apollo/src/decorators/resolver.decorator.ts:7](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L7)

Options for the

## Resolver

decorator.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="deprecationreason"></a> `deprecationReason?` | `string` | Deprecation reason. | [packages/apollo/src/decorators/resolver.decorator.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L13) |
| <a id="description"></a> `description?` | `string` | Description for documentation. | [packages/apollo/src/decorators/resolver.decorator.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L11) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Additional extensions. | [packages/apollo/src/decorators/resolver.decorator.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L15) |
| <a id="name"></a> `name?` | `string` | GraphQL type name in schema. | [packages/apollo/src/decorators/resolver.decorator.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L9) |
| <a id="type"></a> `type?` | () => `Constructor` | Function returning the type (for lazy loading). | [packages/apollo/src/decorators/resolver.decorator.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/resolver.decorator.ts#L17) |
