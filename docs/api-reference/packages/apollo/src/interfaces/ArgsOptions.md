# Interface: ArgsOptions

Defined in: [packages/apollo/src/decorators/args.decorator.ts:7](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L7)

Options for an argument.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="defaultvalue"></a> `defaultValue?` | `unknown` | Default value. | [packages/apollo/src/decorators/args.decorator.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L17) |
| <a id="description"></a> `description?` | `string` | Argument description. | [packages/apollo/src/decorators/args.decorator.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L15) |
| <a id="name"></a> `name` | `string` | Argument name. | [packages/apollo/src/decorators/args.decorator.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L9) |
| <a id="nullable"></a> `nullable?` | `boolean` | Whether the argument can be null. | [packages/apollo/src/decorators/args.decorator.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L13) |
| <a id="type"></a> `type?` | () => `unknown` | Function returning the type (for lazy loading and complex types). | [packages/apollo/src/decorators/args.decorator.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/args.decorator.ts#L11) |
