# Class: Container

Defined in: [packages/core/src/di/container.ts:18](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L18)

## Accessors

### instance

#### Get Signature

```ts
get static instance(): Container;
```

Defined in: [packages/core/src/di/container.ts:32](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L32)

##### Returns

`Container`

## Methods

### addGlobalModule()

```ts
addGlobalModule(module): void;
```

Defined in: [packages/core/src/di/container.ts:70](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L70)

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

Defined in: [packages/core/src/di/container.ts:39](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L39)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metatype` | [`Type`](../interfaces/Type.md) |
| `token` | `string` |

#### Returns

`Module`

***

### beginInitSession()

```ts
beginInitSession(): void;
```

Defined in: [packages/core/src/di/container.ts:209](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L209)

#### Returns

`void`

***

### bindGlobalModuleToModule()

```ts
bindGlobalModuleToModule(target, globalModule): void;
```

Defined in: [packages/core/src/di/container.ts:90](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L90)

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

Defined in: [packages/core/src/di/container.ts:78](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L78)

#### Returns

`void`

***

### bindGlobalsToImports()

```ts
bindGlobalsToImports(moduleRef): void;
```

Defined in: [packages/core/src/di/container.ts:84](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L84)

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

Defined in: [packages/core/src/di/container.ts:202](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L202)

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

Defined in: [packages/core/src/di/container.ts:97](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L97)

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

Defined in: [packages/core/src/di/container.ts:98](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L98)

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

Defined in: [packages/core/src/di/container.ts:172](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L172)

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

Defined in: [packages/core/src/di/container.ts:74](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L74)

#### Returns

`Set`\<`Module`\>

***

### getModuleByKey()

```ts
getModuleByKey(key): Module | undefined;
```

Defined in: [packages/core/src/di/container.ts:66](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L66)

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

Defined in: [packages/core/src/di/container.ts:62](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L62)

#### Returns

`Map`\<`string`, `Module`\>

***

### isInitializedInSession()

```ts
isInitializedInSession(metatype): boolean;
```

Defined in: [packages/core/src/di/container.ts:213](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L213)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metatype` | [`Type`](../interfaces/Type.md) |

#### Returns

`boolean`

***

### markInitializedInSession()

```ts
markInitializedInSession(metatype): void;
```

Defined in: [packages/core/src/di/container.ts:217](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L217)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metatype` | [`Type`](../interfaces/Type.md) |

#### Returns

`void`

***

### register()

```ts
register(providers, moduleKey?): void;
```

Defined in: [packages/core/src/di/container.ts:251](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L251)

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

Defined in: [packages/core/src/di/container.ts:222](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L222)

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

Defined in: [packages/core/src/di/container.ts:280](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L280)

#### Returns

[`RequestContext`](../interfaces/RequestContext.md) \| `undefined`

***

### runInRequestContext()

```ts
static runInRequestContext<R>(context, fn): R;
```

Defined in: [packages/core/src/di/container.ts:284](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/container.ts#L284)

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
