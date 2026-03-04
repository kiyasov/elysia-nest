# Interface: GraphQLWsSubscriptionsOptions

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:91](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L91)

Options for GraphQL WebSocket subscriptions (graphql-ws protocol).

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="connectioninitwaittimeout"></a> `connectionInitWaitTimeout?` | `number` | Timeout for connection initialization in milliseconds. | [packages/apollo/src/interfaces/apollo-options.interface.ts:95](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L95) |
| <a id="onclose"></a> `onClose?` | (`context`) => `void` \| `Promise`\<`void`\> | Callback when a connection closes. | [packages/apollo/src/interfaces/apollo-options.interface.ts:107](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L107) |
| <a id="onconnect"></a> `onConnect?` | (`context`) => \| `boolean` \| `void` \| `Record`\<`string`, `unknown`\> \| `Promise`\<`boolean` \| `void` \| `Record`\<`string`, `unknown`\>\> | Callback when a client connects. | [packages/apollo/src/interfaces/apollo-options.interface.ts:97](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L97) |
| <a id="ondisconnect"></a> `onDisconnect?` | (`context`) => `void` \| `Promise`\<`void`\> | Callback when a client disconnects. | [packages/apollo/src/interfaces/apollo-options.interface.ts:105](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L105) |
| <a id="onnext"></a> `onNext?` | (`context`, `id`, `payload`, `args`, `result`) => `void` \| `Promise`\<`void`\> | Callback when a subscription emits a value. | [packages/apollo/src/interfaces/apollo-options.interface.ts:119](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L119) |
| <a id="onsubscribe"></a> `onSubscribe?` | (`context`, `id`, `payload`) => \| `void` \| `ExecutionArgs` \| readonly `GraphQLError`[] \| `Promise`\<`void` \| `ExecutionArgs` \| readonly `GraphQLError`[]\> | Callback when a subscription is created. | [packages/apollo/src/interfaces/apollo-options.interface.ts:109](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L109) |
| <a id="path"></a> `path?` | `string` | WebSocket endpoint path. | [packages/apollo/src/interfaces/apollo-options.interface.ts:93](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L93) |
