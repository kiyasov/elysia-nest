# Interface: RabbitMQMessage\<T\>

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:198](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L198)

Message wrapper interface

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="ack"></a> `ack` | () => `void` | Acknowledge message | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:226](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L226) |
| <a id="content"></a> `content` | `T` | Message content | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:200](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L200) |
| <a id="fields"></a> `fields` | \{ `deliveryTag`: `number`; `exchange`: `string`; `redelivered`: `boolean`; `routingKey`: `string`; \} | Message fields | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:202](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L202) |
| `fields.deliveryTag` | `number` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:203](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L203) |
| `fields.exchange` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:205](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L205) |
| `fields.redelivered` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:204](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L204) |
| `fields.routingKey` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:206](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L206) |
| <a id="nack"></a> `nack` | (`requeue?`) => `void` | Negative acknowledge message | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:228](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L228) |
| <a id="properties"></a> `properties` | \{ `appId?`: `string`; `clusterId?`: `string`; `contentEncoding?`: `string`; `contentType?`: `string`; `correlationId?`: `string`; `deliveryMode?`: `number`; `expiration?`: `string`; `headers?`: `Record`\<`string`, `unknown`\>; `messageId?`: `string`; `priority?`: `number`; `replyTo?`: `string`; `timestamp?`: `number`; `type?`: `string`; `userId?`: `string`; \} | Message properties | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:209](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L209) |
| `properties.appId?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:222](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L222) |
| `properties.clusterId?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:223](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L223) |
| `properties.contentEncoding?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:211](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L211) |
| `properties.contentType?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:210](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L210) |
| `properties.correlationId?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:215](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L215) |
| `properties.deliveryMode?` | `number` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:213](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L213) |
| `properties.expiration?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:217](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L217) |
| `properties.headers?` | `Record`\<`string`, `unknown`\> | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:212](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L212) |
| `properties.messageId?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:218](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L218) |
| `properties.priority?` | `number` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:214](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L214) |
| `properties.replyTo?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:216](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L216) |
| `properties.timestamp?` | `number` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:219](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L219) |
| `properties.type?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:220](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L220) |
| `properties.userId?` | `string` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:221](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L221) |
| <a id="reject"></a> `reject` | (`requeue?`) => `void` | Reject message | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:230](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L230) |
