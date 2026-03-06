import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";

import { ConsoleLogger, Logger } from "~/src/logger";

describe("Logger", () => {
  let stdoutSpy: ReturnType<typeof mock>;
  let stderrSpy: ReturnType<typeof mock>;

  beforeEach(() => {
    stdoutSpy = mock(() => {});
    stderrSpy = mock(() => {});

    process.stdout.write = stdoutSpy as unknown as typeof process.stdout.write;
    process.stderr.write = stderrSpy as unknown as typeof process.stderr.write;

    // Reset to default logger
    Logger.overrideLogger(new ConsoleLogger());
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  describe("Log Levels", () => {
    it("should log debug message", () => {
      Logger.debug("debug message", "TestContext");
      expect(stdoutSpy).toHaveBeenCalled();
      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("DEBUG");
      expect(call[0]).toContain("TestContext");
      expect(call[0]).toContain("debug message");
    });

    it("should log verbose message", () => {
      Logger.verbose("verbose message", "TestContext");
      expect(stdoutSpy).toHaveBeenCalled();
      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("VERBOSE");
      expect(call[0]).toContain("verbose message");
    });

    it("should log info message", () => {
      Logger.log("info message", "TestContext");
      expect(stdoutSpy).toHaveBeenCalled();
      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("LOG");
      expect(call[0]).toContain("info message");
    });

    it("should log warning message", () => {
      Logger.warn("warning message", "TestContext");
      expect(stdoutSpy).toHaveBeenCalled();
      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("WARN");
      expect(call[0]).toContain("warning message");
    });

    it("should log error message", () => {
      Logger.error("error message", "stack trace", "TestContext");
      expect(stderrSpy).toHaveBeenCalled();
      const call = stderrSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("ERROR");
      expect(call[0]).toContain("error message");
    });

    it("should log fatal message", () => {
      Logger.fatal("fatal message", "stack trace", "TestContext");
      expect(stderrSpy).toHaveBeenCalled();
      const call = stderrSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("FATAL");
      expect(call[0]).toContain("fatal message");
    });
  });

  describe("Log Level Filtering", () => {
    it("should not log when level is filtered out", () => {
      const consoleLogger = new ConsoleLogger();
      consoleLogger.setLogLevels(["error", "fatal"]);
      Logger.overrideLogger(consoleLogger);

      Logger.debug("debug message");
      Logger.log("log message");
      Logger.warn("warn message");

      expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it("should log when level is allowed", () => {
      const consoleLogger = new ConsoleLogger();
      consoleLogger.setLogLevels(["log"]);
      Logger.overrideLogger(consoleLogger);

      Logger.log("log message");

      expect(stdoutSpy).toHaveBeenCalled();
    });
  });

  describe("Context", () => {
    it("should include context in log", () => {
      Logger.log("message", "MyContext");
      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("[MyContext]");
    });

    it("should use constructor for context", () => {
      const logger = new Logger("ConstructorContext");
      logger.log("message");
      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("[ConstructorContext]");
    });
  });

  describe("Error Stack Trace", () => {
    it("should include stack trace for errors", () => {
      const consoleLogger = new ConsoleLogger();
      Logger.overrideLogger(consoleLogger);

      const stack = "Error: test\n    at Test.method";
      Logger.error("error occurred", stack, "Context");

      expect(stderrSpy).toHaveBeenCalled();
      const call = stderrSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("error occurred");
    });
  });

  describe("Instance Methods", () => {
    it("should work with instance logger", () => {
      const logger = new Logger("InstanceContext");
      logger.log("instance message");

      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("InstanceContext");
      expect(call[0]).toContain("instance message");
    });

    it("should allow override log levels per instance", () => {
      const consoleLogger = new ConsoleLogger("Test", {
        logLevels: ["error"],
      });

      consoleLogger.log("should not appear");
      consoleLogger.error("should appear");

      expect(stdoutSpy).not.toHaveBeenCalled();
      expect(stderrSpy).toHaveBeenCalled();
    });
  });

  describe("isLevelEnabled", () => {
    it("should check if level is enabled", () => {
      Logger.overrideLogger(["error"]);

      expect(Logger.isLevelEnabled("error")).toBe(true);
      expect(Logger.isLevelEnabled("warn")).toBe(false);
      expect(Logger.isLevelEnabled("log")).toBe(false);
    });
  });

  describe("Buffer", () => {
    it("should buffer messages when attached", () => {
      Logger.attachBuffer();
      Logger.log("buffered message");

      expect(stdoutSpy).not.toHaveBeenCalled();

      Logger.flush();

      expect(stdoutSpy).toHaveBeenCalled();
    });

    it("should detach buffer", () => {
      Logger.attachBuffer();
      Logger.detachBuffer();
      Logger.log("message after detach");

      expect(stdoutSpy).toHaveBeenCalled();
    });
  });

  describe("getTimestamp", () => {
    it("should return timestamp", () => {
      const timestamp = Logger.getTimestamp();
      expect(timestamp).toBeDefined();
      expect(typeof timestamp).toBe("string");
    });
  });

  describe("ConsoleLogger", () => {
    it("should set context", () => {
      const logger = new ConsoleLogger("InitialContext");
      logger.setContext("NewContext");
      logger.log("message");

      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("[NewContext]");
    });

    it("should reset context", () => {
      const logger = new ConsoleLogger("OriginalContext");
      logger.setContext("TemporaryContext");
      logger.resetContext();
      logger.log("message");

      const call = stdoutSpy.mock.calls[0] as string[];
      expect(call[0]).toContain("[OriginalContext]");
    });

    it("should check level enabled on instance", () => {
      const logger = new ConsoleLogger();
      logger.setLogLevels(["warn"]);

      expect(logger.isLevelEnabled("warn")).toBe(true);
      expect(logger.isLevelEnabled("log")).toBe(false);
    });
  });
});
