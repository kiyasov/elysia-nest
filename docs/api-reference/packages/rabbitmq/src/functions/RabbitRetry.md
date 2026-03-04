# Function: RabbitRetry()

```ts
function RabbitRetry(attempts, delay): MethodDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:191](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L191)

Decorator to configure retry behavior for a specific handler

## Parameters

| Parameter | Type |
| ------ | ------ |
| `attempts` | `number` |
| `delay` | `number` |

## Returns

`MethodDecorator`
