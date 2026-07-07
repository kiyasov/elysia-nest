import "reflect-metadata";
import { afterEach, describe, expect, it } from "bun:test";
import { Container, Injectable, Module, createElysiaApplication } from "nestelia";
import { Interval, ScheduleModule, getScheduler } from "../src";

/**
 * End-to-end shutdown test: proves that scheduled jobs registered by the
 * ScheduleExplorer through the real application lifecycle are cancelled when
 * `app.close()` is called.
 *
 * The explorer registers jobs on the global singleton scheduler (via
 * `getScheduler()`), while the DI-provided `Scheduler` holds a different task
 * map. Without a shutdown hook on the explorer, the singleton's tasks keep
 * firing after `app.close()`, keeping the process alive and running callbacks
 * against torn-down providers.
 */
describe("Scheduler — shutdown cancellation", () => {
  afterEach(() => {
    // Safety net so a regression does not leak timers into other suites.
    getScheduler().cancelAllTasks();
    Container.instance.clear();
  });

  it("stops @Interval jobs after app.close()", async () => {
    let count = 0;

    @Injectable()
    class TickService {
      @Interval(50, { name: "shutdown-tick" })
      handleTick() {
        count++;
      }
    }

    @Module({
      imports: [ScheduleModule.forRoot()],
      providers: [TickService],
    })
    class AppModule {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app: any = await createElysiaApplication(AppModule, { logger: false });
    await app.listen(0);

    // Let the interval fire a few times to prove it is actually running.
    await new Promise((resolve) => setTimeout(resolve, 175));
    expect(count).toBeGreaterThanOrEqual(2);

    await app.close();

    // Record the count at shutdown, then wait several interval periods.
    const countAtClose = count;
    await new Promise((resolve) => setTimeout(resolve, 200));

    // No further callbacks may fire once the app is closed.
    expect(count).toBe(countAtClose);
  });
});
