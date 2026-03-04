# Function: MessageCtx()

```ts
function MessageCtx(): ParameterDecorator;
```

Defined in: [packages/microservices/decorators/ctx.decorator.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/decorators/ctx.decorator.ts#L17)

Injects the microservice execution context into a method parameter.
The context contains transport information and the matched pattern.

## Returns

`ParameterDecorator`

## Example

```typescript
@MessagePattern('greet')
greet(@Payload() data: unknown, @MessageCtx() ctx: Record<string, unknown>) {
  console.log(ctx.transport); // e.g. "redis"
}
```
