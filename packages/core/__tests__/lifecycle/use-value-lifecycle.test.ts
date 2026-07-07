import "reflect-metadata";

import { afterAll, describe, expect, it } from "bun:test";

import { createElysiaApplication, Module } from "../../../../index";
import { Container } from "~/src/di";

/**
 * Regression test: a `useValue` provider implementing `onModuleInit` /
 * `onModuleDestroy` must fire both hooks across a real boot/close cycle.
 *
 * `useValue` providers are eagerly resolved (their wrapper has no `metatype`),
 * so they were skipped by `initializeSingletonProviders`, silently never firing
 * their lifecycle hooks.
 */

const log: string[] = [];

const valueProvider = {
  onModuleInit() {
    log.push("value:onModuleInit");
  },
  onModuleDestroy() {
    log.push("value:onModuleDestroy");
  },
};

@Module({
  providers: [{ provide: "VALUE_PROVIDER", useValue: valueProvider }],
})
class AppModule {}

describe("useValue provider lifecycle hooks", () => {
  it("fires onModuleInit and onModuleDestroy across boot/close", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app: any = await createElysiaApplication(AppModule, { logger: false });
    await app.listen(0); // ephemeral port so close() can stop a running server cleanly

    expect(log).toContain("value:onModuleInit");

    await app.close();

    expect(log).toContain("value:onModuleDestroy");
  });
});

afterAll(() => {
  log.length = 0;
  Container.instance.clear();
});
