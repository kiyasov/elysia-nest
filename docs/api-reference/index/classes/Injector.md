# Class: Injector

Defined in: [packages/core/src/di/injector.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/injector.ts#L12)

## Constructors

### Constructor

```ts
new Injector(container): Injector;
```

Defined in: [packages/core/src/di/injector.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/injector.ts#L13)

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
contextId?): Promise<void>;
```

Defined in: [packages/core/src/di/injector.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/injector.ts#L15)

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

Defined in: [packages/core/src/di/injector.ts:46](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/di/injector.ts#L46)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `wrapper` | [`InstanceWrapper`](InstanceWrapper.md) | `undefined` |
| `contextId` | [`ContextId`](../interfaces/ContextId.md) | `STATIC_CONTEXT` |

#### Returns

`Promise`\<`void`\>
