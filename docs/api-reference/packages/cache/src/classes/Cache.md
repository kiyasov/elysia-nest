# Class: Cache

Defined in: [packages/cache/src/cache.module.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L16)

Empty base class that will be merged with the Cache interface. 

This class can be used as a provider token for dependency injection.

## Public Api

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
refreshThreshold?): Promise<T>;
```

Defined in: node\_modules/cache-manager/dist/index.d.ts:72

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `fnc` | () => `T` \| `Promise`\<`T`\> |
| `ttl?` | `number` \| (`value`) => `number` |
| `refreshThreshold?` | `number` \| (`value`) => `number` |

##### Returns

`Promise`\<`T`\>

#### Call Signature

```ts
wrap<T>(
   key, 
   fnc, 
options): Promise<T>;
```

Defined in: node\_modules/cache-manager/dist/index.d.ts:73

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
options): Promise<StoredDataRaw<T>>;
```

Defined in: node\_modules/cache-manager/dist/index.d.ts:74

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
| <a id="cacheid"></a> `cacheId` | () => `string` | node\_modules/cache-manager/dist/index.d.ts:70 |
| <a id="clear"></a> `clear` | () => `Promise`\<`boolean`\> | node\_modules/cache-manager/dist/index.d.ts:66 |
| <a id="del"></a> `del` | (`key`) => `Promise`\<`boolean`\> | node\_modules/cache-manager/dist/index.d.ts:64 |
| <a id="disconnect"></a> `disconnect` | () => `Promise`\<`undefined`\> | node\_modules/cache-manager/dist/index.d.ts:69 |
| <a id="get"></a> `get` | \<`T`\>(`key`) => `Promise`\<`T` \| `undefined`\> | node\_modules/cache-manager/dist/index.d.ts:51 |
| <a id="mdel"></a> `mdel` | (`keys`) => `Promise`\<`boolean`\> | node\_modules/cache-manager/dist/index.d.ts:65 |
| <a id="mget"></a> `mget` | \<`T`\>(`keys`) => `Promise`\<(`T` \| `undefined`)[]\> | node\_modules/cache-manager/dist/index.d.ts:52 |
| <a id="mset"></a> `mset` | \<`T`\>(`list`) => `Promise`\<\{ `key`: `string`; `ttl?`: `number`; `value`: `T`; \}[]\> | node\_modules/cache-manager/dist/index.d.ts:55 |
| <a id="off"></a> `off` | \<`E`\>(`event`, `listener`) => `EventEmitter` | node\_modules/cache-manager/dist/index.d.ts:68 |
| <a id="on"></a> `on` | \<`E`\>(`event`, `listener`) => `EventEmitter` | node\_modules/cache-manager/dist/index.d.ts:67 |
| <a id="set"></a> `set` | \<`T`\>(`key`, `value`, `ttl?`) => `Promise`\<`T`\> | node\_modules/cache-manager/dist/index.d.ts:54 |
| <a id="stores"></a> `stores` | `Keyv`\<`any`\>[] | node\_modules/cache-manager/dist/index.d.ts:71 |
| <a id="ttl"></a> `ttl` | (`key`) => `Promise`\<`number` \| `undefined`\> | node\_modules/cache-manager/dist/index.d.ts:53 |
