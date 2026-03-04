# Interface: RabbitMQOptions

Defined in: [packages/microservices/interfaces/microservice.interface.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L29)

Connection options for the RabbitMQ (amqplib) transport.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="exchange"></a> `exchange?` | `string` | Exchange name to publish to / consume from. | [packages/microservices/interfaces/microservice.interface.ts:48](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L48) |
| <a id="exchangetype"></a> `exchangeType?` | `"direct"` \| `"topic"` \| `"fanout"` \| `"headers"` | Exchange type. Defaults to `"topic"`. | [packages/microservices/interfaces/microservice.interface.ts:50](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L50) |
| <a id="noack"></a> `noAck?` | `boolean` | When `true`, messages are auto-acknowledged (no manual ack/nack). | [packages/microservices/interfaces/microservice.interface.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L44) |
| <a id="persistent"></a> `persistent?` | `boolean` | When `true`, published messages are marked as persistent. | [packages/microservices/interfaces/microservice.interface.ts:46](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L46) |
| <a id="prefetchcount"></a> `prefetchCount?` | `number` | Number of messages to prefetch per consumer. | [packages/microservices/interfaces/microservice.interface.ts:42](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L42) |
| <a id="queue"></a> `queue` | `string` | Name of the queue to consume from. | [packages/microservices/interfaces/microservice.interface.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L33) |
| <a id="queueoptions"></a> `queueOptions?` | \{ `arguments?`: `Record`\<`string`, `unknown`\>; `autoDelete?`: `boolean`; `durable?`: `boolean`; `exclusive?`: `boolean`; \} | Optional queue-declaration parameters. | [packages/microservices/interfaces/microservice.interface.ts:35](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L35) |
| `queueOptions.arguments?` | `Record`\<`string`, `unknown`\> | - | [packages/microservices/interfaces/microservice.interface.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L39) |
| `queueOptions.autoDelete?` | `boolean` | - | [packages/microservices/interfaces/microservice.interface.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L38) |
| `queueOptions.durable?` | `boolean` | - | [packages/microservices/interfaces/microservice.interface.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L36) |
| `queueOptions.exclusive?` | `boolean` | - | [packages/microservices/interfaces/microservice.interface.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L37) |
| <a id="routingkey"></a> `routingKey?` | `string` | Routing key used when binding queue to exchange or publishing messages. | [packages/microservices/interfaces/microservice.interface.ts:52](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L52) |
| <a id="urls"></a> `urls` | `string`[] | AMQP URLs to try in order (e.g. `["amqp://localhost"]`). | [packages/microservices/interfaces/microservice.interface.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L31) |
