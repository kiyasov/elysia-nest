# Class: TestingModule

Defined in: [packages/testing/src/testing.module-builder.ts:289](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L289)

Compiled testing module with methods to access providers

## Accessors

### container

#### Get Signature

```ts
get container(): Container;
```

Defined in: [packages/testing/src/testing.module-builder.ts:367](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L367)

Get the container instance

##### Returns

[`Container`](../../../../index/classes/Container.md)

***

### module

#### Get Signature

```ts
get module(): Module;
```

Defined in: [packages/testing/src/testing.module-builder.ts:360](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L360)

Get the module reference

##### Returns

`Module`

## Constructors

### Constructor

```ts
new TestingModule(_module, _container): TestingModule;
```

Defined in: [packages/testing/src/testing.module-builder.ts:290](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L290)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `_module` | `Module` |
| `_container` | [`Container`](../../../../index/classes/Container.md) |

#### Returns

`TestingModule`

## Methods

### get()

```ts
get<T>(token): T;
```

Defined in: [packages/testing/src/testing.module-builder.ts:299](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L299)

Get a provider instance from the module.
Synchronous - returns already resolved instance.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`T`

***

### has()

```ts
has(token): boolean;
```

Defined in: [packages/testing/src/testing.module-builder.ts:348](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L348)

Check if provider exists in module

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`boolean`

***

### resolve()

```ts
resolve<T>(token): Promise<T>;
```

Defined in: [packages/testing/src/testing.module-builder.ts:333](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L333)

Resolve a provider instance (async, for request-scoped providers)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`Promise`\<`T`\>
