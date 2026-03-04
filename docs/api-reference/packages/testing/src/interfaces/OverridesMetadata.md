# Interface: OverridesMetadata

Defined in: [packages/testing/src/interfaces/overrides-metadata.interface.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L9)

Metadata for provider overrides in testing module

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="factory"></a> `factory?` | (...`args`) => `unknown` | [packages/testing/src/interfaces/overrides-metadata.interface.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L14) |
| <a id="inject"></a> `inject?` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md)[] | [packages/testing/src/interfaces/overrides-metadata.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L15) |
| <a id="metatype"></a> `metatype?` | [`Type`](../../../../index/interfaces/Type.md)\<`unknown`\> | [packages/testing/src/interfaces/overrides-metadata.interface.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L13) |
| <a id="token"></a> `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) | [packages/testing/src/interfaces/overrides-metadata.interface.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L10) |
| <a id="type"></a> `type` | `"value"` \| `"class"` \| `"factory"` | [packages/testing/src/interfaces/overrides-metadata.interface.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L11) |
| <a id="value"></a> `value?` | `unknown` | [packages/testing/src/interfaces/overrides-metadata.interface.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/interfaces/overrides-metadata.interface.ts#L12) |
