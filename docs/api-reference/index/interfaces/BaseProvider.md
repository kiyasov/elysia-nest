# Interface: BaseProvider

Defined in: [packages/core/src/di/provider.interface.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L37)

## Extends

- [`ScopeOptions`](ScopeOptions.md)

## Extended by

- [`ClassProvider`](ClassProvider.md)
- [`ExistingProvider`](ExistingProvider.md)
- [`FactoryProvider`](FactoryProvider.md)
- [`ValueProvider`](ValueProvider.md)

## Properties

| Property | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="provide"></a> `provide` | [`ProviderToken`](../type-aliases/ProviderToken.md) | - | [packages/core/src/di/provider.interface.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L38) |
| <a id="scope"></a> `scope?` | [`Scope`](../enumerations/Scope.md) | [`ScopeOptions`](ScopeOptions.md).[`scope`](ScopeOptions.md#scope) | [packages/core/src/di/scope-options.interface.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/scope-options.interface.ts#L8) |
