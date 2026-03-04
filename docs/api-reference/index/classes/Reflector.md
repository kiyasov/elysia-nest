# Class: Reflector

Defined in: [packages/core/src/di/reflector.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L13)

Helper class for retrieving metadata from classes and methods using reflect-metadata.

## Public Api

## Constructors

### Constructor

```ts
new Reflector(): Reflector;
```

#### Returns

`Reflector`

## Methods

### get()

#### Call Signature

```ts
get<T>(metadataKey, target): T | undefined;
```

Defined in: [packages/core/src/di/reflector.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L23)

Retrieve metadata for a specified key from a target object.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadataKey` | `string` \| `symbol` | the metadata key |
| `target` | `object` \| `Constructor` | the target object |

##### Returns

`T` \| `undefined`

the metadata value

##### Public Api

#### Call Signature

```ts
get<T>(
   metadataKey, 
   target, 
   propertyKey): T | undefined;
```

Defined in: [packages/core/src/di/reflector.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L38)

Retrieve metadata for a specified key from a target object's method.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadataKey` | `string` \| `symbol` | the metadata key |
| `target` | `object` \| `Constructor` | the target object |
| `propertyKey` | `string` \| `symbol` | the property key (method name) |

##### Returns

`T` \| `undefined`

the metadata value

##### Public Api

***

### getAllAndMerge()

```ts
getAllAndMerge<T>(metadataKey, targets): T | undefined;
```

Defined in: [packages/core/src/di/reflector.ts:124](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L124)

Retrieve metadata for a specified key from multiple targets and merge the results.
Arrays will be concatenated, objects will be merged, and primitive values will be
collected into an array.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadataKey` | `string` \| `symbol` | the metadata key |
| `targets` | (`object` \| `Constructor`)[] | array of target objects to check |

#### Returns

`T` \| `undefined`

merged metadata value

#### Public Api

***

### getAllAndOverride()

```ts
getAllAndOverride<T>(metadataKey, targets): T | undefined;
```

Defined in: [packages/core/src/di/reflector.ts:100](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L100)

Retrieve metadata for a specified key from multiple targets and return the first defined value.
This method is useful when you want to get metadata from both class and method, where method
metadata should override class metadata.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadataKey` | `string` \| `symbol` | the metadata key |
| `targets` | (`object` \| `Constructor`)[] | array of target objects to check |

#### Returns

`T` \| `undefined`

the first defined metadata value

#### Public Api

***

### getMetadataKeys()

#### Call Signature

```ts
getMetadataKeys(target): (string | symbol)[];
```

Defined in: [packages/core/src/di/reflector.ts:63](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L63)

Retrieve all metadata keys from a target object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` \| `Constructor` | the target object |

##### Returns

(`string` \| `symbol`)[]

array of metadata keys

##### Public Api

#### Call Signature

```ts
getMetadataKeys(target, propertyKey): (string | symbol)[];
```

Defined in: [packages/core/src/di/reflector.ts:74](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/reflector.ts#L74)

Retrieve all metadata keys from a target object's method.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` \| `Constructor` | the target object |
| `propertyKey` | `string` \| `symbol` | the property key (method name) |

##### Returns

(`string` \| `symbol`)[]

array of metadata keys

##### Public Api
