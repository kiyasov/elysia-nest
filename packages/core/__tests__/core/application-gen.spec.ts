import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import { createElysiaApplication } from "~/src/core/application.factory";
import { Module } from "~/src/core/module.decorator";
import { Container } from "~/src/di/container";
import { Logger } from "~/src/logger";

@Module({})
class EmptyModule {}

describe("createElysiaApplication — gen option", () => {
  let spawnSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    Container.instance.clear();
    spawnSpy = spyOn(Bun, "spawnSync").mockReturnValue({
      exitCode: 0,
    } as ReturnType<typeof Bun.spawnSync>);
  });

  afterEach(() => {
    spawnSpy.mockRestore();
  });

  it("does not call spawnSync when gen is not set", async () => {
    await createElysiaApplication(EmptyModule as any);
    expect(spawnSpy).not.toHaveBeenCalled();
  });

  it("calls bunx nestelia-gen with no extra args when gen: true", async () => {
    await createElysiaApplication(EmptyModule as any, { gen: true });
    expect(spawnSpy).toHaveBeenCalledTimes(1);
    expect(spawnSpy.mock.calls[0]![0]).toEqual(["bunx", "nestelia-gen"]);
  });

  it("calls bunx nestelia-gen with output arg when gen.output is set", async () => {
    await createElysiaApplication(EmptyModule as any, {
      gen: { output: "src/schema.ts" },
    });
    expect(spawnSpy.mock.calls[0]![0]).toEqual([
      "bunx",
      "nestelia-gen",
      "src/schema.ts",
    ]);
  });

  it("calls bunx nestelia-gen with --tsconfig flag when gen.tsconfig is set", async () => {
    await createElysiaApplication(EmptyModule as any, {
      gen: { tsconfig: "tsconfig.app.json" },
    });
    expect(spawnSpy.mock.calls[0]![0]).toEqual([
      "bunx",
      "nestelia-gen",
      "--tsconfig",
      "tsconfig.app.json",
    ]);
  });

  it("passes both --tsconfig and output when both are set", async () => {
    await createElysiaApplication(EmptyModule as any, {
      gen: { tsconfig: "tsconfig.app.json", output: "src/schema.ts" },
    });
    expect(spawnSpy.mock.calls[0]![0]).toEqual([
      "bunx",
      "nestelia-gen",
      "--tsconfig",
      "tsconfig.app.json",
      "src/schema.ts",
    ]);
  });

  it("logs a warning when nestelia-gen exits with non-zero code", async () => {
    spawnSpy.mockReturnValue({ exitCode: 1 } as ReturnType<typeof Bun.spawnSync>);
    const warnSpy = spyOn(Logger, "warn").mockImplementation(() => {});
    try {
      await createElysiaApplication(EmptyModule as any, { gen: true });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("1"),
        "NesteliaGen",
      );
    } finally {
      warnSpy.mockRestore();
    }
  });
});
