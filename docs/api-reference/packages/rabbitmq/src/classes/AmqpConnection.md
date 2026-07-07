# Class: AmqpConnection

Defined in: [packages/rabbitmq/src/amqp/connection.ts:124](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L124)

## Accessors

### channel

#### Get Signature

```ts
get channel(): ConfirmChannel;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:165](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L165)

##### Returns

`ConfirmChannel`

***

### channels

#### Get Signature

```ts
get channels(): Record<string, ConfirmChannel>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:187](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L187)

##### Returns

`Record`\<`string`, `ConfirmChannel`\>

***

### configuration

#### Get Signature

```ts
get configuration(): Required<RabbitMQConfig>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:183](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L183)

##### Returns

`Required`\<[`RabbitMQConfig`](../interfaces/RabbitMQConfig.md)\>

***

### connected

#### Get Signature

```ts
get connected(): boolean;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:195](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L195)

##### Returns

`boolean`

***

### connection

#### Get Signature

```ts
get connection(): Connection;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:170](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L170)

##### Returns

`Connection`

***

### consumerTags

#### Get Signature

```ts
get consumerTags(): string[];
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:1198](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L1198)

##### Returns

`string`[]

***

### managedChannel

#### Get Signature

```ts
get managedChannel(): ChannelWrapper;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:175](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L175)

##### Returns

`ChannelWrapper`

***

### managedChannels

#### Get Signature

```ts
get managedChannels(): Record<string, ChannelWrapper>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:191](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L191)

##### Returns

`Record`\<`string`, `ChannelWrapper`\>

***

### managedConnection

#### Get Signature

```ts
get managedConnection(): IAmqpConnectionManager;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:179](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L179)

##### Returns

`IAmqpConnectionManager`

## Constructors

### Constructor

```ts
new AmqpConnection(config): AmqpConnection;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:153](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L153)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`RabbitMQConfig`](../interfaces/RabbitMQConfig.md) |

#### Returns

`AmqpConnection`

## Methods

### cancelConsumer()

```ts
cancelConsumer(consumerTag): Promise<void>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:1202](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L1202)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `consumerTag` | `string` |

#### Returns

`Promise`\<`void`\>

***

### close()

```ts
close(): Promise<void>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:1250](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L1250)

#### Returns

`Promise`\<`void`\>

***

### createBatchSubscriber()

```ts
createBatchSubscriber<T>(
   handler, 
   msgOptions, 
consumeOptions?): Promise<SubscriptionResult>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:488](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L488)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | [`BatchSubscriberHandler`](../type-aliases/BatchSubscriberHandler.md)\<`T`\> |
| `msgOptions` | [`MessageHandlerOptions`](../interfaces/MessageHandlerOptions.md) |
| `consumeOptions?` | `Consume` |

#### Returns

`Promise`\<[`SubscriptionResult`](../interfaces/SubscriptionResult.md)\>

***

### createRpc()

```ts
createRpc<T, U>(handler, rpcOptions): Promise<SubscriptionResult>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:808](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L808)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | [`RpcSubscriberHandler`](../type-aliases/RpcSubscriberHandler.md)\<`T`, `U`\> |
| `rpcOptions` | [`MessageHandlerOptions`](../interfaces/MessageHandlerOptions.md) |

#### Returns

`Promise`\<[`SubscriptionResult`](../interfaces/SubscriptionResult.md)\>

***

### createSubscriber()

```ts
createSubscriber<T>(
   handler, 
   msgOptions, 
   originalHandlerName, 
consumeOptions?): Promise<SubscriptionResult>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:467](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L467)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | [`SubscriberHandler`](../type-aliases/SubscriberHandler.md)\<`T`\> |
| `msgOptions` | [`MessageHandlerOptions`](../interfaces/MessageHandlerOptions.md) |
| `originalHandlerName` | `string` |
| `consumeOptions?` | `Consume` |

#### Returns

`Promise`\<[`SubscriptionResult`](../interfaces/SubscriptionResult.md)\>

***

### init()

```ts
init(): Promise<void>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:199](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L199)

#### Returns

`Promise`\<`void`\>

***

### publish()

```ts
publish(
   exchange, 
   routingKey, 
   message, 
options?): Promise<boolean>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:993](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L993)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `exchange` | `string` |
| `routingKey` | `string` |
| `message` | `unknown` |
| `options?` | `Publish` |

#### Returns

`Promise`\<`boolean`\>

***

### request()

```ts
request<T>(requestOptions): Promise<T>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:420](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L420)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `requestOptions` | [`RequestOptions`](../interfaces/RequestOptions.md) |

#### Returns

`Promise`\<`T`\>

***

### resumeConsumer()

```ts
resumeConsumer<T, U>(consumerTag): Promise<string | null>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:1213](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L1213)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `consumerTag` | `string` |

#### Returns

`Promise`\<`string` \| `null`\>

***

### setupRpcChannel()

```ts
setupRpcChannel<T, U>(
   handler, 
   rpcOptions, 
channel): Promise<string>;
```

Defined in: [packages/rabbitmq/src/amqp/connection.ts:869](https://github.com/nestelia/nestelia/blob/main/packages/rabbitmq/src/amqp/connection.ts#L869)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | [`RpcSubscriberHandler`](../type-aliases/RpcSubscriberHandler.md)\<`T`, `U`\> |
| `rpcOptions` | [`MessageHandlerOptions`](../interfaces/MessageHandlerOptions.md) |
| `channel` | `ConfirmChannel` |

#### Returns

`Promise`\<`string`\>
