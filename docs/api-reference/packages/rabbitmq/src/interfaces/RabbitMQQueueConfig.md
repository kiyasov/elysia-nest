# Interface: RabbitMQQueueConfig

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:135](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L135)

Queue configuration

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="bindings"></a> `bindings?` | [`RabbitMQQueueBinding`](RabbitMQQueueBinding.md)[] | Queue bindings | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:152](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L152) |
| <a id="createifnotexists"></a> `createIfNotExists?` | `boolean` | Create queue if it doesn't exist | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:158](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L158) |
| <a id="exchange"></a> `exchange?` | `string` | Exchange to bind to (shortcut for simple binding) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:154](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L154) |
| <a id="name"></a> `name` | `string` | Queue name | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:137](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L137) |
| <a id="options"></a> `options?` | \{ `arguments?`: `Record`\<`string`, `unknown`\>; `autoDelete?`: `boolean`; `durable?`: `boolean`; `exclusive?`: `boolean`; `maxLength?`: `number`; `maxLengthBytes?`: `number`; `messageTtl?`: `number`; \} | Queue options | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:139](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L139) |
| `options.arguments?` | `Record`\<`string`, `unknown`\> | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:143](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L143) |
| `options.autoDelete?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:141](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L141) |
| `options.durable?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:140](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L140) |
| `options.exclusive?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:142](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L142) |
| `options.maxLength?` | `number` | Maximum number of messages in queue | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:147](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L147) |
| `options.maxLengthBytes?` | `number` | Maximum queue size in bytes | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:149](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L149) |
| `options.messageTtl?` | `number` | Message TTL in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:145](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L145) |
| <a id="routingkey"></a> `routingKey?` | `string` | Routing key for binding (shortcut for simple binding) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:156](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L156) |
