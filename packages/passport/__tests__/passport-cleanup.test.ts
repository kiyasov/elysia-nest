import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import passport from "passport";

import { Injectable, Module } from "nestelia";
import {
  getRegisteredStrategyClass,
  getRegisteredStrategyInstance,
  PassportStrategy,
} from "../src/passport-strategy";
import { PassportModule } from "../src/passport.module";

const { createElysiaApplication } = await import("../../../index");

// Minimal passport.Strategy stub that accepts a verify callback and exposes a name.
class MockBaseStrategy {
  name = "mock";
  _verify: (...args: unknown[]) => void;

  constructor(...args: unknown[]) {
    const cb = args[args.length - 1];
    this._verify =
      typeof cb === "function" ? (cb as (...a: unknown[]) => void) : () => {};
  }

  authenticate() {}
}

/** Access passport's internal strategy lookup without pulling in its types. */
function resolvePassportStrategy(name: string): unknown {
  return (passport as unknown as { _strategy(n: string): unknown })._strategy(
    name,
  );
}

describe("PassportModule — cleanup on application close", () => {
  it("clears strategy registries and unregisters from passport when the app is closed", async () => {
    const NAME = "jwt-lifecycle";

    @Injectable()
    class JwtStrategy extends PassportStrategy(MockBaseStrategy as never, NAME) {
      validate() {
        return { id: 1 };
      }
    }

    @Module({
      imports: [PassportModule],
      providers: [JwtStrategy],
    })
    class AppModule {}

    const app = await createElysiaApplication(AppModule);

    // The strategy is registered during boot.
    expect(getRegisteredStrategyClass(NAME)).toBeDefined();
    expect(getRegisteredStrategyInstance(NAME)).toBeDefined();
    expect(resolvePassportStrategy(NAME)).toBeDefined();

    // Closing the app must run the real cleanup via the DI-registered provider.
    await app.close();

    expect(getRegisteredStrategyClass(NAME)).toBeUndefined();
    expect(getRegisteredStrategyInstance(NAME)).toBeUndefined();
    expect(resolvePassportStrategy(NAME)).toBeUndefined();

    // Because the name registry was reset, re-declaring the same strategy name
    // (as a second test file would in the same process) must not throw.
    expect(() => {
      class JwtStrategyAgain extends PassportStrategy(
        MockBaseStrategy as never,
        NAME,
      ) {
        validate() {
          return { id: 2 };
        }
      }
      void JwtStrategyAgain;
    }).not.toThrow();
  });
});
