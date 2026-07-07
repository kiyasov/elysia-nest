import "reflect-metadata";
import { afterAll, describe, expect, it } from "bun:test";

import { createElysiaApplication, Injectable, Module } from "../../../../index";

/**
 * Regression: async shutdown hooks (onModuleDestroy / beforeApplicationShutdown /
 * onApplicationShutdown) must be AWAITED by app.close(). Previously close() fired
 * them synchronously and discarded the returned promises, so async cleanup
 * (DB.close(), worker.close(), etc.) was cut off mid-flight and rejections became
 * unhandled promise rejections.
 */

const events: string[] = [];

@Injectable()
class AsyncDisposer {
  // Each hook yields to the event loop BEFORE recording completion, so a
  // non-awaiting close() would return before these flags flip.
  async onModuleDestroy(): Promise<void> {
    await new Promise((r) => setTimeout(r, 15));
    events.push("onModuleDestroy:done");
  }
  async beforeApplicationShutdown(): Promise<void> {
    await new Promise((r) => setTimeout(r, 15));
    events.push("beforeApplicationShutdown:done");
  }
  async onApplicationShutdown(): Promise<void> {
    await new Promise((r) => setTimeout(r, 15));
    events.push("onApplicationShutdown:done");
  }
}

@Module({ providers: [AsyncDisposer] })
class AppModule {}

describe("async shutdown hooks are awaited by close()", () => {
  it("close() resolves only after every async dispose hook has completed", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app: any = await createElysiaApplication(AppModule);
    await app.listen(0);

    events.length = 0;
    await app.close();

    // If close() awaited the hooks, all three completion markers are present
    // the instant close() resolves.
    expect(events).toContain("onModuleDestroy:done");
    expect(events).toContain("beforeApplicationShutdown:done");
    expect(events).toContain("onApplicationShutdown:done");
  });

  it("preserves NestJS phase order: onModuleDestroy → beforeApplicationShutdown → onApplicationShutdown", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app: any = await createElysiaApplication(AppModule);
    await app.listen(0);

    events.length = 0;
    await app.close();

    expect(events).toEqual([
      "onModuleDestroy:done",
      "beforeApplicationShutdown:done",
      "onApplicationShutdown:done",
    ]);
  });

  it("a rejecting async dispose hook does not abort the remaining phases", async () => {
    const localEvents: string[] = [];

    @Injectable()
    class ThrowingDisposer {
      async onModuleDestroy(): Promise<void> {
        await new Promise((r) => setTimeout(r, 5));
        throw new Error("boom in onModuleDestroy");
      }
      async onApplicationShutdown(): Promise<void> {
        await new Promise((r) => setTimeout(r, 5));
        localEvents.push("onApplicationShutdown:done");
      }
    }

    @Module({ providers: [ThrowingDisposer] })
    class ThrowModule {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const app: any = await createElysiaApplication(ThrowModule);
    await app.listen(0);

    // close() must not reject and must still run later phases even though an
    // earlier hook threw.
    await app.close();

    expect(localEvents).toContain("onApplicationShutdown:done");
  });
});

afterAll(() => {
  events.length = 0;
});
