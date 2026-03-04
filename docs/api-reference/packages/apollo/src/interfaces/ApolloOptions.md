# Interface: ApolloOptions\<TContext\>

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:151](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L151)

Options for configuring the GraphQL / Apollo module.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` | `unknown` |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="autoschemafile"></a> `autoSchemaFile?` | `string` \| `boolean` | When `true`, generates schema from code-first decorators in memory. When a string path is provided, also writes the SDL to that file. | [packages/apollo/src/interfaces/apollo-options.interface.ts:177](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L177) |
| <a id="buildschemaoptions"></a> `buildSchemaOptions?` | [`BuildSchemaOptions`](BuildSchemaOptions.md) | Additional options used while building code-first schema. | [packages/apollo/src/interfaces/apollo-options.interface.ts:179](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L179) |
| <a id="context"></a> `context?` | (`context`) => `TContext` \| `Promise`\<`TContext`\> | Context factory called for every request. | [packages/apollo/src/interfaces/apollo-options.interface.ts:161](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L161) |
| <a id="formaterror"></a> `formatError?` | (`formattedError`, `error`) => `GraphQLFormattedError` | Custom error formatter. | [packages/apollo/src/interfaces/apollo-options.interface.ts:165](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L165) |
| <a id="path"></a> `path?` | `string` | GraphQL endpoint path. **Default** `'/graphql'` | [packages/apollo/src/interfaces/apollo-options.interface.ts:153](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L153) |
| <a id="playground"></a> `playground?` | `boolean` | Enable Apollo Studio Sandbox landing page. **Default** `true in development` | [packages/apollo/src/interfaces/apollo-options.interface.ts:163](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L163) |
| <a id="plugins"></a> `plugins?` | `ApolloServerPlugin`\<`BaseContext`\>[] | Additional Apollo Server plugins. | [packages/apollo/src/interfaces/apollo-options.interface.ts:183](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L183) |
| <a id="resolvers"></a> `resolvers?` | `Record`\<`string`, `unknown`\> \| `Record`\<`string`, `unknown`\>[] | Resolver map. Used together with `typeDefs`. | [packages/apollo/src/interfaces/apollo-options.interface.ts:159](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L159) |
| <a id="schema"></a> `schema?` | [`GraphQLSchema`](../classes/GraphQLSchema.md) | Pre-built GraphQL schema. Mutually exclusive with `autoSchemaFile`. | [packages/apollo/src/interfaces/apollo-options.interface.ts:155](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L155) |
| <a id="sortschema"></a> `sortSchema?` | `boolean` | Sort schema fields alphabetically. | [packages/apollo/src/interfaces/apollo-options.interface.ts:181](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L181) |
| <a id="subscriptions"></a> `subscriptions?` | `boolean` \| [`SubscriptionConfig`](../type-aliases/SubscriptionConfig.md) | Enable WebSocket subscriptions or pass graphql-ws options. | [packages/apollo/src/interfaces/apollo-options.interface.ts:170](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L170) |
| <a id="subscriptionspath"></a> `subscriptionsPath?` | `string` | WebSocket endpoint for subscriptions. | [packages/apollo/src/interfaces/apollo-options.interface.ts:172](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L172) |
| <a id="typedefs"></a> `typeDefs?` | `string` \| `string`[] | SDL type definitions. Used together with `resolvers`. | [packages/apollo/src/interfaces/apollo-options.interface.ts:157](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L157) |
