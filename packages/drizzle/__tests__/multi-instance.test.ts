import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { Container, Module, createElysiaApplication } from "nestelia";

import { DRIZZLE_INSTANCE } from "../src/drizzle.constants";
import { DrizzleModule } from "../src/drizzle.module";

/**
 * Regression coverage: multiple `DrizzleModule.forRoot()` registrations must
 * each keep their OWN db instance.
 *
 * Root cause of the historical bug: every `forRoot()` provided its raw options
 * under the SAME shared token (`DRIZZLE_MODULE_OPTIONS`). Because core dedupes
 * dynamic modules by class name and `addProvider` overwrites by token, a second
 * registration overwrote the first module scope's options — so the default
 * `DRIZZLE_INSTANCE` factory, when resolved from the shared `DrizzleModule`
 * scope, silently injected the LAST-registered options and returned the WRONG
 * db.
 *
 * drizzle-orm accepts a user-supplied `options.db`, so distinct sentinel
 * objects stand in for real databases — no connection is needed.
 */

const primaryDb = { name: "primary-db" };
const analyticsDb = { name: "analytics-db" };

/**
 * Resolves `token` from EVERY module scope the container knows about and
 * returns the distinct set of resolved values. The historical bug produced
 * two conflicting values for `DRIZZLE_INSTANCE` (one per module scope): the
 * global-search `get()` masked it by returning whichever scope it hit first.
 */
async function resolveFromEveryScope<T>(token: string): Promise<Set<T>> {
  const container = Container.instance as unknown as {
    getModules(): Map<string, unknown>;
    getFromModule<R>(t: string, key: string): Promise<R | undefined>;
  };
  const found = new Set<T>();
  for (const key of container.getModules().keys()) {
    const value = await container.getFromModule<T>(token, key);
    if (value !== undefined) {
      found.add(value);
    }
  }
  return found;
}

describe("DrizzleModule — multiple instances", () => {
  it("keeps each instance bound to its own db across every module scope", async () => {
    @Module({
      imports: [
        DrizzleModule.forRoot({ db: primaryDb }),
        DrizzleModule.forRoot({ db: analyticsDb, tag: "analytics" }),
      ],
    })
    class MultiDbModule {}

    await createElysiaApplication(MultiDbModule);

    // The default token must resolve to the primary db from ANY scope — never
    // collapse onto the analytics db.
    const defaultInstances = await resolveFromEveryScope(DRIZZLE_INSTANCE);
    expect(defaultInstances.has(primaryDb)).toBe(true);
    expect(defaultInstances.has(analyticsDb)).toBe(false);
    expect(defaultInstances.size).toBe(1);

    // The analytics token must resolve to the analytics db from ANY scope.
    const analyticsInstances = await resolveFromEveryScope("analytics");
    expect(analyticsInstances.has(analyticsDb)).toBe(true);
    expect(analyticsInstances.has(primaryDb)).toBe(false);
    expect(analyticsInstances.size).toBe(1);

    // And the plain global lookups each resolve to their own sentinel.
    const primary = await Container.instance.get(DRIZZLE_INSTANCE);
    const analytics = await Container.instance.get("analytics");
    expect(primary).toBe(primaryDb);
    expect(analytics).toBe(analyticsDb);
    expect(primary).not.toBe(analytics);
  });

  it("resolves a single default registration correctly", async () => {
    const onlyDb = { name: "only-db" };

    @Module({
      imports: [DrizzleModule.forRoot({ db: onlyDb })],
    })
    class SingleDbModule {}

    await createElysiaApplication(SingleDbModule);

    const resolved = await Container.instance.get(DRIZZLE_INSTANCE);
    expect(resolved).toBe(onlyDb);

    // No scope may disagree about what the single instance is.
    const everywhere = await resolveFromEveryScope(DRIZZLE_INSTANCE);
    expect(everywhere.size).toBe(1);
    expect(everywhere.has(onlyDb)).toBe(true);
  });
});
