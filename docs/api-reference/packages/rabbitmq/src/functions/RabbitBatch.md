# Function: RabbitBatch()

```ts
function RabbitBatch(batchSize, flushTimeout?): MethodDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:209](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L209)

Decorator to mark a method for batch processing

## Parameters

| Parameter | Type |
| ------ | ------ |
| `batchSize` | `number` |
| `flushTimeout?` | `number` |

## Returns

`MethodDecorator`
