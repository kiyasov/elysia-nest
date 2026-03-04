# Function: Catch()

```ts
function Catch(...exceptions): ClassDecorator;
```

Defined in: [packages/microservices/decorators/catch.decorator.ts:19](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/decorators/catch.decorator.ts#L19)

Marks an exception filter class and declares which exception types it handles.
Omitting arguments causes the filter to catch **all** exceptions.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`exceptions` | (...`args`) => `Error`[] | Exception constructors this filter should handle. |

## Returns

`ClassDecorator`

## Example

```typescript
@Catch(HttpException, ValidationException)
class MyFilter implements ExceptionFilter {
  catch(exception: Error, context: ExceptionContext) { ... }
}
```
