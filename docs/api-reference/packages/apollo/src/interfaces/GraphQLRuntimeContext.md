# Interface: GraphQLRuntimeContext

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L31)

Runtime context for GraphQL operations.

## Indexable

```ts
[key: string]: unknown
```

Additional context properties.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="connectionparams"></a> `connectionParams?` | `Record`\<`string`, `unknown`\> | WebSocket connection parameters. | [packages/apollo/src/interfaces/apollo-options.interface.ts:43](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L43) |
| <a id="extra"></a> `extra?` | \{ `socket?`: `unknown`; \} | Extra data including WebSocket socket reference. | [packages/apollo/src/interfaces/apollo-options.interface.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L33) |
| `extra.socket?` | `unknown` | - | [packages/apollo/src/interfaces/apollo-options.interface.ts:34](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L34) |
| <a id="headers"></a> `headers?` | `Record`\<`string`, `string` \| `undefined`\> | HTTP headers. | [packages/apollo/src/interfaces/apollo-options.interface.ts:41](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L41) |
| <a id="req"></a> `req?` | `Request` | HTTP request object. | [packages/apollo/src/interfaces/apollo-options.interface.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L37) |
| <a id="request"></a> `request?` | `Request` | HTTP request object (alias). | [packages/apollo/src/interfaces/apollo-options.interface.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L39) |
