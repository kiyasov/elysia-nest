# Function: RabbitPayload()

```ts
function RabbitPayload(): ParameterDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:326](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L326)

Parameter decorator to extract the message payload
In @@kiyasov/elysia-nest/rabbitmq this extracts the actual message content

## Returns

`ParameterDecorator`

## Example

```typescript
@RabbitSubscribe({
  exchange: 'orders',
  routingKey: 'order.created',
  queue: 'orders-queue',
})
async handleOrder(@RabbitPayload() data: OrderData) {
  console.log('Order:', data);
}
```
