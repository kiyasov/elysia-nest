# Interface: CacheOptionsFactory\<T\>

Defined in: [packages/cache/src/interfaces/cache-module.interface.ts:53](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L53)

Factory interface for creating cache options.

Providers supplying configuration options for the Cache module
must implement this interface when using useClass or useExisting.

## Public Api

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* `StoreConfigRecord` | `StoreConfigRecord` | Store-specific configuration type. |

## Methods

### createCacheOptions()

```ts
createCacheOptions(): 
  | CacheOptions<T>
| Promise<CacheOptions<T>>;
```

Defined in: [packages/cache/src/interfaces/cache-module.interface.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L61)

Creates cache options.

#### Returns

  \| [`CacheOptions`](../type-aliases/CacheOptions.md)\<`T`\>
  \| `Promise`\<[`CacheOptions`](../type-aliases/CacheOptions.md)\<`T`\>\>

Cache options or a Promise resolving to cache options.
