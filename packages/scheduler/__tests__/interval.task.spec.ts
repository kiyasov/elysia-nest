import { afterEach, describe, expect, it } from "bun:test";
import { IntervalTask } from "../src/tasks";

describe("IntervalTask", () => {
  let task: IntervalTask | undefined;

  afterEach(() => {
    if (task) {
      task.cancel();
      task = undefined;
    }
  });

  it("should create interval task", () => {
    task = new IntervalTask(1000, () => {}, { name: "test-interval" });

    expect(task).toBeDefined();
    expect(task.name).toBe("test-interval");
    expect(task.isCanceled()).toBe(false);
  });

  it("should execute repeatedly", async () => {
    let executionCount = 0;

    task = new IntervalTask(
      100,
      () => {
        executionCount++;
      },
      { name: "repeating-interval" },
    );

    await new Promise((resolve) => setTimeout(resolve, 350));

    expect(executionCount).toBeGreaterThanOrEqual(2);
  });

  it("should cancel task", async () => {
    let executionCount = 0;

    task = new IntervalTask(
      100,
      () => {
        executionCount++;
      },
      { name: "cancel-interval" },
    );

    expect(task.isCanceled()).toBe(false);

    task.cancel();

    expect(task.isCanceled()).toBe(true);

    const countAfterCancel = executionCount;
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(executionCount).toBe(countAfterCancel);
  });

  it("should execute immediately with executeOnInit", async () => {
    let executed = false;

    task = new IntervalTask(
      5000,
      () => {
        executed = true;
      },
      { name: "init-interval", executeOnInit: true },
    );

    expect(executed).toBe(true);
  });
});
