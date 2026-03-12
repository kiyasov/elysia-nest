import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import { validateTsConfig } from "../src/core/helpers/tsconfig-validator";

describe("validateTsConfig", () => {
  it("passes when reflect-metadata is loaded and decorator metadata is emitted", () => {
    expect(() => validateTsConfig()).not.toThrow();
  });

  describe("reflect-metadata not available", () => {
    let originalGetMetadata: typeof Reflect.getMetadata;

    beforeEach(() => {
      originalGetMetadata = Reflect.getMetadata;
      // @ts-expect-error — intentionally removing getMetadata to simulate missing reflect-metadata
      delete Reflect.getMetadata;
    });

    afterEach(() => {
      Reflect.getMetadata = originalGetMetadata;
    });

    it("throws with instructions to import reflect-metadata", () => {
      expect(() => validateTsConfig()).toThrow(
        /reflect-metadata is not available/,
      );
    });

    it("error message includes the required import statement", () => {
      expect(() => validateTsConfig()).toThrow(/import "reflect-metadata"/);
    });
  });

  describe("emitDecoratorMetadata / experimentalDecorators disabled", () => {
    let spy: ReturnType<typeof spyOn>;

    beforeEach(() => {
      spy = spyOn(Reflect, "getMetadata").mockReturnValue(undefined);
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it("throws when design:paramtypes metadata is missing", () => {
      expect(() => validateTsConfig()).toThrow(
        /Decorator metadata is not being emitted/,
      );
    });

    it("error message lists the required tsconfig options", () => {
      expect(() => validateTsConfig()).toThrow(/"experimentalDecorators": true/);
      spy.mockRestore();
      spy = spyOn(Reflect, "getMetadata").mockReturnValue(undefined);
      expect(() => validateTsConfig()).toThrow(/"emitDecoratorMetadata": true/);
    });
  });
});
