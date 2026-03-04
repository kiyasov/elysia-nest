# Function: Controller()

```ts
function Controller(prefix?): ClassDecorator;
```

Defined in: [packages/core/src/decorators/controller.decorator.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/controller.decorator.ts#L21)

Controller decorator that defines a controller with a route prefix.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `prefix` | `string` | `""` | The route prefix for all controller routes |

## Returns

`ClassDecorator`

## Example

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return [];
  }
}
```
