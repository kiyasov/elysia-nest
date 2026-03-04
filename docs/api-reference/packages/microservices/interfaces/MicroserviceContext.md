# Interface: MicroserviceContext

Defined in: [packages/microservices/interfaces/packet.interface.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L44)

Contextual information injected via the [MessageCtx](../functions/MessageCtx.md) decorator.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="getdata"></a> `getData` | \<`T`\>() => `T` | Returns the typed message payload. | [packages/microservices/interfaces/packet.interface.ts:52](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L52) |
| <a id="getpattern"></a> `getPattern` | () => `string` | Returns the serialized pattern string. | [packages/microservices/interfaces/packet.interface.ts:50](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L50) |
| <a id="pattern"></a> `pattern` | `string` \| `Record`\<`string`, `unknown`\> | Pattern that matched this message. | [packages/microservices/interfaces/packet.interface.ts:46](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L46) |
| <a id="transport"></a> `transport` | `string` | Transport name (e.g. `"redis"`, `"tcp"`, `"rabbitmq"`). | [packages/microservices/interfaces/packet.interface.ts:48](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/packet.interface.ts#L48) |
