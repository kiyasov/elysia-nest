# Class: Scheduler

Defined in: [packages/scheduler/src/services/scheduler.service.ts:27](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L27)

Service for scheduling tasks

## Implements

- [`IScheduler`](../interfaces/IScheduler.md)
- [`OnModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md)

## Constructors

### Constructor

```ts
new Scheduler(config?): Scheduler;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:46](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L46)

Create a new scheduler

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`SchedulerConfig`](../interfaces/SchedulerConfig.md) |

#### Returns

`Scheduler`

## Methods

### cancelAllTasks()

```ts
cancelAllTasks(): void;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:186](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L186)

Cancel all scheduled tasks

#### Returns

`void`

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`cancelAllTasks`](../interfaces/IScheduler.md#cancelalltasks)

***

### getTasks()

```ts
getTasks(): TaskHandle[];
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:197](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L197)

Get all active tasks

#### Returns

[`TaskHandle`](../interfaces/TaskHandle.md)[]

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`getTasks`](../interfaces/IScheduler.md#gettasks)

***

### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:50](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L50)

#### Returns

`void`

#### Implementation of

[`OnModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md).[`onModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md#onmoduledestroy)

***

### scheduleAt()

```ts
scheduleAt(
   date, 
   callback, 
   options?
): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:156](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L156)

Schedule a task to run at a specific date

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options` | [`TimeoutTaskOptions`](../interfaces/TimeoutTaskOptions.md) |

#### Returns

[`TaskHandle`](../interfaces/TaskHandle.md)

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`scheduleAt`](../interfaces/IScheduler.md#scheduleat)

***

### scheduleCron()

```ts
scheduleCron(
   cronExpression, 
   callback, 
   options?
): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:82](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L82)

Schedule a task to run at a cron time

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cronExpression` | `string` \| [`CronExpression`](../interfaces/CronExpression.md) |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options` | [`CronTaskOptions`](../interfaces/CronTaskOptions.md) |

#### Returns

[`TaskHandle`](../interfaces/TaskHandle.md)

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`scheduleCron`](../interfaces/IScheduler.md#schedulecron)

***

### scheduleInterval()

```ts
scheduleInterval(
   intervalMs, 
   callback, 
   options?
): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:107](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L107)

Schedule a task to run at fixed intervals

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `intervalMs` | `number` |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options` | [`IntervalTaskOptions`](../interfaces/IntervalTaskOptions.md) |

#### Returns

[`TaskHandle`](../interfaces/TaskHandle.md)

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`scheduleInterval`](../interfaces/IScheduler.md#scheduleinterval)

***

### scheduleTimeout()

```ts
scheduleTimeout(
   delayMs, 
   callback, 
   options?
): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:129](https://github.com/nestelia/nestelia/blob/main/packages/scheduler/src/services/scheduler.service.ts#L129)

Schedule a task to run once after a delay

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `delayMs` | `number` |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options` | [`TimeoutTaskOptions`](../interfaces/TimeoutTaskOptions.md) |

#### Returns

[`TaskHandle`](../interfaces/TaskHandle.md)

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`scheduleTimeout`](../interfaces/IScheduler.md#scheduletimeout)
