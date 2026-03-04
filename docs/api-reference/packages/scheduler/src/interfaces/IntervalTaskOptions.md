# Interface: IntervalTaskOptions

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L36)

Options for interval tasks

## Extends

- [`SchedulerTaskOptions`](SchedulerTaskOptions.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="executeoninit"></a> `executeOnInit?` | `boolean` | Whether to execute the task immediately upon registration | [`SchedulerTaskOptions`](SchedulerTaskOptions.md).[`executeOnInit`](SchedulerTaskOptions.md#executeoninit) | [packages/scheduler/src/interfaces/scheduler.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L15) |
| <a id="name"></a> `name?` | `string` | Task name for identification | [`SchedulerTaskOptions`](SchedulerTaskOptions.md).[`name`](SchedulerTaskOptions.md#name) | [packages/scheduler/src/interfaces/scheduler.interface.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L10) |
| <a id="stoponshutdown"></a> `stopOnShutdown?` | `boolean` | Whether to stop the interval when the application is shutting down | - | [packages/scheduler/src/interfaces/scheduler.interface.ts:40](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L40) |
| <a id="timeout"></a> `timeout?` | `number` | Timeout in milliseconds | [`SchedulerTaskOptions`](SchedulerTaskOptions.md).[`timeout`](SchedulerTaskOptions.md#timeout) | [packages/scheduler/src/interfaces/scheduler.interface.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L20) |
