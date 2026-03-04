# Function: Client()

```ts
function Client(config): PropertyDecorator;
```

Defined in: [packages/microservices/decorators/client.decorator.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/decorators/client.decorator.ts#L21)

Marks a class property for automatic [ClientProxy](../classes/ClientProxy.md) injection.
The injected client is created using `config` and is ready to use after
the application starts.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`MicroserviceConfiguration`](../interfaces/MicroserviceConfiguration.md) | Transport configuration for the client to connect to. |

## Returns

`PropertyDecorator`

## Example

```typescript
class AppController {
  @Client({ transport: Transport.REDIS, options: { host: 'localhost' } })
  private client: ClientProxy;
}
```
