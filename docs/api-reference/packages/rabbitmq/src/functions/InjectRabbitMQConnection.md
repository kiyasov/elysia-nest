# Function: InjectRabbitMQConnection()

```ts
function InjectRabbitMQConnection(connectionName): ParameterDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:132](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L132)

Inject RabbitMQ connection name
Useful when multiple connections are configured

## Parameters

| Parameter | Type |
| ------ | ------ |
| `connectionName` | `string` |

## Returns

`ParameterDecorator`
