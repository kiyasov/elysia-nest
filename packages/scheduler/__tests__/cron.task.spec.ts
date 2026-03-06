import { afterEach, describe, expect, it } from "bun:test";
import { CronTask } from "../src/tasks";

describe("CronTask", () => {
  let task: CronTask | undefined;

  afterEach(() => {
    if (task) {
      task.cancel();
      task = undefined;
    }
  });

  it("should create cron task with valid expression", () => {
    task = new CronTask("* * * * *", () => {}, { name: "test-cron" });

    expect(task).toBeDefined();
    expect(task.name).toBe("test-cron");
    expect(task.isCanceled()).toBe(false);
  });

  it("should execute on cron schedule", async () => {
    let executionCount = 0;

    task = new CronTask(
      "* * * * * *", // Every second
      () => {
        executionCount++;
      },
      { name: "secondly-cron" },
    );

    // Wait for 2 executions
    await new Promise((resolve) => setTimeout(resolve, 2100));

    expect(executionCount).toBeGreaterThanOrEqual(2);
  });

  it("should cancel task", () => {
    task = new CronTask("* * * * *", () => {}, { name: "cancel-test" });

    expect(task.isCanceled()).toBe(false);

    task.cancel();

    expect(task.isCanceled()).toBe(true);
  });

  it("should support timezone", () => {
    task = new CronTask("0 9 * * *", () => {}, {
      name: "timezone-test",
      timeZone: "America/New_York",
    });

    expect(task).toBeDefined();
  });

  it("should execute immediately with executeOnInit", async () => {
    let executed = false;

    task = new CronTask(
      "0 0 * * *",
      () => {
        executed = true;
      },
      { name: "init-test", executeOnInit: true },
    );

    // Should execute immediately
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(executed).toBe(true);
  });
});
