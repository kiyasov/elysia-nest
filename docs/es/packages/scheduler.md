---
title: Scheduler
icon: clock
description: Programa cron jobs, intervalos y timeouts
---

El paquete scheduler provee decoradores para ejecutar tareas de forma programada.

## Configuración

Importa `ScheduleModule` en tu módulo raíz:

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

Ejecuta un método según un horario cron:

```typescript
import { Injectable } from "nestelia";
import { Cron } from "nestelia/scheduler";

@Injectable()
class TasksService {
  @Cron("0 */5 * * * *") // cada 5 minutos
  async cleanup() {
    await this.db.cleanup();
  }

  @Cron("0 0 * * *") // diariamente a medianoche
  async dailyReport() {
    await this.reportService.generate();
  }
}
```

### @Interval()

Ejecuta un método a un intervalo fijo (en milisegundos):

```typescript
@Injectable()
class HealthService {
  @Interval(60000) // cada 60 segundos
  heartbeat() {
    console.log("Alive");
  }
}
```

### @Timeout()

Ejecuta un método una vez después de un retardo (en milisegundos):

```typescript
@Injectable()
class StartupService {
  @Timeout(5000) // 5 segundos después del bootstrap
  async delayedInit() {
    console.log("Delayed initialization complete");
  }
}
```

### @ScheduleAt()

Ejecuta un método en una fecha/hora específica:

```typescript
@Injectable()
class EventService {
  @ScheduleAt(new Date("2025-12-31T23:59:00"))
  async newYearCountdown() {
    console.log("Happy New Year!");
  }
}
```

## Opciones del Scheduler

Pasa opciones a `forRootWithOptions()`:

```typescript
ScheduleModule.forRootWithOptions({
  maxTasks: 5000,   // número máximo de tareas programadas (por defecto: 10000)
})
```

## SchedulerRegistry

Inyecta `SchedulerRegistry` para gestionar las tareas programadas de forma programática:

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

### API de SchedulerRegistry

| Método | Descripción |
|--------|-------------|
| `addScheduler(name, scheduler)` | Registra un scheduler con un nombre |
| `getScheduler(name)` | Obtiene un scheduler por nombre (devuelve `Scheduler \| undefined`) |
| `removeScheduler(name)` | Detiene y elimina un scheduler |
| `getSchedulerNames()` | Lista todos los nombres de schedulers registrados |
| `clear()` | Detiene y elimina todos los schedulers |

### API de Scheduler

| Método | Descripción |
|--------|-------------|
| `scheduleCron(expression, callback, options?)` | Programa una tarea cron, devuelve `TaskHandle` |
| `scheduleInterval(ms, callback, options?)` | Programa una tarea de intervalo |
| `scheduleTimeout(ms, callback, options?)` | Programa una tarea con retardo de una sola vez |
| `cancelAllTasks()` | Cancela todas las tareas de este scheduler |
