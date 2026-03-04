# Class: TcpClient

Defined in: [packages/microservices/client/tcp.client.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/tcp.client.ts#L25)

Client proxy that communicates over raw TCP with newline-delimited JSON
framing.

- [send](#send): writes `{ id, pattern, data }\n` and waits for `{ id, data }\n`.
- [emit](#emit): writes `{ id, pattern, data }\n` without waiting for a reply.

## Extends

- [`ClientProxy`](ClientProxy.md)

## Constructors

### Constructor

```ts
new TcpClient(options): TcpClient;
```

Defined in: [packages/microservices/client/tcp.client.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/tcp.client.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`TcpOptions`](../interfaces/TcpOptions.md) |

#### Returns

`TcpClient`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`constructor`](ClientProxy.md#constructor)

## Methods

### close()

```ts
close(): void;
```

Defined in: [packages/microservices/client/tcp.client.ts:141](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/tcp.client.ts#L141)

Destroys the socket and clears pending requests.

#### Returns

`void`

#### Overrides

[`ClientProxy`](ClientProxy.md).[`close`](ClientProxy.md#close)

***

### connect()

```ts
connect(): Promise<void>;
```

Defined in: [packages/microservices/client/tcp.client.ts:42](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/tcp.client.ts#L42)

Opens a TCP connection to the configured host/port.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ClientProxy`](ClientProxy.md).[`connect`](ClientProxy.md#connect)

***

### emit()

```ts
emit<T>(pattern, data): void;
```

Defined in: [packages/microservices/client/tcp.client.ts:133](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/tcp.client.ts#L133)

Writes a fire-and-forget event to the server.

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

Defined in: [packages/microservices/client/tcp.client.ts:104](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/tcp.client.ts#L104)

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
