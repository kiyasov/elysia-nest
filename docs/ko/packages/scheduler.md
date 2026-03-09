---
title: 스케줄러
icon: clock
description: 크론 작업, 인터벌, 타임아웃을 스케줄합니다
---

스케줄러 패키지는 일정에 따라 작업을 실행하기 위한 데코레이터를 제공합니다.

## 설정

루트 모듈에 `ScheduleModule`을 임포트합니다:

```typescript
import { Module } from "nestelia";
import { ScheduleModule } from "nestelia/scheduler";

@Module({
  imports: [ScheduleModule.forRoot()],
})
class AppModule {}
```

## 데코레이터

### @Cron()

크론 스케줄에 따라 메서드를 실행합니다:

```typescript
import { Injectable } from "nestelia";
import { Cron } from "nestelia/scheduler";

@Injectable()
class TasksService {
  @Cron("0 */5 * * * *") // 5분마다
  async cleanup() {
    await this.db.cleanup();
  }

  @Cron("0 0 * * *") // 자정마다 매일
  async dailyReport() {
    await this.reportService.generate();
  }
}
```

### @Interval()

고정 인터벌(밀리초)로 메서드를 실행합니다:

```typescript
@Injectable()
class HealthService {
  @Interval(60000) // 60초마다
  heartbeat() {
    console.log("Alive");
  }
}
```

### @Timeout()

딜레이(밀리초) 후 메서드를 한 번 실행합니다:

```typescript
@Injectable()
class StartupService {
  @Timeout(5000) // 부트스트랩 후 5초
  async delayedInit() {
    console.log("Delayed initialization complete");
  }
}
```

### @ScheduleAt()

특정 날짜/시간에 메서드를 실행합니다:

```typescript
@Injectable()
class EventService {
  @ScheduleAt(new Date("2025-12-31T23:59:00"))
  async newYearCountdown() {
    console.log("Happy New Year!");
  }
}
```

## 스케줄러 옵션

`forRootWithOptions()`에 옵션을 전달합니다:

```typescript
ScheduleModule.forRootWithOptions({
  maxTasks: 5000,   // 최대 스케줄 작업 수 (기본값: 10000)
})
```

## SchedulerRegistry

`SchedulerRegistry`를 주입해 스케줄된 작업을 프로그래밍 방식으로 관리합니다:

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

| 메서드 | 설명 |
|--------|-------------|
| `addScheduler(name, scheduler)` | 이름으로 스케줄러를 등록합니다 |
| `getScheduler(name)` | 이름으로 스케줄러를 가져옵니다 (`Scheduler \| undefined` 반환) |
| `removeScheduler(name)` | 스케줄러를 중지하고 제거합니다 |
| `getSchedulerNames()` | 등록된 모든 스케줄러 이름을 나열합니다 |
| `clear()` | 모든 스케줄러를 중지하고 제거합니다 |

### Scheduler API

| 메서드 | 설명 |
|--------|-------------|
| `scheduleCron(expression, callback, options?)` | 크론 작업을 스케줄합니다, `TaskHandle` 반환 |
| `scheduleInterval(ms, callback, options?)` | 인터벌 작업을 스케줄합니다 |
| `scheduleTimeout(ms, callback, options?)` | 일회성 지연 작업을 스케줄합니다 |
| `cancelAllTasks()` | 이 스케줄러의 모든 작업을 취소합니다 |
