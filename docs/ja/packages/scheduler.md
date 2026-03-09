---
title: スケジューラー
icon: clock
description: Cron ジョブ、インターバル、タイムアウトをスケジュールする
---

スケジューラーパッケージは、スケジュールに従ってタスクを実行するためのデコレータを提供します。

## セットアップ

ルートモジュールに `ScheduleModule` をインポートします:

```typescript
import { Module } from "nestelia";
import { ScheduleModule } from "nestelia/scheduler";

@Module({
  imports: [ScheduleModule.forRoot()],
})
class AppModule {}
```

## デコレータ

### @Cron()

Cron スケジュールでメソッドを実行します:

```typescript
import { Injectable } from "nestelia";
import { Cron } from "nestelia/scheduler";

@Injectable()
class TasksService {
  @Cron("0 */5 * * * *") // 5 分ごと
  async cleanup() {
    await this.db.cleanup();
  }

  @Cron("0 0 * * *") // 毎日深夜 0 時
  async dailyReport() {
    await this.reportService.generate();
  }
}
```

### @Interval()

一定のインターバル（ミリ秒）でメソッドを実行します:

```typescript
@Injectable()
class HealthService {
  @Interval(60000) // 60 秒ごと
  heartbeat() {
    console.log("Alive");
  }
}
```

### @Timeout()

遅延（ミリ秒）後にメソッドを 1 回だけ実行します:

```typescript
@Injectable()
class StartupService {
  @Timeout(5000) // ブートストラップから 5 秒後
  async delayedInit() {
    console.log("Delayed initialization complete");
  }
}
```

### @ScheduleAt()

特定の日時にメソッドを実行します:

```typescript
@Injectable()
class EventService {
  @ScheduleAt(new Date("2025-12-31T23:59:00"))
  async newYearCountdown() {
    console.log("Happy New Year!");
  }
}
```

## スケジューラーオプション

`forRootWithOptions()` にオプションを渡します:

```typescript
ScheduleModule.forRootWithOptions({
  maxTasks: 5000,   // スケジュールされるタスクの最大数 (デフォルト: 10000)
})
```

## SchedulerRegistry

`SchedulerRegistry` をインジェクトして、スケジュールされたタスクをプログラムで管理します:

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

| メソッド | 説明 |
|--------|-------------|
| `addScheduler(name, scheduler)` | 名前でスケジューラーを登録する |
| `getScheduler(name)` | 名前でスケジューラーを取得する (`Scheduler \| undefined` を返す) |
| `removeScheduler(name)` | スケジューラーを停止して削除する |
| `getSchedulerNames()` | 登録されているすべてのスケジューラー名を一覧表示する |
| `clear()` | すべてのスケジューラーを停止して削除する |

### Scheduler API

| メソッド | 説明 |
|--------|-------------|
| `scheduleCron(expression, callback, options?)` | Cron タスクをスケジュールする、`TaskHandle` を返す |
| `scheduleInterval(ms, callback, options?)` | インターバルタスクをスケジュールする |
| `scheduleTimeout(ms, callback, options?)` | 一回限りの遅延タスクをスケジュールする |
| `cancelAllTasks()` | このスケジューラーのすべてのタスクをキャンセルする |
