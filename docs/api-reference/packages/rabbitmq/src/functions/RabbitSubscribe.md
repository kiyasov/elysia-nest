# Function: RabbitSubscribe()

```ts
function RabbitSubscribe(options): MethodDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:32](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L32)

Decorator to subscribe to RabbitMQ messages

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RabbitSubscribeOptions`](../interfaces/RabbitSubscribeOptions.md) | Subscription options |

## Returns

`MethodDecorator`

## Example

```typescript
@Injectable()
export class OrdersService {
  @RabbitSubscribe({
    exchange: 'orders',
    routingKey: 'order.created',
    queue: 'orders-queue',
  })
  async handleOrderCreated(message: RabbitMQMessage<Order>) {
    console.log('Order created:', message.content);
    message.ack();
  }
}
```
