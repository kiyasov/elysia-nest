# Function: RabbitConnection()

```ts
function RabbitConnection(connectionName): ClassDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:301](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L301)

Decorator for connection-aware handlers
Useful when using multiple RabbitMQ connections

## Parameters

| Parameter | Type |
| ------ | ------ |
| `connectionName` | `string` |

## Returns

`ClassDecorator`
