# Function: Subscription()

```ts
function Subscription(typeFn?, options?): MethodDecorator;
```

Defined in: [packages/apollo/src/decorators/subscription.decorator.ts:82](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L82)

Decorator for a GraphQL Subscription.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeFn?` | \| `string` \| () => `unknown` \| [`SubscriptionOptions`](../interfaces/SubscriptionOptions.md) | Return type factory, options object, or subscription name. |
| `options?` | [`SubscriptionOptions`](../interfaces/SubscriptionOptions.md) | Subscription options when typeFn is a function. |

## Returns

`MethodDecorator`

## Example

```typescript
@Subscription()
async userCreated() {
  return pubSub.asyncIterator('userCreated');
}

@Subscription(() => User)
async userCreated() {
  return pubSub.asyncIterator('userCreated');
}

@Subscription('userUpdated')
async onUserUpdated() {
  return pubSub.asyncIterator('userUpdated');
}

@Subscription({
  name: 'messageAdded',
  subscribe: () => pubSub.asyncIterator('messageAdded'),
  resolve: (payload) => payload.message
})
async onMessageAdded() {}
```
