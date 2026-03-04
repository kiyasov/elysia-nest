# Interface: RequestOptions\<T\>

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:258](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L258)

RPC Request options for AmqpConnection.request()

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="correlationid"></a> `correlationId?` | `string` | Custom correlation ID (auto-generated if not provided) | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:270](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L270) |
| <a id="exchange"></a> `exchange` | `string` | Exchange to publish to | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:260](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L260) |
| <a id="headers"></a> `headers?` | `Record`\<`string`, `unknown`\> | Custom headers | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:268](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L268) |
| <a id="payload"></a> `payload` | `T` | Payload to send | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:264](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L264) |
| <a id="routingkey"></a> `routingKey` | `string` | Routing key | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:262](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L262) |
| <a id="timeout"></a> `timeout?` | `number` | Request timeout in milliseconds | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:266](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L266) |
