# Interface: SubscriptionOptions

Defined in: [packages/apollo/src/decorators/subscription.decorator.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L19)

Options for the

## Subscription

decorator.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="deprecationreason"></a> `deprecationReason?` | `string` | Deprecation reason. | [packages/apollo/src/decorators/subscription.decorator.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L27) |
| <a id="description"></a> `description?` | `string` | Description for documentation. | [packages/apollo/src/decorators/subscription.decorator.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L23) |
| <a id="extensions"></a> `extensions?` | `Record`\<`string`, `unknown`\> | Additional extensions. | [packages/apollo/src/decorators/subscription.decorator.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L33) |
| <a id="name"></a> `name?` | `string` | Subscription name (defaults to method name). | [packages/apollo/src/decorators/subscription.decorator.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L21) |
| <a id="nullable"></a> `nullable?` | `boolean` | Whether the subscription can return null. | [packages/apollo/src/decorators/subscription.decorator.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L25) |
| <a id="resolve"></a> `resolve?` | [`ResolveFn`](../type-aliases/ResolveFn.md) | Resolve function to transform the payload. | [packages/apollo/src/decorators/subscription.decorator.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L31) |
| <a id="returntype"></a> `returnType?` | () => `unknown` | Return type factory function. | [packages/apollo/src/decorators/subscription.decorator.ts:35](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L35) |
| <a id="subscribe"></a> `subscribe?` | [`SubscribeFn`](../type-aliases/SubscribeFn.md) | Subscribe function (async iterator). | [packages/apollo/src/decorators/subscription.decorator.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L29) |
