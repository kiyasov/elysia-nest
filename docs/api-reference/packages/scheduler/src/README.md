# packages/scheduler/src

## Classes

| Class | Description |
| ------ | ------ |
| [CronExpressions](classes/CronExpressions.md) | Cron expression presets |
| [FixedCronExpression](classes/FixedCronExpression.md) | Fixed cron expression |
| [ScheduleModule](classes/ScheduleModule.md) | Module for scheduling tasks (cron, interval, timeout) |
| [Scheduler](classes/Scheduler.md) | Service for scheduling tasks |
| [SchedulerRegistry](classes/SchedulerRegistry.md) | Registry for managing multiple schedulers |

## Functions

| Function | Description |
| ------ | ------ |
| [Cron](functions/Cron.md) | Decorator for cron jobs |
| [getScheduler](functions/getScheduler.md) | Get the global scheduler instance |
| [Interval](functions/Interval.md) | Decorator for interval jobs |
| [isValidCronExpression](functions/isValidCronExpression.md) | Validates if a string is a valid cron expression Supports 5-segment (minute hour day month day-of-week) and 6-segment (second minute hour day month day-of-week) formats |
| [registerScheduledJobs](functions/registerScheduledJobs.md) | Scans `instance` for methods decorated with [Cron](functions/Cron.md), [Interval](functions/Interval.md), [Timeout](functions/Timeout.md), or [ScheduleAt](functions/ScheduleAt.md) and registers them with the global [Scheduler](classes/Scheduler.md). |
| [ScheduleAt](functions/ScheduleAt.md) | Decorator for scheduled jobs at a specific date |
| [Timeout](functions/Timeout.md) | Decorator for timeout jobs |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CronExpression](interfaces/CronExpression.md) | Represents a cron expression for scheduled tasks |
| [CronTaskOptions](interfaces/CronTaskOptions.md) | Options for cron tasks |
| [IntervalTaskOptions](interfaces/IntervalTaskOptions.md) | Options for interval tasks |
| [IScheduler](interfaces/IScheduler.md) | The scheduler interface defining scheduling operations |
| [ScheduledJobMetadata](interfaces/ScheduledJobMetadata.md) | Scheduled job metadata |
| [ScheduledTask](interfaces/ScheduledTask.md) | Base interface for a scheduled task |
| [ScheduleModuleOptions](interfaces/ScheduleModuleOptions.md) | Module configuration options |
| [SchedulerConfig](interfaces/SchedulerConfig.md) | Configuration options for Scheduler |
| [SchedulerTaskOptions](interfaces/SchedulerTaskOptions.md) | Task options for scheduled tasks |
| [TaskHandle](interfaces/TaskHandle.md) | Task handle for controlling scheduled tasks |
| [TimeoutTaskOptions](interfaces/TimeoutTaskOptions.md) | Options for timeout tasks |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [TaskCallback](type-aliases/TaskCallback.md) | Type for task callback function |

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [ScheduledJobType](enumerations/ScheduledJobType.md) | Scheduled job types |

## Variables

| Variable | Description |
| ------ | ------ |
| [SCHEDULED\_JOBS\_METADATA](variables/SCHEDULED_JOBS_METADATA.md) | - |
