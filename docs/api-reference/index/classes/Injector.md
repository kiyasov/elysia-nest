# Class: Injector

Defined in: [packages/core/src/di/injector.ts:26](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/injector.ts#L26)

## Constructors

### Constructor

```ts
new Injector(container): Injector;
```

Defined in: [packages/core/src/di/injector.ts:29](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/injector.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `container` | [`Container`](Container.md) |

#### Returns

`Injector`

## Methods

### loadInstance()

```ts
loadInstance(
   wrapper, 
   moduleRef, 
   contextId?
): Promise<void>;
```

Defined in: [packages/core/src/di/injector.ts:31](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/injector.ts#L31)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `wrapper` | [`InstanceWrapper`](InstanceWrapper.md) | `undefined` |
| `moduleRef` | `Module` | `undefined` |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) | `STATIC_CONTEXT` |

#### Returns

`Promise`\<`void`\>

***

### loadPrototype()

```ts
loadPrototype(wrapper, contextId?): Promise<void>;
```

Defined in: [packages/core/src/di/injector.ts:79](https://github.com/nestelia/nestelia/blob/main/packages/core/src/di/injector.ts#L79)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `wrapper` | [`InstanceWrapper`](InstanceWrapper.md) | `undefined` |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) | `STATIC_CONTEXT` |

#### Returns

`Promise`\<`void`\>
