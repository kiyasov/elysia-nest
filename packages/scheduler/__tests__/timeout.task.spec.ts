import { afterEach, describe, expect, it } from "bun:test";
import { TimeoutTask } from "../src/tasks";

describe("TimeoutTask", () => {
  let task: TimeoutTask | undefined;

  afterEach(() => {
    if (task) {
      task.cancel();
      task = undefined;
    }
  });

  it("should create timeout task", () => {
    task = new TimeoutTask(1000, () => {}, { name: "test-timeout" });

    expect(task).toBeDefined();
    expect(task.name).toBe("test-timeout");
    expect(task.isCanceled()).toBe(false);
  });

  it("should execute once after timeout", async () => {
    let executionCount = 0;

    task = new TimeoutTask(
      100,
      () => {
        executionCount++;
      },
      { name: "once-timeout" },
    );

    expect(task.isCanceled()).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(executionCount).toBe(0);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(executionCount).toBe(1);

    // Should not execute again
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(executionCount).toBe(1);
  });

  it("should mark as canceled after execution", async () => {
    task = new TimeoutTask(50, () => {}, { name: "completed-timeout" });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(task.isCanceled()).toBe(true);
  });

  it("should cancel before execution", async () => {
    let executed = false;

    task = new TimeoutTask(
      100,
      () => {
        executed = true;
      },
      { name: "cancel-timeout" },
    );

    task.cancel();

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(executed).toBe(false);
    expect(task.isCanceled()).toBe(true);
  });

  it("should execute immediately with executeOnInit", async () => {
    let executed = false;

    task = new TimeoutTask(
      5000,
      () => {
        executed = true;
      },
      { name: "init-timeout", executeOnInit: true },
    );

    expect(executed).toBe(true);
    expect(task.isCanceled()).toBe(true);
  });
});
