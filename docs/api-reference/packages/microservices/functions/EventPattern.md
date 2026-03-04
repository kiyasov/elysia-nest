# Function: EventPattern()

```ts
function EventPattern(pattern, transport?): MethodDecorator;
```

Defined in: [packages/microservices/decorators/event-pattern.decorator.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/decorators/event-pattern.decorator.ts#L23)

Marks a controller method as a **fire-and-forget** event handler.
The method is called when a publisher emits an event matching `pattern`.
No response is sent back to the publisher.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pattern` | `string` \| `Record`\<`string`, `unknown`\> | String or object that identifies this event. |
| `transport?` | `symbol` \| [`Transport`](../enumerations/Transport.md) | Optional transport override. |

## Returns

`MethodDecorator`

## Example

```typescript
@EventPattern('user.created')
handleUserCreated(@Payload() data: CreateUserDto): void {
  this.usersService.create(data);
}
```
