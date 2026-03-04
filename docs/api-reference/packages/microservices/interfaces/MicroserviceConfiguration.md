# Interface: MicroserviceConfiguration

Defined in: [packages/microservices/interfaces/microservice.interface.ts:5](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L5)

Base configuration shared by all built-in transport strategies.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="options"></a> `options` | \| [`RedisOptions`](RedisOptions.md) \| [`RabbitMQOptions`](RabbitMQOptions.md) \| [`TcpOptions`](TcpOptions.md) | [packages/microservices/interfaces/microservice.interface.ts:7](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L7) |
| <a id="transport"></a> `transport` | [`Transport`](../enumerations/Transport.md) | [packages/microservices/interfaces/microservice.interface.ts:6](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L6) |
