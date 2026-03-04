# Interface: PatternHandler

Defined in: [packages/microservices/interfaces/server.interface.ts:41](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L41)

Metadata describing a registered pattern handler.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="handler"></a> `handler` | [`MessageHandler`](../type-aliases/MessageHandler.md) | - | [packages/microservices/interfaces/server.interface.ts:43](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L43) |
| <a id="isevent"></a> `isEvent?` | `boolean` | When `true`, this is a fire-and-forget event handler. | [packages/microservices/interfaces/server.interface.ts:47](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L47) |
| <a id="methodname"></a> `methodName` | `string` | - | [packages/microservices/interfaces/server.interface.ts:45](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L45) |
| <a id="pattern"></a> `pattern` | `string` | - | [packages/microservices/interfaces/server.interface.ts:42](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L42) |
| <a id="target"></a> `target` | [`Type`](../../../index/interfaces/Type.md) | - | [packages/microservices/interfaces/server.interface.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/server.interface.ts#L44) |
