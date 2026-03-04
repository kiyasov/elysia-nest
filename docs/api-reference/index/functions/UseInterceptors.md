# Function: UseInterceptors()

```ts
function UseInterceptors(...interceptors): MethodDecorator & ClassDecorator;
```

Defined in: [packages/core/src/interceptors/use-interceptors.decorator.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interceptors/use-interceptors.decorator.ts#L14)

Decorator that binds interceptors to the scope of the controller or method,
depending on its context.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`interceptors` | (...`args`) => `unknown`[] | A single interceptor instance or class, or an array of interceptor instances or classes. |

## Returns

`MethodDecorator` & `ClassDecorator`

## Public Api
