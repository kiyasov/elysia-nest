# Interface: Server

Defined in: [packages/microservices/interfaces/server.interface.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L13)

Contract that every built-in transport server must satisfy.
Custom transports only need to implement [CustomTransportStrategy](CustomTransportStrategy.md).

## Methods

### addHandler()

```ts
addHandler(pattern, callback): void;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L15)

Register a handler for request-response messages matching `pattern`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pattern` | `string` |
| `callback` | [`MessageHandler`](../type-aliases/MessageHandler.md) |

#### Returns

`void`

***

### close()

```ts
close(): void;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L21)

Shut down the transport and release all resources.

#### Returns

`void`

***

### emitEvent()

```ts
emitEvent<T>(pattern, data): void;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L19)

Publish a fire-and-forget event.

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

***

### listen()

```ts
listen(callback?): void | Promise<void>;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:26](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L26)

Start the transport server.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback?` | (`err?`) => `void` | Called when the server is ready or has failed. |

#### Returns

`void` \| `Promise`\<`void`\>

***

### sendMessage()

```ts
sendMessage<T>(pattern, data): Promise<unknown>;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L17)

Send a request and wait for the response.

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

`Promise`\<`unknown`\>
