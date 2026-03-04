# Interface: TcpOptions

Defined in: [packages/microservices/interfaces/microservice.interface.ts:56](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L56)

Connection options for the TCP transport.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="host"></a> `host?` | `string` | Hostname to bind/connect. Defaults to `"0.0.0.0"` for server, `"localhost"` for client. | [packages/microservices/interfaces/microservice.interface.ts:58](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L58) |
| <a id="port"></a> `port?` | `number` | TCP port. Defaults to `3000`. | [packages/microservices/interfaces/microservice.interface.ts:60](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L60) |
| <a id="retryattempts"></a> `retryAttempts?` | `number` | Maximum reconnection attempts (client only). Defaults to `3`. | [packages/microservices/interfaces/microservice.interface.ts:62](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L62) |
| <a id="retrydelay"></a> `retryDelay?` | `number` | Delay in milliseconds between reconnection attempts. Defaults to `1000`. | [packages/microservices/interfaces/microservice.interface.ts:64](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L64) |
