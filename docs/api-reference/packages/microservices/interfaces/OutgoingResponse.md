# Interface: OutgoingResponse\<T\>

Defined in: [packages/microservices/interfaces/packet.interface.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L12)

An outgoing response packet (request-response pattern).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data?` | `T` | Response payload. Undefined when `error` is set. | [packages/microservices/interfaces/packet.interface.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L18) |
| <a id="error"></a> `error?` | `string` | Error message when the handler threw an exception. | [packages/microservices/interfaces/packet.interface.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L20) |
| <a id="id"></a> `id` | `string` | Identifier matching the originating [IncomingRequest.id](IncomingRequest.md#id). | [packages/microservices/interfaces/packet.interface.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L14) |
| <a id="isdisposed"></a> `isDisposed?` | `boolean` | When `true`, the response stream is complete (no more messages). | [packages/microservices/interfaces/packet.interface.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L22) |
| <a id="pattern"></a> `pattern` | `string` \| `Record`\<`string`, `unknown`\> | Pattern echoed from the request. | [packages/microservices/interfaces/packet.interface.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L16) |
