# Interface: MicroserviceExceptionContext

Defined in: [packages/microservices/elysia-nest-application.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L31)

Contextual information passed to exception filters when an error occurs
inside a microservice message or event handler.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="data"></a> `data` | `unknown` | [packages/microservices/elysia-nest-application.ts:34](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L34) |
| <a id="method"></a> `method?` | `string` | [packages/microservices/elysia-nest-application.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L39) |
| <a id="path"></a> `path?` | `string` | [packages/microservices/elysia-nest-application.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L38) |
| <a id="pattern"></a> `pattern` | `string` \| `Record`\<`string`, `unknown`\> | [packages/microservices/elysia-nest-application.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L32) |
| <a id="request"></a> `request?` | `unknown` | [packages/microservices/elysia-nest-application.ts:35](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L35) |
| <a id="response"></a> `response?` | `unknown` | [packages/microservices/elysia-nest-application.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L36) |
| <a id="set"></a> `set?` | `unknown` | [packages/microservices/elysia-nest-application.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L37) |
| <a id="transport"></a> `transport` | `string` | [packages/microservices/elysia-nest-application.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/elysia-nest-application.ts#L33) |
