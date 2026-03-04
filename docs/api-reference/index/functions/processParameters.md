# Function: processParameters()

```ts
function processParameters(
   ctx, 
   target, 
propertyKey): Promise<unknown[]>;
```

Defined in: [packages/core/src/decorators/param.decorators.ts:200](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L200)

Extract and validate parameters based on metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ctx` | `ElysiaContext` | Elysia context |
| `target` | `object` | Controller class |
| `propertyKey` | `string` \| `symbol` | Route handler method name |

## Returns

`Promise`\<`unknown`[]\>

Array of processed parameters or error object
