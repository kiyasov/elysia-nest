import "reflect-metadata";

import { afterAll, describe, expect, it } from "bun:test";

import { createElysiaApplication } from "~/src/core/application.factory";
import { applyExceptionFilters } from "~/src/core/exception-filter.registry";
import { Module } from "~/src/core/module.decorator";
import { APP_FILTERS_METADATA } from "~/src/decorators/constants";
import { APP_FILTER } from "~/src/di/constants";
import { Container } from "~/src/di";

/**
 * Regression test for the APP_FILTER target-mismatch bug.
 *
 * The plugin factory writes APP_FILTERS_METADATA onto the ORIGINAL decorated
 * module class, while the application factory READ it from `rootModule` — the
 * @Module-produced factory FUNCTION, a different object. As a result, a global
 * APP_FILTER declared on the ROOT module was never registered at boot.
 */

let caught = false;

class RootFilter {
  catch() {
    caught = true;
    return { handled: true };
  }
}

@Module({
  providers: [{ provide: APP_FILTER, useClass: RootFilter }],
})
class AppModule {}

describe("Root-module APP_FILTER is registered at boot", () => {
  it("writes and reads APP_FILTERS_METADATA on the same object", async () => {
    await createElysiaApplication(AppModule, { logger: false });

    // The read must resolve the root module's filter regardless of which object
    // (factory or original class) actually carries the metadata.
    const original = (AppModule as unknown as { prototype: { constructor: object } }).prototype
      .constructor;
    const onOriginal = Reflect.getMetadata(APP_FILTERS_METADATA, original) as unknown[] | undefined;
    const onFactory = Reflect.getMetadata(APP_FILTERS_METADATA, AppModule) as unknown[] | undefined;
    expect((onOriginal ?? onFactory) ?? []).toContain(RootFilter);
  });

  it("actually executes the root APP_FILTER through the global registry", async () => {
    caught = false;
    await createElysiaApplication(AppModule, { logger: false });

    await applyExceptionFilters({
      error: new Error("boom"),
      request: new Request("http://localhost/"),
      set: { status: 200, headers: {} },
      path: "/",
    });

    expect(caught).toBe(true);
  });
});

afterAll(() => {
  Container.instance.clear();
});
