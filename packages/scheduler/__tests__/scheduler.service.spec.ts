import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Scheduler } from "../src";

describe("Scheduler", () => {
  let scheduler: Scheduler;

  beforeEach(() => {
    scheduler = new Scheduler();
  });

  afterEach(() => {
    scheduler.cancelAllTasks();
  });

  describe("Cron Tasks", () => {
    it("should schedule cron task", () => {
      const task = scheduler.scheduleCron("* * * * *", () => {}, {
        name: "test-cron",
      });
      expect(task).toBeDefined();
      expect(task.name).toBe("test-cron");
      expect(task.isCanceled()).toBe(false);
    });

    it("should execute cron task", async () => {
      let executed = false;
      scheduler.scheduleCron(
        "* * * * * *",
        () => {
          executed = true;
        },
        { name: "test-cron" },
      );

      // Wait for next tick
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(executed).toBe(true);
    });

    it("should cancel cron task", () => {
      const task = scheduler.scheduleCron("* * * * *", () => {}, {
        name: "test-cron",
      });

      expect(task.isCanceled()).toBe(false);

      task.cancel();

      expect(task.isCanceled()).toBe(true);
    });

    it("should throw on invalid cron expression", () => {
      expect(() => {
        scheduler.scheduleCron("invalid", () => {}, { name: "invalid-cron" });
      }).toThrow("Invalid cron expression");
    });
  });

  describe("Interval Tasks", () => {
    it("should schedule interval task", () => {
      const task = scheduler.scheduleInterval(1000, () => {}, {
        name: "test-interval",
      });
      expect(task).toBeDefined();
      expect(task.name).toBe("test-interval");
    });

    it("should execute interval task multiple times", async () => {
      let count = 0;
      scheduler.scheduleInterval(
        100,
        () => {
          count++;
        },
        { name: "count-interval" },
      );

      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(count).toBeGreaterThanOrEqual(3);
    });

    it("should cancel interval task", () => {
      const task = scheduler.scheduleInterval(1000, () => {}, {
        name: "test-interval",
      });

      expect(task.isCanceled()).toBe(false);

      task.cancel();

      expect(task.isCanceled()).toBe(true);
    });

    it("should throw on invalid interval", () => {
      expect(() => {
        scheduler.scheduleInterval(0, () => {}, { name: "invalid-interval" });
      }).toThrow("Invalid interval");

      expect(() => {
        scheduler.scheduleInterval(-100, () => {}, {
          name: "negative-interval",
        });
      }).toThrow("Invalid interval");
    });
  });

  describe("Timeout Tasks", () => {
    it("should schedule timeout task", () => {
      const task = scheduler.scheduleTimeout(1000, () => {}, {
        name: "test-timeout",
      });
      expect(task).toBeDefined();
      expect(task.name).toBe("test-timeout");
    });

    it("should execute timeout task once", async () => {
      let executed = false;
      scheduler.scheduleTimeout(
        100,
        () => {
          executed = true;
        },
        { name: "test-timeout" },
      );

      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(executed).toBe(true);
    });

    it("should cancel timeout task", () => {
      const task = scheduler.scheduleTimeout(1000, () => {}, {
        name: "test-timeout",
      });

      expect(task.isCanceled()).toBe(false);

      task.cancel();

      expect(task.isCanceled()).toBe(true);
    });

    it("should throw on negative delay", () => {
      expect(() => {
        scheduler.scheduleTimeout(-100, () => {}, { name: "negative-timeout" });
      }).toThrow("Invalid delay");
    });
  });

  describe("Schedule At", () => {
    it("should schedule task at specific date", () => {
      const futureDate = new Date(Date.now() + 1000);
      const task = scheduler.scheduleAt(futureDate, () => {}, {
        name: "scheduled-at",
      });
      expect(task).toBeDefined();
    });

    it("should throw when scheduling in the past", () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(() => {
        scheduler.scheduleAt(pastDate, () => {}, { name: "past-task" });
      }).toThrow("Cannot schedule task in the past");
    });
  });

  describe("Task Management", () => {
    it("should get all active tasks", () => {
      scheduler.scheduleCron("* * * * *", () => {}, { name: "cron-1" });
      scheduler.scheduleInterval(1000, () => {}, { name: "interval-1" });
      scheduler.scheduleTimeout(1000, () => {}, { name: "timeout-1" });

      const tasks = scheduler.getTasks();
      expect(tasks.length).toBe(3);
    });

    it("should filter canceled tasks from getTasks", async () => {
      const task = scheduler.scheduleTimeout(50, () => {}, {
        name: "auto-remove",
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Task should be canceled after execution
      expect(task.isCanceled()).toBe(true);

      // getTasks filters canceled tasks
      const tasks = scheduler.getTasks();
      expect(tasks.length).toBe(0);
    });
  });

  describe("Cancel All Tasks", () => {
    it("should cancel all tasks", () => {
      const task1 = scheduler.scheduleCron("* * * * *", () => {}, {
        name: "cron-1",
      });
      const task2 = scheduler.scheduleInterval(1000, () => {}, {
        name: "interval-1",
      });
      const task3 = scheduler.scheduleTimeout(1000, () => {}, {
        name: "timeout-1",
      });

      expect(task1.isCanceled()).toBe(false);
      expect(task2.isCanceled()).toBe(false);
      expect(task3.isCanceled()).toBe(false);

      scheduler.cancelAllTasks();

      expect(task1.isCanceled()).toBe(true);
      expect(task2.isCanceled()).toBe(true);
      expect(task3.isCanceled()).toBe(true);
    });
  });
});
