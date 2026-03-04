# Interface: IncomingEvent\<T\>

Defined in: [packages/microservices/interfaces/packet.interface.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L36)

An incoming event packet (fire-and-forget pattern).

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `T` | Event payload. | [packages/microservices/interfaces/packet.interface.ts:40](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L40) |
| <a id="pattern"></a> `pattern` | `string` \| `Record`\<`string`, `unknown`\> | Target pattern. | [packages/microservices/interfaces/packet.interface.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L38) |
