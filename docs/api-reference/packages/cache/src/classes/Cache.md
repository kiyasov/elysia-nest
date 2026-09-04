# Class: Cache

Defined in: [packages/cache/src/cache.module.ts:19](https://github.com/nestelia/nestelia/blob/main/packages/cache/src/cache.module.ts#L19)

Empty base class that will be merged with the Cache interface. 

This class can be used as a provider token for dependency injection.

## Extends

- `ReturnType`\<*typeof* `createCache`\>

## Constructors

### Constructor

```ts
new Cache(): Cache;
```

#### Returns

`Cache`

## Methods

### wrap()

#### Call Signature

```ts
wrap<T>(
   key, 
   fnc, 
   ttl?, 
   refreshThreshold?
): Promise<T>;
```

Defined in: node\_modules/cache-manager/dist/index.d.mts:74

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `fnc` | () => `T` \| `Promise`\<`T`\> |
| `ttl?` | `number` \| ((`value`) => `number`) |
| `refreshThreshold?` | `number` \| ((`value`) => `number`) |

##### Returns

`Promise`\<`T`\>

#### Call Signature

```ts
wrap<T>(
   key, 
   fnc, 
   options
): Promise<T>;
```

Defined in: node\_modules/cache-manager/dist/index.d.mts:75

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `fnc` | () => `T` \| `Promise`\<`T`\> |
| `options` | `WrapOptions`\<`T`\> |

##### Returns

`Promise`\<`T`\>

#### Call Signature

```ts
wrap<T>(
   key, 
   fnc, 
   options
): Promise<StoredDataRaw<T>>;
```

Defined in: node\_modules/cache-manager/dist/index.d.mts:76

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `fnc` | () => `T` \| `Promise`\<`T`\> |
| `options` | `WrapOptionsRaw`\<`T`\> |

##### Returns

`Promise`\<`StoredDataRaw`\<`T`\>\>

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="cacheid"></a> `cacheId` | () => `string` | node\_modules/cache-manager/dist/index.d.mts:72 |
| <a id="clear"></a> `clear` | () => `Promise`\<`boolean`\> | node\_modules/cache-manager/dist/index.d.mts:68 |
| <a id="del"></a> `del` | (`key`) => `Promise`\<`boolean`\> | node\_modules/cache-manager/dist/index.d.mts:66 |
| <a id="disconnect"></a> `disconnect` | () => `Promise`\<`undefined`\> | node\_modules/cache-manager/dist/index.d.mts:71 |
| <a id="get"></a> `get` | \<`T`\>(`key`) => `Promise`\<`T` \| `undefined`\> | node\_modules/cache-manager/dist/index.d.mts:53 |
| <a id="mdel"></a> `mdel` | (`keys`) => `Promise`\<`boolean`\> | node\_modules/cache-manager/dist/index.d.mts:67 |
| <a id="mget"></a> `mget` | \<`T`\>(`keys`) => `Promise`\<(`T` \| `undefined`)[]\> | node\_modules/cache-manager/dist/index.d.mts:54 |
| <a id="mset"></a> `mset` | \<`T`\>(`list`) => `Promise`\<\{ `key`: `string`; `ttl?`: `number`; `value`: `T`; \}[]\> | node\_modules/cache-manager/dist/index.d.mts:57 |
| <a id="off"></a> `off` | \<`E`\>(`event`, `listener`) => `EventEmitter` | node\_modules/cache-manager/dist/index.d.mts:70 |
| <a id="on"></a> `on` | \<`E`\>(`event`, `listener`) => `EventEmitter` | node\_modules/cache-manager/dist/index.d.mts:69 |
| <a id="set"></a> `set` | \<`T`\>(`key`, `value`, `ttl?`) => `Promise`\<`T`\> | node\_modules/cache-manager/dist/index.d.mts:56 |
| <a id="stores"></a> `stores` | `Keyv`\<`any`\>[] | node\_modules/cache-manager/dist/index.d.mts:73 |
| <a id="ttl"></a> `ttl` | (`key`) => `Promise`\<`number` \| `undefined`\> | node\_modules/cache-manager/dist/index.d.mts:55 |
