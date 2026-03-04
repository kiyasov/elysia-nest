---
title: Scheduler
icon: clock
description: Schedule cron jobs, intervals, and timeouts
---

The scheduler package provides decorators for running tasks on a schedule.

## Setup

Import `ScheduleModule` in your root module:

```typescript
import { Module } from "@kiyasov/elysia-nest";
import { ScheduleModule } from "@kiyasov/elysia-nest/scheduler";

@Module({
  imports: [ScheduleModule.forRoot()],
})
class AppModule {}
```

## Decorators

### @Cron()

Run a method on a cron schedule:

```typescript
import { Injectable } from "@kiyasov/elysia-nest";
import { Cron } from "@kiyasov/elysia-nest/scheduler";

@Injectable()
class TasksService {
  @Cron("0 */5 * * * *") // every 5 minutes
  async cleanup() {
    await this.db.cleanup();
  }

  @Cron("0 0 * * *") // daily at midnight
  async dailyReport() {
    await this.reportService.generate();
  }
}
```

### @Interval()

Run a method at a fixed interval (in milliseconds):

```typescript
@Injectable()
class HealthService {
  @Interval(60000) // every 60 seconds
  heartbeat() {
    console.log("Alive");
  }
}
```

### @Timeout()

Run a method once after a delay (in milliseconds):

```typescript
@Injectable()
class StartupService {
  @Timeout(5000) // 5 seconds after bootstrap
  async delayedInit() {
    console.log("Delayed initialization complete");
  }
}
```

### @ScheduleAt()

Run a method at a specific date/time:

```typescript
@Injectable()
class EventService {
  @ScheduleAt(new Date("2025-12-31T23:59:00"))
  async newYearCountdown() {
    console.log("Happy New Year!");
  }
}
```

## Scheduler Options

Pass options to `forRootWithOptions()`:

```typescript
ScheduleModule.forRootWithOptions({
  maxTasks: 5000,   // max number of scheduled tasks (default: 10000)
})
```

## SchedulerRegistry

Inject `SchedulerRegistry` to manage scheduled tasks programmatically:

```typescript
import { Injectable, Inject } from "@kiyasov/elysia-nest";
import { SchedulerRegistry, Scheduler } from "@kiyasov/elysia-nest/scheduler";

@Injectable()
class DynamicTaskService {
  constructor(private registry: SchedulerRegistry) {}

  addCronTask(name: string, cronExpression: string, callback: () => void) {
    const scheduler = new Scheduler();
    scheduler.scheduleCron(cronExpression, callback);
    this.registry.addScheduler(name, scheduler);
  }

  removeTask(name: string) {
    this.registry.removeScheduler(name);
  }

  listTasks(): string[] {
    return this.registry.getSchedulerNames();
  }
}
```

### SchedulerRegistry API

| Method | Description |
|--------|-------------|
| `addScheduler(name, scheduler)` | Register a scheduler under a name |
| `getScheduler(name)` | Get a scheduler by name (returns `Scheduler \| undefined`) |
| `removeScheduler(name)` | Stop and remove a scheduler |
| `getSchedulerNames()` | List all registered scheduler names |
| `clear()` | Stop and remove all schedulers |

### Scheduler API

| Method | Description |
|--------|-------------|
| `scheduleCron(expression, callback, options?)` | Schedule a cron task, returns `TaskHandle` |
| `scheduleInterval(ms, callback, options?)` | Schedule an interval task |
| `scheduleTimeout(ms, callback, options?)` | Schedule a one-time delayed task |
| `cancelAllTasks()` | Cancel all tasks on this scheduler |
