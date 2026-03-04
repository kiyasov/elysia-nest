# Interface: ApolloContext

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:187](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L187)

Elysia-specific GraphQL request context.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="elysiacontext"></a> `elysiaContext` | `unknown` | Original Elysia context. | [packages/apollo/src/interfaces/apollo-options.interface.ts:197](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L197) |
| <a id="params"></a> `params` | `Record`\<`string`, `string`\> | Route parameters. | [packages/apollo/src/interfaces/apollo-options.interface.ts:193](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L193) |
| <a id="request"></a> `request` | `Request` | HTTP request object. | [packages/apollo/src/interfaces/apollo-options.interface.ts:189](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L189) |
| <a id="response"></a> `response` | `Response` | HTTP response object. | [packages/apollo/src/interfaces/apollo-options.interface.ts:191](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L191) |
| <a id="store"></a> `store` | `Record`\<`string`, `unknown`\> | Elysia store. | [packages/apollo/src/interfaces/apollo-options.interface.ts:195](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L195) |
