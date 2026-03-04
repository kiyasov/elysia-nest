# Interface: GraphQLSubscriptionTransportWsOptions

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:129](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L129)

Options for legacy subscriptions-transport-ws protocol.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="keepalive"></a> `keepAlive?` | `number` | Keep-alive interval in milliseconds. | [packages/apollo/src/interfaces/apollo-options.interface.ts:133](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L133) |
| <a id="onconnect"></a> `onConnect?` | (`connectionParams?`) => `unknown` | Callback when a client connects. | [packages/apollo/src/interfaces/apollo-options.interface.ts:135](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L135) |
| <a id="ondisconnect"></a> `onDisconnect?` | () => `void` | Callback when a client disconnects. | [packages/apollo/src/interfaces/apollo-options.interface.ts:137](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L137) |
| <a id="onoperation"></a> `onOperation?` | (`message`, `params`) => `unknown` | Callback for each operation. | [packages/apollo/src/interfaces/apollo-options.interface.ts:139](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L139) |
| <a id="path"></a> `path?` | `string` | WebSocket endpoint path. | [packages/apollo/src/interfaces/apollo-options.interface.ts:131](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L131) |
