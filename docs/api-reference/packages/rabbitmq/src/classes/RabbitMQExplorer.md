# Class: RabbitMQExplorer

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:294](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L294)

## Constructors

### Constructor

```ts
new RabbitMQExplorer(connectionManager): RabbitMQExplorer;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:297](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L297)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `connectionManager` | [`AmqpConnectionManager`](AmqpConnectionManager.md) |

#### Returns

`RabbitMQExplorer`

## Methods

### onApplicationShutdown()

```ts
onApplicationShutdown(): Promise<void>;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:483](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L483)

#### Returns

`Promise`\<`void`\>

***

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [packages/rabbitmq/src/rabbitmq.module.ts:302](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/rabbitmq.module.ts#L302)

#### Returns

`Promise`\<`void`\>
