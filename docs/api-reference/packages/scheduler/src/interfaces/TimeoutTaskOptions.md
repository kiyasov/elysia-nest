# Interface: TimeoutTaskOptions

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:46](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L46)

Options for timeout tasks

## Extends

- [`SchedulerTaskOptions`](SchedulerTaskOptions.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="cancelonshutdown"></a> `cancelOnShutdown?` | `boolean` | Whether to cancel the timeout when the application is shutting down | - | [packages/scheduler/src/interfaces/scheduler.interface.ts:50](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L50) |
| <a id="executeoninit"></a> `executeOnInit?` | `boolean` | Whether to execute the task immediately upon registration | [`SchedulerTaskOptions`](SchedulerTaskOptions.md).[`executeOnInit`](SchedulerTaskOptions.md#executeoninit) | [packages/scheduler/src/interfaces/scheduler.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L15) |
| <a id="name"></a> `name?` | `string` | Task name for identification | [`SchedulerTaskOptions`](SchedulerTaskOptions.md).[`name`](SchedulerTaskOptions.md#name) | [packages/scheduler/src/interfaces/scheduler.interface.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L10) |
| <a id="timeout"></a> `timeout?` | `number` | Timeout in milliseconds | [`SchedulerTaskOptions`](SchedulerTaskOptions.md).[`timeout`](SchedulerTaskOptions.md#timeout) | [packages/scheduler/src/interfaces/scheduler.interface.ts:20](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L20) |
