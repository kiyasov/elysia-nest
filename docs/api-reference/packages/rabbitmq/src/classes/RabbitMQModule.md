# Class: RabbitMQModule

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:125](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L125)

## Constructors

### Constructor

```ts
new RabbitMQModule(): RabbitMQModule;
```

#### Returns

`RabbitMQModule`

## Methods

### AmqpConnectionFactory()

```ts
static AmqpConnectionFactory(config): Promise<AmqpConnection | undefined>;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:165](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L165)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`RabbitMQConfig`](../interfaces/RabbitMQConfig.md) |

#### Returns

`Promise`\<[`AmqpConnection`](AmqpConnection.md) \| `undefined`\>

***

### attach()

```ts
static attach(connection): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:277](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L277)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `connection` | [`AmqpConnection`](AmqpConnection.md) |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

***

### forFeature()

```ts
static forFeature(handlers): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:269](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L269)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handlers` | `unknown`[] |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

***

### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:187](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L187)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md) |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

***

### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:222](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L222)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `inject?`: ( \| [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) \| \{ `optional?`: `boolean`; `token`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md); \})[]; `isGlobal?`: `boolean`; `useFactory`: (...`args`) => \| [`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md) \| `Promise`\<[`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md)\>; \} |
| `options.inject?` | ( \| [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) \| \{ `optional?`: `boolean`; `token`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md); \})[] |
| `options.isGlobal?` | `boolean` |
| `options.useFactory` | (...`args`) => \| [`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md) \| `Promise`\<[`RabbitMQModuleOptions`](../interfaces/RabbitMQModuleOptions.md)\> |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

***

### markConnectionBootstrapped()

```ts
static markConnectionBootstrapped(name): boolean;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:148](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L148)

**`Internal`**

Marks a connection as bootstrapped. Returns `true` when it was already
bootstrapped (the caller should skip re-registration) and `false` on the
first call for that connection name.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`

***

### resetBootstrapGuard()

```ts
static resetBootstrapGuard(): void;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:161](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L161)

**`Internal`**

Clears the per-connection bootstrap guard. Called on shutdown so a
subsequent boot (e.g. across test suites) re-registers handlers.

#### Returns

`void`

## Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="connectionmanager"></a> `connectionManager` | `readonly` | [`AmqpConnectionManager`](AmqpConnectionManager.md) | Shared manager that owns every named connection created through this module. Kept static so that multiple `forRoot`/`forRootAsync` registrations (one per named connection) share a single registry, and so the shutdown hook can close them all. | [packages/rabbitmq/src/rabbitmq.module.ts:132](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L132) |
