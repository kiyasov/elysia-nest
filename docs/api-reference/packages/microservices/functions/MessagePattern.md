# Function: MessagePattern()

```ts
function MessagePattern(pattern, transport?): MethodDecorator;
```

Defined in: [packages/microservices/decorators/message-pattern.decorator.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/decorators/message-pattern.decorator.ts#L23)

Marks a controller method as a **request-response** message handler.
The method is called when a client sends a message matching `pattern`
and it is expected to return a response.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern` | `string` \| `Record`\<`string`, `unknown`\> | String or object that identifies this handler. |
| `transport?` | `symbol` \| [`Transport`](../enumerations/Transport.md) | Optional transport override; defaults to the server's transport. |

## Returns

`MethodDecorator`

## Example

```typescript
@MessagePattern('sum')
accumulate(@Payload() data: number[]): number {
  return data.reduce((a, b) => a + b, 0);
}
```
