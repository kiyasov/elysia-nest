# Class: InstanceWrapper\<T\>

Defined in: [packages/core/src/di/instance-wrapper.ts:42](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L42)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Accessors

### instance

#### Get Signature

```ts
get instance(): T;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:102](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L102)

##### Returns

`T`

#### Set Signature

```ts
set instance(value): void;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:97](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L97)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `T` |

##### Returns

`void`

***

### isFactory

#### Get Signature

```ts
get isFactory(): boolean;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:111](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L111)

##### Returns

`boolean`

***

### isTransient

#### Get Signature

```ts
get isTransient(): boolean;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:107](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L107)

##### Returns

`boolean`

***

### uuid

#### Get Signature

```ts
get uuid(): string;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:93](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L93)

##### Returns

`string`

## Constructors

### Constructor

```ts
new InstanceWrapper<T>(options): InstanceWrapper<T>;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:62](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L62)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `InstanceWrapperOptions`\<`T`\> |

#### Returns

`InstanceWrapper`\<`T`\>

## Methods

### addCtorMetadata()

```ts
addCtorMetadata(index, wrapper): void;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:278](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L278)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `number` |
| `wrapper` | `InstanceWrapper` |

#### Returns

`void`

***

### addPropertiesMetadata()

```ts
addPropertiesMetadata(key, wrapper): void;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:289](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L289)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` \| `symbol` |
| `wrapper` | `InstanceWrapper` |

#### Returns

`void`

***

### attachRootInquirer()

```ts
attachRootInquirer(inquirer): void;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:339](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L339)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `inquirer` | `InstanceWrapper` |

#### Returns

`void`

***

### cloneStaticInstance()

```ts
cloneStaticInstance(contextId): InstancePerContext<T>;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:190](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L190)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |

#### Returns

[`InstancePerContext`](../interfaces/InstancePerContext.md)\<`T`\>

***

### cloneTransientInstance()

```ts
cloneTransientInstance(contextId, inquirerId): InstancePerContext<T>;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:214](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L214)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `inquirerId` | `string` |

#### Returns

[`InstancePerContext`](../interfaces/InstancePerContext.md)\<`T`\>

***

### createPrototype()

```ts
createPrototype(contextId): object | undefined;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:237](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L237)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |

#### Returns

`object` \| `undefined`

***

### getCtorMetadata()

```ts
getCtorMetadata(): InstanceWrapper<unknown>[];
```

Defined in: [packages/core/src/di/instance-wrapper.ts:285](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L285)

#### Returns

`InstanceWrapper`\<`unknown`\>[]

***

### getInstanceByContextId()

```ts
getInstanceByContextId(contextId, inquirerId?): InstancePerContext<T>;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:115](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L115)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `inquirerId?` | `string` |

#### Returns

[`InstancePerContext`](../interfaces/InstancePerContext.md)\<`T`\>

***

### getInstanceByInquirerId()

```ts
getInstanceByInquirerId(contextId, inquirerId): InstancePerContext<T>;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:140](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L140)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `inquirerId` | `string` |

#### Returns

[`InstancePerContext`](../interfaces/InstancePerContext.md)\<`T`\>

***

### getPropertiesMetadata()

```ts
getPropertiesMetadata(): PropertyMetadata[];
```

Defined in: [packages/core/src/di/instance-wrapper.ts:299](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L299)

#### Returns

`PropertyMetadata`[]

***

### getRootInquirer()

```ts
getRootInquirer(): InstanceWrapper<unknown> | undefined;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:346](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L346)

#### Returns

`InstanceWrapper`\<`unknown`\> \| `undefined`

***

### isDependencyTreeStatic()

```ts
isDependencyTreeStatic(visited?): boolean;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:245](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L245)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `visited` | `Set`\<`string`\> |

#### Returns

`boolean`

***

### isInRequestScope()

```ts
isInRequestScope(contextId, inquirer?): boolean;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:303](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L303)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `inquirer?` | `InstanceWrapper`\<`unknown`\> |

#### Returns

`boolean`

***

### isStatic()

```ts
isStatic(contextId, inquirer?): boolean;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:315](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L315)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `inquirer?` | `InstanceWrapper`\<`unknown`\> |

#### Returns

`boolean`

***

### setInstanceByContextId()

```ts
setInstanceByContextId(
   contextId, 
   value, 
   inquirerId?): void;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:162](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L162)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `value` | [`InstancePerContext`](../interfaces/InstancePerContext.md)\<`T`\> |
| `inquirerId?` | `string` |

#### Returns

`void`

***

### setInstanceByInquirerId()

```ts
setInstanceByInquirerId(
   contextId, 
   inquirerId, 
   value): void;
```

Defined in: [packages/core/src/di/instance-wrapper.ts:173](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L173)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) |
| `inquirerId` | `string` |
| `value` | [`InstancePerContext`](../interfaces/InstancePerContext.md)\<`T`\> |

#### Returns

`void`

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="aliastarget"></a> `aliasTarget?` | `readonly` | [`ProviderToken`](../type-aliases/ProviderToken.md) | `undefined` | [packages/core/src/di/instance-wrapper.ts:48](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L48) |
| <a id="durable"></a> `durable?` | `public` | `boolean` | `undefined` | [packages/core/src/di/instance-wrapper.ts:53](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L53) |
| <a id="host"></a> `host?` | `readonly` | `Module` | `undefined` | [packages/core/src/di/instance-wrapper.ts:45](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L45) |
| <a id="inject"></a> `inject` | `public` | `unknown`[] \| `null` | `null` | [packages/core/src/di/instance-wrapper.ts:52](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L52) |
| <a id="isalias"></a> `isAlias` | `readonly` | `boolean` | `undefined` | [packages/core/src/di/instance-wrapper.ts:46](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L46) |
| <a id="metatype"></a> `metatype` | `public` | `Function` \| [`Type`](../interfaces/Type.md)\<`T`\> \| `null` | `undefined` | [packages/core/src/di/instance-wrapper.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L51) |
| <a id="name"></a> `name` | `readonly` | `string` \| `symbol` | `undefined` | [packages/core/src/di/instance-wrapper.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L44) |
| <a id="scope"></a> `scope` | `public` | [`Scope`](../enumerations/Scope.md) | `undefined` | [packages/core/src/di/instance-wrapper.ts:50](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L50) |
| <a id="subtype"></a> `subtype?` | `readonly` | `string` | `undefined` | [packages/core/src/di/instance-wrapper.ts:47](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L47) |
| <a id="token"></a> `token` | `readonly` | [`ProviderToken`](../type-aliases/ProviderToken.md) | `undefined` | [packages/core/src/di/instance-wrapper.ts:43](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/instance-wrapper.ts#L43) |
