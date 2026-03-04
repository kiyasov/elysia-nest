# Function: Payload()

```ts
function Payload(property?): ParameterDecorator;
```

Defined in: [packages/microservices/decorators/payload.decorator.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/decorators/payload.decorator.ts#L22)

Extracts the message payload (or a nested property of it) and injects it
as a method parameter.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `property?` | `string` | When provided, only the named property of the payload is injected. |

## Returns

`ParameterDecorator`

## Example

```typescript
// Inject the full payload
@MessagePattern('sum')
sum(@Payload() data: number[]) { ... }

// Inject a specific property
@MessagePattern('login')
login(@Payload('username') username: string) { ... }
```
