# Interface: IScheduler

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:116](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L116)

The scheduler interface defining scheduling operations

## Methods

### cancelAllTasks()

```ts
cancelAllTasks(): void;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:156](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L156)

Cancel all scheduled tasks

#### Returns

`void`

***

### getTasks()

```ts
getTasks(): TaskHandle[];
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:161](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L161)

Get all active tasks

#### Returns

[`TaskHandle`](TaskHandle.md)[]

***

### scheduleAt()

```ts
scheduleAt(
   date, 
   callback, 
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:147](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L147)

Schedule a task to run at a specific date

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `date` | `Date` |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options?` | [`TimeoutTaskOptions`](TimeoutTaskOptions.md) |

#### Returns

[`TaskHandle`](TaskHandle.md)

***

### scheduleCron()

```ts
scheduleCron(
   cronExpression, 
   callback, 
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:120](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L120)

Schedule a task to run at a cron time

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cronExpression` | `string` \| [`CronExpression`](CronExpression.md) |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options?` | [`CronTaskOptions`](CronTaskOptions.md) |

#### Returns

[`TaskHandle`](TaskHandle.md)

***

### scheduleInterval()

```ts
scheduleInterval(
   intervalMs, 
   callback, 
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:129](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L129)

Schedule a task to run at fixed intervals

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `intervalMs` | `number` |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options?` | [`IntervalTaskOptions`](IntervalTaskOptions.md) |

#### Returns

[`TaskHandle`](TaskHandle.md)

***

### scheduleTimeout()

```ts
scheduleTimeout(
   delayMs, 
   callback, 
   options?): TaskHandle;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:138](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L138)

Schedule a task to run once after a delay

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `delayMs` | `number` |
| `callback` | [`TaskCallback`](../type-aliases/TaskCallback.md) |
| `options?` | [`TimeoutTaskOptions`](TimeoutTaskOptions.md) |

#### Returns

[`TaskHandle`](TaskHandle.md)
