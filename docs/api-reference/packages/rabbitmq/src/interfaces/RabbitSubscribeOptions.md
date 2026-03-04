# Interface: RabbitSubscribeOptions

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:164](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L164)

Message handler options for

## Rabbit Subscribe

decorator

## Extended by

- [`RabbitRPCOptions`](RabbitRPCOptions.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="allownonjsonmessages"></a> `allowNonJsonMessages?` | `boolean` | Whether to allow non-json messages | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:184](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L184) |
| <a id="errorhandler"></a> `errorHandler?` | (`error`, `message`) => `void` \| `Promise`\<`void`\> | Error handler | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:176](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L176) |
| <a id="exchange"></a> `exchange` | `string` | Exchange name | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:166](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L166) |
| <a id="exchangeoptions"></a> `exchangeOptions?` | \{ `arguments?`: `Record`\<`string`, `unknown`\> & \{ `x-delayed-type?`: `"direct"` \| `"topic"` \| `"fanout"` \| `"headers"`; \}; `autoDelete?`: `boolean`; `durable?`: `boolean`; `internal?`: `boolean`; \} | Exchange options (if exchange doesn't exist) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:174](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L174) |
| `exchangeOptions.arguments?` | `Record`\<`string`, `unknown`\> & \{ `x-delayed-type?`: `"direct"` \| `"topic"` \| `"fanout"` \| `"headers"`; \} | For x-delayed-message exchange: the underlying type | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:112](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L112) |
| `exchangeOptions.autoDelete?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L109) |
| `exchangeOptions.durable?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:108](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L108) |
| `exchangeOptions.internal?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:110](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L110) |
| <a id="queue"></a> `queue?` | `string` | Queue name (auto-generated if not provided) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:170](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L170) |
| <a id="queueoptions"></a> `queueOptions?` | \{ `arguments?`: `Record`\<`string`, `unknown`\>; `autoDelete?`: `boolean`; `durable?`: `boolean`; `exclusive?`: `boolean`; `maxLength?`: `number`; `maxLengthBytes?`: `number`; `messageTtl?`: `number`; \} | Queue options | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:172](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L172) |
| `queueOptions.arguments?` | `Record`\<`string`, `unknown`\> | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:143](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L143) |
| `queueOptions.autoDelete?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:141](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L141) |
| `queueOptions.durable?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:140](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L140) |
| `queueOptions.exclusive?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:142](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L142) |
| `queueOptions.maxLength?` | `number` | Maximum number of messages in queue | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:147](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L147) |
| `queueOptions.maxLengthBytes?` | `number` | Maximum queue size in bytes | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:149](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L149) |
| `queueOptions.messageTtl?` | `number` | Message TTL in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:145](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L145) |
| <a id="retry"></a> `retry?` | `boolean` | Enable message retry on failure | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:178](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L178) |
| <a id="retryattempts"></a> `retryAttempts?` | `number` | Number of retry attempts | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:180](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L180) |
| <a id="retrydelay"></a> `retryDelay?` | `number` | Retry delay in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:182](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L182) |
| <a id="routingkey"></a> `routingKey` | `string` \| `string`[] | Routing key pattern | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:168](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L168) |
