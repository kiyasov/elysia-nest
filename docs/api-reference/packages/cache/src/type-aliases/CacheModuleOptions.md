# Type Alias: CacheModuleOptions\<T\>

```ts
type CacheModuleOptions<T> = CacheOptions<T> & {
  isGlobal?: boolean;
};
```

Defined in: [packages/cache/src/interfaces/cache-module.interface.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L32)

Options for configuring the Cache module.

## Type Declaration

| Name | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `isGlobal?` | `boolean` | If `true`, register `CacheModule` as a global module. **Default** `false` | [packages/cache/src/interfaces/cache-module.interface.ts:40](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L40) |

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* `StoreConfigRecord` | `StoreConfigRecord` | Store-specific configuration type. |

## Public Api
