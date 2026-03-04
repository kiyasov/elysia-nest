# Interface: ServerFactoryInterface

Defined in: [packages/microservices/interfaces/server.interface.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L36)

Factory interface for creating transport servers.

## Methods

### create()

```ts
create(options): 
  | CustomTransportStrategy
  | Server;
```

Defined in: [packages/microservices/interfaces/server.interface.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L37)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`MicroserviceOptions`](../type-aliases/MicroserviceOptions.md) |

#### Returns

  \| [`CustomTransportStrategy`](CustomTransportStrategy.md)
  \| [`Server`](Server.md)
