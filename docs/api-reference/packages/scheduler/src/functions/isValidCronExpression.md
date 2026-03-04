# Function: isValidCronExpression()

```ts
function isValidCronExpression(expression): boolean;
```

Defined in: [packages/scheduler/src/interfaces/cron.interface.ts:102](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/cron.interface.ts#L102)

Validates if a string is a valid cron expression
Supports 5-segment (minute hour day month day-of-week) and
6-segment (second minute hour day month day-of-week) formats

## Parameters

| Parameter | Type |
| ------ | ------ |
| `expression` | `string` |

## Returns

`boolean`
