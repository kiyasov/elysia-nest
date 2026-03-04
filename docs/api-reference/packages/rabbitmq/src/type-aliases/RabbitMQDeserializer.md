# Type Alias: RabbitMQDeserializer()

```ts
type RabbitMQDeserializer = (message, msg) => unknown;
```

Defined in: [packages/rabbitmq/src/interfaces/rabbitmq.interface.ts:281](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/interfaces/rabbitmq.interface.ts#L281)

Deserializer function type for custom message deserialization

## Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `Buffer` |
| `msg` | `unknown` |

## Returns

`unknown`
