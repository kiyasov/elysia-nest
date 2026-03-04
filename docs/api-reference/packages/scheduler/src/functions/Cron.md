# Function: Cron()

```ts
function Cron(cronExpression, options?): MethodDecorator;
```

Defined in: [packages/scheduler/src/decorators/scheduler.decorators.ts:51](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/decorators/scheduler.decorators.ts#L51)

Decorator for cron jobs

## Parameters

| Parameter | Type |
| ------ | ------ |
| `cronExpression` | `string` \| [`CronExpression`](../interfaces/CronExpression.md) |
| `options?` | [`CronTaskOptions`](../interfaces/CronTaskOptions.md) |

## Returns

`MethodDecorator`
