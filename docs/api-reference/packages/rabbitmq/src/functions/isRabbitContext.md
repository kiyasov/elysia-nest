# Function: isRabbitContext()

```ts
function isRabbitContext(contextType): boolean;
```

Defined in: [packages/rabbitmq/src/rabbitmq.constants.ts:29](https://github.com/kiyasov/elysia-nest/blob/main/packages/rabbitmq/src/rabbitmq.constants.ts#L29)

Check if the current execution context is a RabbitMQ context
Useful for guards and interceptors that need to handle RabbitMQ differently

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `contextType` | `string` | The context type from ExecutionContext |

## Returns

`boolean`

true if the context is RabbitMQ

## Example

```typescript
@Injectable()
class MyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (isRabbitContext(context.getType())) {
      // Handle RabbitMQ context
      return true;
    }
    // Handle HTTP/WS context
    return true;
  }
}
```
