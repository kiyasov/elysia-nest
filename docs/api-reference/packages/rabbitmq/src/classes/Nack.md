# Class: Nack

Defined in: [packages/rabbitmq/src/nack.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/nack.ts#L22)

Nack (Negative Acknowledgment) class for RabbitMQ message handling
Used in

## Rabbit Subscribe

and

## Rabbit RPC

handlers to reject messages

## Example

```typescript
@RabbitSubscribe({
  exchange: 'orders',
  routingKey: 'order.created',
  queue: 'orders-queue',
})
async handleOrder(message: OrderMessage) {
  try {
    await processOrder(message);
  } catch (error) {
    // Requeue the message for retry
    throw new Nack(true);
  }
}
```

## Constructors

### Constructor

```ts
new Nack(requeue?): Nack;
```

Defined in: [packages/rabbitmq/src/nack.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/nack.ts#L27)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `requeue` | `boolean` | `false` | If true, the message will be requeued and redelivered. If false (default), the message will be discarded or sent to DLQ. |

#### Returns

`Nack`

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="requeue"></a> `requeue` | `readonly` | `boolean` | `false` | If true, the message will be requeued and redelivered. If false (default), the message will be discarded or sent to DLQ. | [packages/rabbitmq/src/nack.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/nack.ts#L27) |
