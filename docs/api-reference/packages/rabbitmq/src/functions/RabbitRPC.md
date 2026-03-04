# Function: RabbitRPC()

```ts
function RabbitRPC(options): MethodDecorator;
```

Defined in: [packages/rabbitmq/src/decorators/rabbitmq.decorators.ts:77](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/decorators/rabbitmq.decorators.ts#L77)

Decorator for RabbitMQ RPC handlers

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RabbitRPCOptions`](../interfaces/RabbitRPCOptions.md) | RPC options |

## Returns

`MethodDecorator`

## Example

```typescript
@Injectable()
export class CalculatorService {
  @RabbitRPC({
    exchange: 'rpc',
    routingKey: 'calculator.add',
    queue: 'calculator-queue',
  })
  async add(data: { a: number; b: number }) {
    return { result: data.a + data.b };
  }
}
```
