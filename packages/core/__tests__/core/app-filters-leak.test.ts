import "reflect-metadata";

import { afterAll, describe, expect, it } from "bun:test";

import { createElysiaApplication } from "~/src/core/application.factory";
import { Module } from "~/src/core/module.decorator";
import { APP_FILTERS_METADATA } from "~/src/decorators/constants";
import { APP_FILTER } from "~/src/di/constants";
import { Container } from "~/src/di";

/**
 * Regression test for the APP_FILTERS_METADATA leak (issue C1).
 *
 * `Reflect` metadata is process-global and survives `beginInitSession()`.
 * Re-creating the same application in one process (integration tests, hot
 * reload, serverless warm re-init) must NOT accumulate duplicate APP_FILTER
 * entries on the module class.
 */

class MyFilter {
  catch() {
    /* no-op */
  }
}

@Module({
  providers: [{ provide: APP_FILTER, useClass: MyFilter }],
})
class AppModule {}

describe("APP_FILTERS_METADATA — no cross-boot accumulation (C1)", () => {
  it("keeps a single copy after re-creating the application", async () => {
    await createElysiaApplication(AppModule, { logger: false });
    await createElysiaApplication(AppModule, { logger: false });
    await createElysiaApplication(AppModule, { logger: false });

    // The @Module decorator replaces the class with a factory function; the plugin
    // factory writes APP_FILTERS_METADATA onto the ORIGINAL target class, reachable
    // via `prototype.constructor`. Read from there to observe accumulation.
    const target = (AppModule as unknown as { prototype: { constructor: object } }).prototype
      .constructor;
    const filters = Reflect.getMetadata(APP_FILTERS_METADATA, target) as unknown[];
    expect(filters).toHaveLength(1);
    expect(filters[0]).toBe(MyFilter);
  });
});

afterAll(() => {
  Container.instance.clear();
});
