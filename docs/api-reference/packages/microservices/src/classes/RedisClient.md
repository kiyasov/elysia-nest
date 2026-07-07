# Class: RedisClient

Defined in: [packages/microservices/src/client/redis.client.ts:31](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/client/redis.client.ts#L31)

Client proxy that communicates over Redis Pub/Sub.

- [send](#send): publishes to `<pattern>` with a unique `id` and subscribes
  to `<pattern>.reply` for the correlated response.
- [emit](#emit): publishes to `<pattern>` without an `id`.

Requires the optional peer dependency `ioredis`.

## Extends

- [`ClientProxy`](ClientProxy.md)

## Constructors

### Constructor

```ts
new RedisClient(options): RedisClient;
```

Defined in: [packages/microservices/src/client/redis.client.ts:46](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/client/redis.client.ts#L46)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`RedisOptions`](../interfaces/RedisOptions.md) |

#### Returns

`RedisClient`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`constructor`](ClientProxy.md#constructor)

## Methods

### close()

```ts
close(): void;
```

Defined in: [packages/microservices/src/client/redis.client.ts:196](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/client/redis.client.ts#L196)

Disconnects both Redis clients and clears pending state.

#### Returns

`void`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`close`](ClientProxy.md#close)

***

### connect()

```ts
connect(): Promise<void>;
```

Defined in: [packages/microservices/src/client/redis.client.ts:57](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/client/redis.client.ts#L57)

Opens publisher and subscriber connections.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ClientProxy`](ClientProxy.md).[`connect`](ClientProxy.md#connect)

***

### emit()

```ts
emit<T>(pattern, data): void;
```

Defined in: [packages/microservices/src/client/redis.client.ts:188](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/client/redis.client.ts#L188)

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

Defined in: [packages/microservices/src/client/redis.client.ts:150](https://github.com/nestelia/nestelia/blob/main/packages/microservices/src/client/redis.client.ts#L150)

Sends a request to `pattern` and returns an Observable that emits the
response then completes. Times out after **5 seconds**.

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
