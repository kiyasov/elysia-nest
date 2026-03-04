# Abstract Class: ClientProxy

Defined in: [packages/microservices/client/client-proxy.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-proxy.ts#L10)

Abstract base class for all microservice client proxies.

Concrete implementations are transport-specific and are created by
[ClientFactory](ClientFactory.md).  Use the [Client](../functions/Client.md) decorator to inject a
proxy instance into a class property.

## Extended by

- [`RabbitMQClient`](RabbitMQClient.md)
- [`RedisClient`](RedisClient.md)
- [`TcpClient`](TcpClient.md)

## Constructors

### Constructor

```ts
new ClientProxy(): ClientProxy;
```

#### Returns

`ClientProxy`

## Methods

### close()

```ts
abstract close(): void;
```

Defined in: [packages/microservices/client/client-proxy.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-proxy.ts#L18)

Closes the transport connection and releases resources.

#### Returns

`void`

***

### connect()

```ts
abstract connect(): Promise<void>;
```

Defined in: [packages/microservices/client/client-proxy.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-proxy.ts#L15)

Opens the underlying transport connection.
Must be called before invoking [send](#send) or [emit](#emit).

#### Returns

`Promise`\<`void`\>

***

### emit()

```ts
abstract emit<T>(pattern, data): void;
```

Defined in: [packages/microservices/client/client-proxy.ts:45](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-proxy.ts#L45)

Publishes a fire-and-forget event matching `pattern`.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern` | `string` | Target event pattern. |
| `data` | `T` | Event payload. |

#### Returns

`void`

***

### send()

```ts
abstract send<T, R>(pattern, data): Observable<R>;
```

Defined in: [packages/microservices/client/client-proxy.ts:34](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-proxy.ts#L34)

Sends a request matching `pattern` and returns an Observable that emits
the server's response then completes.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |
| `R` | `unknown` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern` | `string` | Target message pattern. |
| `data` | `T` | Request payload. |

#### Returns

`Observable`\<`R`\>

#### Example

```typescript
this.client.send<number>('sum', [1, 2, 3]).subscribe(result => {
  console.log(result); // 6
});
```
