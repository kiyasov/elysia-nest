# Class: ServerFactory

Defined in: [packages/microservices/transports/server.factory.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/transports/server.factory.ts#L22)

Factory that instantiates the correct transport server based on the
provided [MicroserviceOptions](../type-aliases/MicroserviceOptions.md).

When the options object already implements [CustomTransportStrategy](../interfaces/CustomTransportStrategy.md)
(i.e. it has a `listen` function), it is returned as-is.

## Constructors

### Constructor

```ts
new ServerFactory(): ServerFactory;
```

#### Returns

`ServerFactory`

## Methods

### create()

```ts
static create(options): 
  | CustomTransportStrategy
  | Server;
```

Defined in: [packages/microservices/transports/server.factory.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/transports/server.factory.ts#L30)

Creates and returns the appropriate transport server.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`MicroserviceOptions`](../type-aliases/MicroserviceOptions.md) | Either a built-in transport configuration or a custom transport strategy instance. |

#### Returns

  \| [`CustomTransportStrategy`](../interfaces/CustomTransportStrategy.md)
  \| [`Server`](../interfaces/Server.md)

#### Throws

When `options.transport` is not a supported built-in transport.
