# Function: HttpCode()

```ts
function HttpCode(statusCode): MethodDecorator;
```

Defined in: [packages/core/src/decorators/http-code.decorator.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/http-code.decorator.ts#L27)

Decorator that sets the HTTP status code for the response.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `statusCode` | `number` | The HTTP status code to return. |

## Returns

`MethodDecorator`

## Example

```typescript
@Post()
@HttpCode(201)
create() {
  return 'Created successfully';
}

@Get('not-found')
@HttpCode(404)
notFound() {
  return 'Resource not found';
}
```

## Public Api
