# Type Alias: SubscriptionConfig

```ts
type SubscriptionConfig = {
  graphql-ws?:   | GraphQLWsSubscriptionsOptions
     | boolean;
  subscriptions-transport-ws?:   | GraphQLSubscriptionTransportWsOptions
     | boolean;
};
```

Defined in: [packages/apollo/src/interfaces/apollo-options.interface.ts:143](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L143)

Subscription configuration supporting multiple protocols.

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="graphql-ws"></a> `graphql-ws?` | \| [`GraphQLWsSubscriptionsOptions`](../interfaces/GraphQLWsSubscriptionsOptions.md) \| `boolean` | [packages/apollo/src/interfaces/apollo-options.interface.ts:144](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L144) |
| <a id="subscriptions-transport-ws"></a> `subscriptions-transport-ws?` | \| [`GraphQLSubscriptionTransportWsOptions`](../interfaces/GraphQLSubscriptionTransportWsOptions.md) \| `boolean` | [packages/apollo/src/interfaces/apollo-options.interface.ts:145](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/interfaces/apollo-options.interface.ts#L145) |
