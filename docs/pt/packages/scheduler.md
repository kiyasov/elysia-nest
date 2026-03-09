---
title: Scheduler
icon: clock
description: Agende cron jobs, intervalos e timeouts
---

O pacote scheduler fornece decoradores para execução de tarefas de forma agendada.

## Configuração

Importe o `ScheduleModule` no seu módulo raiz:

```typescript
import { Module } from "nestelia";
import { ScheduleModule } from "nestelia/scheduler";

@Module({
  imports: [ScheduleModule.forRoot()],
})
class AppModule {}
```

## Decoradores

### @Cron()

Execute um método em um agendamento cron:

```typescript
import { Injectable } from "nestelia";
import { Cron } from "nestelia/scheduler";

@Injectable()
class TasksService {
  @Cron("0 */5 * * * *") // a cada 5 minutos
  async cleanup() {
    await this.db.cleanup();
  }

  @Cron("0 0 * * *") // diariamente à meia-noite
  async dailyReport() {
    await this.reportService.generate();
  }
}
```

### @Interval()

Execute um método em um intervalo fixo (em milissegundos):

```typescript
@Injectable()
class HealthService {
  @Interval(60000) // a cada 60 segundos
  heartbeat() {
    console.log("Alive");
  }
}
```

### @Timeout()

Execute um método uma vez após um atraso (em milissegundos):

```typescript
@Injectable()
class StartupService {
  @Timeout(5000) // 5 segundos após o bootstrap
  async delayedInit() {
    console.log("Delayed initialization complete");
  }
}
```

### @ScheduleAt()

Execute um método em uma data/hora específica:

```typescript
@Injectable()
class EventService {
  @ScheduleAt(new Date("2025-12-31T23:59:00"))
  async newYearCountdown() {
    console.log("Happy New Year!");
  }
}
```

## Opções do Scheduler

Passe opções para `forRootWithOptions()`:

```typescript
ScheduleModule.forRootWithOptions({
  maxTasks: 5000,   // número máximo de tarefas agendadas (padrão: 10000)
})
```

## SchedulerRegistry

Injete o `SchedulerRegistry` para gerenciar tarefas agendadas programaticamente:

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

### API do SchedulerRegistry

| Método | Descrição |
|--------|-----------|
| `addScheduler(name, scheduler)` | Registra um scheduler com um nome |
| `getScheduler(name)` | Obtém um scheduler pelo nome (retorna `Scheduler \| undefined`) |
| `removeScheduler(name)` | Para e remove um scheduler |
| `getSchedulerNames()` | Lista todos os nomes de schedulers registrados |
| `clear()` | Para e remove todos os schedulers |

### API do Scheduler

| Método | Descrição |
|--------|-----------|
| `scheduleCron(expression, callback, options?)` | Agenda uma tarefa cron, retorna `TaskHandle` |
| `scheduleInterval(ms, callback, options?)` | Agenda uma tarefa de intervalo |
| `scheduleTimeout(ms, callback, options?)` | Agenda uma tarefa com atraso único |
| `cancelAllTasks()` | Cancela todas as tarefas deste scheduler |
