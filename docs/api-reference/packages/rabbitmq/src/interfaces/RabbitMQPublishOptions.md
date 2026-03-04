# Interface: RabbitMQPublishOptions

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:236](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L236)

Publisher options

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="correlationid"></a> `correlationId?` | `string` | Correlation ID for RPC | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:244](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L244) |
| <a id="expiration"></a> `expiration?` | `number` | Message expiration in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:242](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L242) |
| <a id="headers"></a> `headers?` | `Record`\<`string`, `unknown`\> | Message headers | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:238](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L238) |
| <a id="messageid"></a> `messageId?` | `string` | Message ID | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:252](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L252) |
| <a id="persistent"></a> `persistent?` | `boolean` | Persistent message (saved to disk) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:250](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L250) |
| <a id="priority"></a> `priority?` | `number` | Message priority (0-9) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:240](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L240) |
| <a id="replyto"></a> `replyTo?` | `string` | Reply queue for RPC | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:246](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L246) |
| <a id="type"></a> `type?` | `string` | Message type | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:248](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L248) |
