# Class: ClientFactory

Defined in: [packages/microservices/client/client-factory.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-factory.ts#L17)

Factory that creates the correct [ClientProxy](ClientProxy.md) implementation for the
given transport configuration.

## Constructors

### Constructor

```ts
new ClientFactory(): ClientFactory;
```

#### Returns

`ClientFactory`

## Methods

### create()

```ts
static create(options): ClientProxy;
```

Defined in: [packages/microservices/client/client-factory.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/client/client-factory.ts#L24)

Instantiates and returns a transport-specific [ClientProxy](ClientProxy.md).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`MicroserviceConfiguration`](../interfaces/MicroserviceConfiguration.md) | Transport configuration containing `transport` and `options`. |

#### Returns

[`ClientProxy`](ClientProxy.md)

#### Throws

When `options.transport` is not a supported transport.
