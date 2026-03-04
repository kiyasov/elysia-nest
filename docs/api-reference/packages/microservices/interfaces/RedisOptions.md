# Interface: RedisOptions

Defined in: [packages/microservices/interfaces/microservice.interface.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L11)

Connection options for the Redis (ioredis) transport.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="db"></a> `db?` | `number` | Redis database index. Defaults to `0`. | [packages/microservices/interfaces/microservice.interface.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L19) |
| <a id="host"></a> `host?` | `string` | Redis hostname. Defaults to `"localhost"`. | [packages/microservices/interfaces/microservice.interface.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L13) |
| <a id="password"></a> `password?` | `string` | Optional password for Redis AUTH. | [packages/microservices/interfaces/microservice.interface.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L17) |
| <a id="port"></a> `port?` | `number` | Redis port. Defaults to `6379`. | [packages/microservices/interfaces/microservice.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L15) |
| <a id="retryattempts"></a> `retryAttempts?` | `number` | Maximum number of reconnection attempts. Defaults to `3`. | [packages/microservices/interfaces/microservice.interface.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L23) |
| <a id="retrydelay"></a> `retryDelay?` | `number` | Delay in milliseconds between reconnection attempts. Defaults to `1000`. | [packages/microservices/interfaces/microservice.interface.ts:25](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L25) |
| <a id="url"></a> `url?` | `string` | Full Redis connection URL (overrides host/port when provided). | [packages/microservices/interfaces/microservice.interface.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L21) |
