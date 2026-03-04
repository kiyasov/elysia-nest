# Interface: RabbitMQExchangeConfig

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:101](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L101)

Exchange configuration

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="createifnotexists"></a> `createIfNotExists?` | `boolean` | Create exchange if it doesn't exist | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:117](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L117) |
| <a id="name"></a> `name` | `string` | Exchange name | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:103](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L103) |
| <a id="options"></a> `options?` | \{ `arguments?`: `Record`\<`string`, `unknown`\> & \{ `x-delayed-type?`: `"direct"` \| `"topic"` \| `"fanout"` \| `"headers"`; \}; `autoDelete?`: `boolean`; `durable?`: `boolean`; `internal?`: `boolean`; \} | Exchange options | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:107](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L107) |
| `options.arguments?` | `Record`\<`string`, `unknown`\> & \{ `x-delayed-type?`: `"direct"` \| `"topic"` \| `"fanout"` \| `"headers"`; \} | For x-delayed-message exchange: the underlying type | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:112](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L112) |
| `options.autoDelete?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L109) |
| `options.durable?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:108](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L108) |
| `options.internal?` | `boolean` | - | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:110](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L110) |
| <a id="type"></a> `type` | [`RabbitMQExchangeType`](../type-aliases/RabbitMQExchangeType.md) | Exchange type | [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:105](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L105) |
