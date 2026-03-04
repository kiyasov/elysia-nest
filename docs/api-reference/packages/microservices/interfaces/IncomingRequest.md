# Interface: IncomingRequest\<T\>

Defined in: [packages/microservices/interfaces/packet.interface.ts:2](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L2)

An incoming request packet (request-response pattern).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `T` | Request payload. | [packages/microservices/interfaces/packet.interface.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L8) |
| <a id="id"></a> `id` | `string` | Unique request identifier used to correlate the response. | [packages/microservices/interfaces/packet.interface.ts:4](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L4) |
| <a id="pattern"></a> `pattern` | `string` \| `Record`\<`string`, `unknown`\> | Pattern that identifies the handler on the server side. | [packages/microservices/interfaces/packet.interface.ts:6](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L6) |
