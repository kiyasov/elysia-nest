# Class: Scheduler

Defined in: [packages/scheduler/src/services/scheduler.service.ts:26](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L26)

Service for scheduling tasks

## Implements

- [`IScheduler`](../interfaces/IScheduler.md)

## Constructors

### Constructor

```ts
new Scheduler(config?): Scheduler;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:45](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L45)

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

Defined in: [packages/scheduler/src/services/scheduler.service.ts:181](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L181)

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

Defined in: [packages/scheduler/src/services/scheduler.service.ts:192](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L192)

Get all active tasks

#### Returns

[`TaskHandle`](../interfaces/TaskHandle.md)[]

#### Implementation of

[`IScheduler`](../interfaces/IScheduler.md).[`getTasks`](../interfaces/IScheduler.md#gettasks)

***

### scheduleAt()

```ts
scheduleAt(
   date, 
   callback, 
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:151](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L151)

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
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:77](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L77)

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
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:102](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L102)

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
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:124](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L124)

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
