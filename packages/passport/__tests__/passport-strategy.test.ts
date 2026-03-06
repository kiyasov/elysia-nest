import "reflect-metadata";

import { afterEach, describe, expect, it } from "bun:test";
import {
  clearStrategyRegistries,
  getRegisteredStrategyClass,
  getRegisteredStrategyInstance,
  PassportStrategy,
} from "../src/passport-strategy";

// Minimal passport.Strategy stub that accepts a verify callback
class MockBaseStrategy {
  name = "mock";
  _verify: (...args: unknown[]) => void;

  constructor(...args: unknown[]) {
    const cb = args[args.length - 1];
    this._verify = typeof cb === "function" ? (cb as (...a: unknown[]) => void) : () => {};
  }

  authenticate() {}
}

afterEach(() => {
  clearStrategyRegistries();
});

describe("PassportStrategy", () => {
  it("registers strategy class under given name", () => {
    class JwtStrategy extends PassportStrategy(MockBaseStrategy as never, "jwt") {
      validate() { return { id: 1 }; }
    }

    expect(getRegisteredStrategyClass("jwt")).toBeDefined();
  });

  it("registers strategy instance on construction", () => {
    class LocalStrategy extends PassportStrategy(MockBaseStrategy as never, "local") {
      validate() { return { id: 1 }; }
    }

    new LocalStrategy();
    expect(getRegisteredStrategyInstance("local")).toBeDefined();
  });

  it("throws when same strategy name is registered twice", () => {
    class StrategyA extends PassportStrategy(MockBaseStrategy as never, "duplicate") {
      validate() { return null; }
    }

    expect(
      () => {
        class StrategyB extends PassportStrategy(MockBaseStrategy as never, "duplicate") {
          validate() { return null; }
        }
      },
    ).toThrow('Passport strategy "duplicate" is already registered');
  });

  it("returns undefined for unknown strategy class", () => {
    expect(getRegisteredStrategyClass("unknown")).toBeUndefined();
  });

  it("returns undefined for unknown strategy instance", () => {
    expect(getRegisteredStrategyInstance("unknown")).toBeUndefined();
  });

  it("clears all registries", () => {
    class S extends PassportStrategy(MockBaseStrategy as never, "temp") {
      validate() { return null; }
    }
    new S();

    expect(getRegisteredStrategyClass("temp")).toBeDefined();
    clearStrategyRegistries();
    expect(getRegisteredStrategyClass("temp")).toBeUndefined();
    expect(getRegisteredStrategyInstance("temp")).toBeUndefined();
  });

  it("calls validate with args and resolves done", async () => {
    let capturedArgs: unknown[] = [];

    class TestStrategy extends PassportStrategy(MockBaseStrategy as never, "test") {
      validate(...args: unknown[]) {
        capturedArgs = args;
        return { user: "alice" };
      }
    }

    const instance = new TestStrategy() as unknown as { _verify: (...a: unknown[]) => void };
    await new Promise<void>((resolve, reject) => {
      instance._verify("arg1", "arg2", (err: unknown, user: unknown) => {
        if (err) reject(err as Error);
        else resolve();
      });
    });

    expect(capturedArgs).toEqual(["arg1", "arg2"]);
  });

  it("calls done with error when validate throws", async () => {
    class FailStrategy extends PassportStrategy(MockBaseStrategy as never, "fail") {
      validate() {
        throw new Error("bad credentials");
      }
    }

    const instance = new FailStrategy() as unknown as { _verify: (...a: unknown[]) => void };
    const err = await new Promise<unknown>((resolve) => {
      instance._verify("arg", (e: unknown) => resolve(e));
    });

    expect((err as Error).message).toBe("bad credentials");
  });
});
