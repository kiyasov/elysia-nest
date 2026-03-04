# Class: Container

Defined in: [packages/core/src/di/container.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L18)

## Accessors

### instance

#### Get Signature

```ts
get static instance(): Container;
```

Defined in: [packages/core/src/di/container.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L30)

##### Returns

`Container`

## Methods

### addGlobalModule()

```ts
addGlobalModule(module): void;
```

Defined in: [packages/core/src/di/container.ts:68](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `module` | `Module` |

#### Returns

`void`

***

### addModule()

```ts
addModule(metatype, token): Module;
```

Defined in: [packages/core/src/di/container.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metatype` | [`Type`](../interfaces/Type.md) |
| `token` | `string` |

#### Returns

`Module`

***

### bindGlobalModuleToModule()

```ts
bindGlobalModuleToModule(target, globalModule): void;
```

Defined in: [packages/core/src/di/container.ts:88](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L88)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `Module` |
| `globalModule` | `Module` |

#### Returns

`void`

***

### bindGlobalScope()

```ts
bindGlobalScope(): void;
```

Defined in: [packages/core/src/di/container.ts:76](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L76)

#### Returns

`void`

***

### bindGlobalsToImports()

```ts
bindGlobalsToImports(moduleRef): void;
```

Defined in: [packages/core/src/di/container.ts:82](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L82)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `moduleRef` | `Module` |

#### Returns

`void`

***

### clear()

```ts
clear(): void;
```

Defined in: [packages/core/src/di/container.ts:200](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L200)

#### Returns

`void`

***

### get()

#### Call Signature

```ts
get<T>(
   token, 
   moduleKey?, 
contextId?): Promise<T | undefined>;
```

Defined in: [packages/core/src/di/container.ts:95](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L95)

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`Type`](../interfaces/Type.md)\<`T`\> |
| `moduleKey?` | [`Type`](../interfaces/Type.md)\<`unknown`\> |
| `contextId?` | [`ContextId`](../interfaces/ContextId.md) |

##### Returns

`Promise`\<`T` \| `undefined`\>

#### Call Signature

```ts
get<T>(
   token, 
   moduleKey?, 
contextId?): Promise<T | undefined>;
```

Defined in: [packages/core/src/di/container.ts:96](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L96)

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../type-aliases/ProviderToken.md) |
| `moduleKey?` | [`Type`](../interfaces/Type.md)\<`unknown`\> |
| `contextId?` | [`ContextId`](../interfaces/ContextId.md) |

##### Returns

`Promise`\<`T` \| `undefined`\>

***

### getFromModule()

```ts
getFromModule<T>(
   token, 
   moduleKey, 
contextId?): Promise<T | undefined>;
```

Defined in: [packages/core/src/di/container.ts:170](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L170)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `token` | [`ProviderToken`](../type-aliases/ProviderToken.md) | `undefined` |
| `moduleKey` | `string` | `undefined` |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) | `STATIC_CONTEXT` |

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### getGlobalModules()

```ts
getGlobalModules(): Set<Module>;
```

Defined in: [packages/core/src/di/container.ts:72](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L72)

#### Returns

`Set`\<`Module`\>

***

### getModuleByKey()

```ts
getModuleByKey(key): Module | undefined;
```

Defined in: [packages/core/src/di/container.ts:64](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L64)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`Module` \| `undefined`

***

### getModules()

```ts
getModules(): Map<string, Module>;
```

Defined in: [packages/core/src/di/container.ts:60](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L60)

#### Returns

`Map`\<`string`, `Module`\>

***

### register()

```ts
register(providers, moduleKey?): void;
```

Defined in: [packages/core/src/di/container.ts:236](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L236)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `providers` | [`Provider`](../type-aliases/Provider.md)[] |
| `moduleKey?` | [`Type`](../interfaces/Type.md)\<`unknown`\> |

#### Returns

`void`

***

### registerControllers()

```ts
registerControllers(controllers, moduleKey?): void;
```

Defined in: [packages/core/src/di/container.ts:207](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L207)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `controllers` | [`Type`](../interfaces/Type.md)\<`unknown`\>[] |
| `moduleKey?` | [`Type`](../interfaces/Type.md)\<`unknown`\> |

#### Returns

`void`

***

### getRequestContext()

```ts
static getRequestContext(): RequestContext | undefined;
```

Defined in: [packages/core/src/di/container.ts:265](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L265)

#### Returns

[`RequestContext`](../interfaces/RequestContext.md) \| `undefined`

***

### runInRequestContext()

```ts
static runInRequestContext<R>(context, fn): R;
```

Defined in: [packages/core/src/di/container.ts:269](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/container.ts#L269)

#### Type Parameters

| Type Parameter |
| ------ |
| `R` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`RequestContext`](../interfaces/RequestContext.md) |
| `fn` | () => `R` |

#### Returns

`R`
