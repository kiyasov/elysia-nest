# Interface: RabbitMQConfig

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:47](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L47)

RabbitMQ connection configuration

## Extended by

- [`RabbitMQModuleOptions`](RabbitMQModuleOptions.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="channels"></a> `channels?` | `Record`\<`string`, [`RabbitMQChannelConfig`](RabbitMQChannelConfig.md)\> | Channel configurations | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:71](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L71) |
| <a id="connectioninitoptions"></a> `connectionInitOptions?` | [`ConnectionInitOptions`](ConnectionInitOptions.md) | Connection initialization options | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:79](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L79) |
| <a id="defaultrpcerrorbehavior"></a> `defaultRpcErrorBehavior?` | [`MessageHandlerErrorBehavior`](../type-aliases/MessageHandlerErrorBehavior.md) | Default error behavior for RPC handlers | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:73](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L73) |
| <a id="defaultrpctimeout"></a> `defaultRpcTimeout?` | `number` | Default RPC timeout in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:77](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L77) |
| <a id="defaultsubscribeerrorbehavior"></a> `defaultSubscribeErrorBehavior?` | [`MessageHandlerErrorBehavior`](../type-aliases/MessageHandlerErrorBehavior.md) | Default error behavior for subscribe handlers | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:75](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L75) |
| <a id="enablecontrollerdiscovery"></a> `enableControllerDiscovery?` | `boolean` | Enable controller discovery | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:83](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L83) |
| <a id="exchangeprefix"></a> `exchangePrefix?` | `string` | Exchange prefix for all exchanges | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:55](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L55) |
| <a id="exchanges"></a> `exchanges?` | [`RabbitMQExchangeConfig`](RabbitMQExchangeConfig.md)[] | Exchanges to assert on connection | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:67](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L67) |
| <a id="maxmessagesize"></a> `maxMessageSize?` | `number` | Maximum message size in bytes (default: 10MB) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:85](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L85) |
| <a id="prefetchcount"></a> `prefetchCount?` | `number` | Prefetch count (number of messages processed concurrently) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:59](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L59) |
| <a id="queueprefix"></a> `queuePrefix?` | `string` | Queue prefix for all queues | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:53](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L53) |
| <a id="queues"></a> `queues?` | [`RabbitMQQueueConfig`](RabbitMQQueueConfig.md)[] | Queues to assert on connection | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:69](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L69) |
| <a id="reconnect"></a> `reconnect?` | `boolean` | Enable automatic reconnection | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:61](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L61) |
| <a id="reconnectattempts"></a> `reconnectAttempts?` | `number` | Reconnection attempts | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:63](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L63) |
| <a id="reconnectinterval"></a> `reconnectInterval?` | `number` | Reconnection interval in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L65) |
| <a id="registerhandlers"></a> `registerHandlers?` | `boolean` | Register handlers automatically | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:81](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L81) |
| <a id="timeout"></a> `timeout?` | `number` | Connection timeout in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:57](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L57) |
| <a id="uri"></a> `uri?` | `string` | RabbitMQ URL (amqp://user:pass@host:port) - single connection | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:49](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L49) |
| <a id="urls"></a> `urls?` | `string`[] | RabbitMQ URLs (amqp://user:pass@host:port) - multiple connections for failover | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L51) |
