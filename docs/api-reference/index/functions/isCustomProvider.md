# Function: isCustomProvider()

```ts
function isCustomProvider(provider): provider is ValueProvider | ClassProvider | ExistingProvider | FactoryProvider<unknown>;
```

Defined in: [packages/core/src/di/provider.interface.ts:93](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/provider.interface.ts#L93)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `provider` | [`Provider`](../type-aliases/Provider.md) |

## Returns

provider is ValueProvider \| ClassProvider \| ExistingProvider \| FactoryProvider\<unknown\>
