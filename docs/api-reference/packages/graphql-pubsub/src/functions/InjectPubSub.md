# Function: InjectPubSub()

```ts
function InjectPubSub(): ParameterDecorator;
```

Defined in: [packages/graphql-pubsub/src/decorators/inject-pubsub.decorator.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/decorators/inject-pubsub.decorator.ts#L23)

Parameter decorator that injects the [RedisPubSub](../classes/RedisPubSub.md) instance
registered under the [GRAPHQL\_PUBSUB](../variables/GRAPHQL_PUBSUB.md) token.

Requires [GraphQLPubSubModule](../classes/GraphQLPubSubModule.md) (or its global variant) to be imported
in the application module.

## Returns

`ParameterDecorator`

## Example

```typescript
@Injectable()
class SubscriptionsService {
  constructor(@InjectPubSub() private readonly pubsub: RedisPubSub) {}

  publish(event: string, payload: unknown): Promise<void> {
    return this.pubsub.publish(event, payload);
  }
}
```
