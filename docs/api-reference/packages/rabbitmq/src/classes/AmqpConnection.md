# Class: AmqpConnection

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:42](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L42)

RabbitMQ connection class for publishing and consuming messages
This is the main class for RabbitMQ operations

## Constructors

### Constructor

```ts
new AmqpConnection(config, logger): AmqpConnection;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`RabbitMQConfig`](../interfaces/RabbitMQConfig.md) |
| `logger` | [`Logger`](../../../../index/classes/Logger.md) |

#### Returns

`AmqpConnection`

## Methods

### assertExchange()

```ts
assertExchange(config): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:309](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L309)

Assert an exchange

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`RabbitMQExchangeConfig`](../interfaces/RabbitMQExchangeConfig.md) |

#### Returns

`Promise`\<`void`\>

***

### assertQueue()

```ts
assertQueue(config): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:330](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L330)

Assert a queue

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`RabbitMQQueueConfig`](../interfaces/RabbitMQQueueConfig.md) |

#### Returns

`Promise`\<`void`\>

***

### connect()

```ts
connect(): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:102](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L102)

Connect to RabbitMQ

#### Returns

`Promise`\<`void`\>

***

### ~~createSubscriber()~~

```ts
createSubscriber(handler, options?): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:785](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L785)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `handler` | (...`args`) => `object` |
| `options?` | \{ `consumerTag?`: `string`; \} |
| `options.consumerTag?` | `string` |

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use registerHandlers instead

***

### disconnect()

```ts
disconnect(): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:246](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L246)

Disconnect from RabbitMQ

#### Returns

`Promise`\<`void`\>

***

### getChannel()

```ts
getChannel(): Channel | null;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:536](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L536)

Get the consumer channel (for consuming messages)

#### Returns

`Channel` \| `null`

***

### getConnection()

```ts
getConnection(): ChannelModel | null;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:550](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L550)

Get the underlying connection (for advanced usage)

#### Returns

`ChannelModel` \| `null`

***

### getPublisherChannel()

```ts
getPublisherChannel(): Channel | null;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:543](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L543)

Get the publisher channel (for publishing messages)

#### Returns

`Channel` \| `null`

***

### isConnectionReady()

```ts
isConnectionReady(): boolean;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:302](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L302)

Check if connected to RabbitMQ

#### Returns

`boolean`

***

### publish()

```ts
publish<T>(
   exchange, 
   routingKey, 
   message, 
options?): Promise<boolean>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:370](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L370)

Publish a message to an exchange

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `exchange` | `string` |
| `routingKey` | `string` |
| `message` | `T` |
| `options?` | [`RabbitMQPublishOptions`](../interfaces/RabbitMQPublishOptions.md) |

#### Returns

`Promise`\<`boolean`\>

***

### registerHandlers()

```ts
registerHandlers(handler, options?): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:710](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L710)

Register RabbitMQ handlers from a service class
Scans the class for

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handler` | (...`args`) => `object` | The handler class containing @RabbitSubscribe/@RabbitRPC methods |
| `options?` | \{ `consumerTag?`: `string`; \} | Optional configuration for consumer registration |
| `options.consumerTag?` | `string` | - |

#### Returns

`Promise`\<`void`\>

#### Rabbit Subscribe

and

#### Rabbit RPC

decorators and sets up consumers

#### Example

```typescript
await amqpConnection.registerHandlers(UserBonusesService);
```

***

### request()

```ts
request<T, R>(options): Promise<R>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:572](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L572)

Make an RPC request and wait for a response
This method creates a temporary reply queue, sends the request, and waits for a response

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |
| `R` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RequestOptions`](../interfaces/RequestOptions.md)\<`T`\> | Request options including exchange, routingKey, and payload |

#### Returns

`Promise`\<`R`\>

Promise that resolves with the response

#### Example

```typescript
const response = await amqpConnection.request({
  exchange: 'rpc',
  routingKey: 'calculator.add',
  payload: { a: 1, b: 2 },
  timeout: 10000,
});
console.log(response); // { result: 3 }
```

***

### sendToQueue()

```ts
sendToQueue<T>(
   queue, 
   message, 
options?): Promise<boolean>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:404](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L404)

Send a message directly to a queue

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `queue` | `string` |
| `message` | `T` |
| `options?` | [`RabbitMQPublishOptions`](../interfaces/RabbitMQPublishOptions.md) |

#### Returns

`Promise`\<`boolean`\>

***

### subscribe()

```ts
subscribe<T>(
   queue, 
   handler, 
options?): Promise<string>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:435](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L435)

Subscribe to messages from a queue

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `queue` | `string` |
| `handler` | (`message`) => `void` \| `Promise`\<`void`\> |
| `options?` | \{ `consumerTag?`: `string`; `noAck?`: `boolean`; \} |
| `options.consumerTag?` | `string` |
| `options.noAck?` | `boolean` |

#### Returns

`Promise`\<`string`\>

***

### unsubscribe()

```ts
unsubscribe(consumerTag): Promise<void>;
```

Defined in: [packages/rabbitmq/src/connection/amqp-connection.ts:474](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/connection/amqp-connection.ts#L474)

Cancel a consumer subscription

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `consumerTag` | `string` |

#### Returns

`Promise`\<`void`\>
