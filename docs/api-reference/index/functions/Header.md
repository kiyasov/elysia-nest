# Function: Header()

```ts
function Header(name, value): MethodDecorator;
```

Defined in: [packages/core/src/decorators/header.decorator.ts:28](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/header.decorator.ts#L28)

Decorator that sets HTTP headers for the response.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The header name |
| `value` | `string` | The header value |

## Returns

`MethodDecorator`

## Example

```typescript
@Get()
@Header('Cache-Control', 'none')
getData() {
  return { data: [] };
}

@Post()
@Header('Location', '/resource/123')
create() {
  return { id: 123 };
}
```

## Public Api
