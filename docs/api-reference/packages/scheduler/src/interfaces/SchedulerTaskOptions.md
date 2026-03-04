# Interface: SchedulerTaskOptions

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:6](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L6)

Task options for scheduled tasks

## Extended by

- [`CronTaskOptions`](CronTaskOptions.md)
- [`IntervalTaskOptions`](IntervalTaskOptions.md)
- [`TimeoutTaskOptions`](TimeoutTaskOptions.md)

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="executeoninit"></a> `executeOnInit?` | `boolean` | Whether to execute the task immediately upon registration | [packages/scheduler/src/interfaces/scheduler.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L15) |
| <a id="name"></a> `name?` | `string` | Task name for identification | [packages/scheduler/src/interfaces/scheduler.interface.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L10) |
| <a id="timeout"></a> `timeout?` | `number` | Timeout in milliseconds | [packages/scheduler/src/interfaces/scheduler.interface.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L20) |
