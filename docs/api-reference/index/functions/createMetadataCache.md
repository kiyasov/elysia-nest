# Function: createMetadataCache()

```ts
function createMetadataCache<T>(): {
  get: T;
  reset: void;
};
```

Defined in: [packages/core/src/utils/metadata-cache.ts:52](https://github.com/nestelia/nestelia/blob/main/packages/core/src/utils/metadata-cache.ts#L52)

Lazily-populated cache for generic Reflect metadata keyed by
(target, metadataKey). Two-level lookup: WeakMap<object, Map<key, T>>.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Returns

```ts
{
  get: T;
  reset: void;
}
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `get()` | ( `target`, `metadataKey`, `factory` ) => `T` | [packages/core/src/utils/metadata-cache.ts:55](https://github.com/nestelia/nestelia/blob/main/packages/core/src/utils/metadata-cache.ts#L55) |
| `reset()` | () => `void` | [packages/core/src/utils/metadata-cache.ts:72](https://github.com/nestelia/nestelia/blob/main/packages/core/src/utils/metadata-cache.ts#L72) |
