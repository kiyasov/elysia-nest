# Function: Catch()

```ts
function Catch(...exceptions): ClassDecorator;
```

Defined in: [packages/core/src/exceptions/catch.decorator.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/exceptions/catch.decorator.ts#L33)

Decorator that marks a class as an exception filter.
The decorated class must implement the `ExceptionFilter` interface.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`exceptions` | (...`args`) => `Error`[] | one or more exception types specifying the exceptions to be caught and handled by this filter. |

## Returns

`ClassDecorator`

## Example

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, context: ExceptionContext) {
    return {
      statusCode: exception.getStatus(),
      message: exception.message,
    };
  }
}
```
