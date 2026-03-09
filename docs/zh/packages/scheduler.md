---
title: 调度器
icon: clock
description: 调度 Cron 任务、定时器和超时
---

调度器包提供了用于按计划运行任务的装饰器。

## 配置

在根模块中导入 `ScheduleModule`：

```typescript
import { Module } from "nestelia";
import { ScheduleModule } from "nestelia/scheduler";

@Module({
  imports: [ScheduleModule.forRoot()],
})
class AppModule {}
```

## 装饰器

### @Cron()

按 Cron 计划运行一个方法：

```typescript
import { Injectable } from "nestelia";
import { Cron } from "nestelia/scheduler";

@Injectable()
class TasksService {
  @Cron("0 */5 * * * *") // 每 5 分钟
  async cleanup() {
    await this.db.cleanup();
  }

  @Cron("0 0 * * *") // 每天午夜
  async dailyReport() {
    await this.reportService.generate();
  }
}
```

### @Interval()

以固定间隔（毫秒）运行一个方法：

```typescript
@Injectable()
class HealthService {
  @Interval(60000) // 每 60 秒
  heartbeat() {
    console.log("Alive");
  }
}
```

### @Timeout()

延迟一段时间后运行一次方法（毫秒）：

```typescript
@Injectable()
class StartupService {
  @Timeout(5000) // 启动后 5 秒
  async delayedInit() {
    console.log("Delayed initialization complete");
  }
}
```

### @ScheduleAt()

在特定日期/时间运行方法：

```typescript
@Injectable()
class EventService {
  @ScheduleAt(new Date("2025-12-31T23:59:00"))
  async newYearCountdown() {
    console.log("Happy New Year!");
  }
}
```

## 调度器选项

将选项传递给 `forRootWithOptions()`：

```typescript
ScheduleModule.forRootWithOptions({
  maxTasks: 5000,   // 最大计划任务数（默认：10000）
})
```

## SchedulerRegistry

注入 `SchedulerRegistry` 以编程方式管理计划任务：

```typescript
import { Injectable, Inject } from "nestelia";
import { SchedulerRegistry, Scheduler } from "nestelia/scheduler";

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

| 方法 | 描述 |
|------|------|
| `addScheduler(name, scheduler)` | 以名称注册调度器 |
| `getScheduler(name)` | 按名称获取调度器（返回 `Scheduler \| undefined`） |
| `removeScheduler(name)` | 停止并移除调度器 |
| `getSchedulerNames()` | 列出所有已注册的调度器名称 |
| `clear()` | 停止并移除所有调度器 |

### Scheduler API

| 方法 | 描述 |
|------|------|
| `scheduleCron(expression, callback, options?)` | 调度一个 Cron 任务，返回 `TaskHandle` |
| `scheduleInterval(ms, callback, options?)` | 调度一个间隔任务 |
| `scheduleTimeout(ms, callback, options?)` | 调度一个一次性延迟任务 |
| `cancelAllTasks()` | 取消该调度器上的所有任务 |
