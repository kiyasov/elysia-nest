# Class: RabbitMQClient

Defined in: [packages/microservices/client/rabbitmq.client.ts:72](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/rabbitmq.client.ts#L72)

Client proxy that communicates over RabbitMQ (AMQP via amqplib).

- [send](#send): publishes a message with `replyTo` and `correlationId` set,
  then waits for a reply on an exclusive per-client queue.
- [emit](#emit): publishes without `replyTo`.

Requires the optional peer dependency `amqplib`.

## Extends

- [`ClientProxy`](ClientProxy.md)

## Constructors

### Constructor

```ts
new RabbitMQClient(options): RabbitMQClient;
```

Defined in: [packages/microservices/client/rabbitmq.client.ts:88](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/rabbitmq.client.ts#L88)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RabbitMQOptions`](../interfaces/RabbitMQOptions.md) |

#### Returns

`RabbitMQClient`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`constructor`](ClientProxy.md#constructor)

## Methods

### close()

```ts
close(): void;
```

Defined in: [packages/microservices/client/rabbitmq.client.ts:217](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/rabbitmq.client.ts#L217)

Cancels the consumer, closes channel and connection.

#### Returns

`void`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`close`](ClientProxy.md#close)

***

### connect()

```ts
connect(): Promise<void>;
```

Defined in: [packages/microservices/client/rabbitmq.client.ts:99](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/rabbitmq.client.ts#L99)

Connects to RabbitMQ and sets up the exclusive reply queue.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ClientProxy`](ClientProxy.md).[`connect`](ClientProxy.md#connect)

***

### emit()

```ts
emit<T>(pattern, data): void;
```

Defined in: [packages/microservices/client/rabbitmq.client.ts:199](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/rabbitmq.client.ts#L199)

Publishes a fire-and-forget event to `pattern`.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `data` | `T` |

#### Returns

`void`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`emit`](ClientProxy.md#emit)

***

### send()

```ts
send<T, R>(pattern, data): Observable<R>;
```

Defined in: [packages/microservices/client/rabbitmq.client.ts:158](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/rabbitmq.client.ts#L158)

Sends a request to `pattern` and returns an Observable that emits the
server's response then completes. Times out after **5 seconds**.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |
| `R` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `data` | `T` |

#### Returns

`Observable`\<`R`\>

#### Overrides

[`ClientProxy`](ClientProxy.md).[`send`](ClientProxy.md#send)
