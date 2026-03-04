# Function: RabbitDLQ()

```ts
function RabbitDLQ(exchange, routingKey): MethodDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:230](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L230)

Decorator to configure dead letter queue behavior

## Parameters

| Parameter | Type |
| ------ | ------ |
| `exchange` | `string` |
| `routingKey` | `string` |

## Returns

`MethodDecorator`
