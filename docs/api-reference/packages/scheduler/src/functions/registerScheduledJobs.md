# Function: registerScheduledJobs()

```ts
function registerScheduledJobs(instance): TaskHandle[];
```

Defined in: [packages/scheduler/src/utils/scheduler.utils.ts:42](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/utils/scheduler.utils.ts#L42)

Scans `instance` for methods decorated with [Cron](Cron.md), [Interval](Interval.md),
[Timeout](Timeout.md), or [ScheduleAt](ScheduleAt.md) and registers them with the global
[Scheduler](../classes/Scheduler.md).

Called automatically by the DI container after a provider is instantiated.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `instance` | `unknown` |

## Returns

[`TaskHandle`](../interfaces/TaskHandle.md)[]

The [TaskHandle](../interfaces/TaskHandle.md) array for every successfully registered job.
