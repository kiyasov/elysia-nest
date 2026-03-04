# Function: UseGuards()

```ts
function UseGuards(...guards): MethodDecorator & ClassDecorator;
```

Defined in: [packages/core/src/guards/use-guards.decorator.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/guards/use-guards.decorator.ts#L14)

Decorator that binds guards to the scope of the controller or method,
depending on its context.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`guards` | (...`args`) => `unknown`[] | A single guard instance or class, or an array of guard instances or classes. |

## Returns

`MethodDecorator` & `ClassDecorator`

## Public Api
