# Interface: FactoryProvider\<T\>

Defined in: [packages/core/src/di/provider.interface.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L51)

## Extends

- [`BaseProvider`](BaseProvider.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Methods

### useFactory()

```ts
useFactory(...args): T | Promise<T>;
```

Defined in: [packages/core/src/di/provider.interface.ts:57](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L57)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `unknown`[] |

#### Returns

`T` \| `Promise`\<`T`\>

## Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="durable"></a> `durable?` | `boolean` | - | [packages/core/src/di/provider.interface.ts:59](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L59) |
| <a id="inject"></a> `inject?` | ( \| [`ProviderToken`](../type-aliases/ProviderToken.md) \| \{ `optional?`: `boolean`; `token`: [`ProviderToken`](../type-aliases/ProviderToken.md); \})[] | - | [packages/core/src/di/provider.interface.ts:58](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L58) |
| <a id="provide"></a> `provide` | [`ProviderToken`](../type-aliases/ProviderToken.md) | [`BaseProvider`](BaseProvider.md).[`provide`](BaseProvider.md#provide) | [packages/core/src/di/provider.interface.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L38) |
| <a id="scope"></a> `scope?` | [`Scope`](../enumerations/Scope.md) | [`BaseProvider`](BaseProvider.md).[`scope`](BaseProvider.md#scope) | [packages/core/src/di/scope-options.interface.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/scope-options.interface.ts#L8) |
