# Interface: OutgoingRequest\<T\>

Defined in: [packages/microservices/interfaces/packet.interface.ts:26](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L26)

An outgoing request packet sent by a [ClientProxy](../classes/ClientProxy.md).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `T` | Request payload. | [packages/microservices/interfaces/packet.interface.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L32) |
| <a id="id"></a> `id` | `string` | Unique request identifier. | [packages/microservices/interfaces/packet.interface.ts:28](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L28) |
| <a id="pattern"></a> `pattern` | `string` \| `Record`\<`string`, `unknown`\> | Target pattern. | [packages/microservices/interfaces/packet.interface.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L30) |
