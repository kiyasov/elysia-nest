# Interface: ElysiaHookMetadata

Defined in: [packages/core/src/decorators/lifecycle.decorators.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L21)

Metadata for Elysia lifecycle hooks

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="hook"></a> `hook` | [`ElysiaHookName`](../type-aliases/ElysiaHookName.md) | - | [packages/core/src/decorators/lifecycle.decorators.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L22) |
| <a id="method"></a> `method` | `string` \| `symbol` | - | [packages/core/src/decorators/lifecycle.decorators.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L23) |
| <a id="options"></a> `options?` | \{ `before?`: `boolean`; \} | - | [packages/core/src/decorators/lifecycle.decorators.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L24) |
| `options.before?` | `boolean` | Insert before other hooks | [packages/core/src/decorators/lifecycle.decorators.ts:26](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/lifecycle.decorators.ts#L26) |
