import "reflect-metadata";

import { describe, expect, it, mock } from "bun:test";

import type { DynamicModule } from "nestelia";
import { ApolloShutdownService, GraphQLModule } from "../src/graphql.module";
import type { ApolloOptions } from "../src/interfaces";
import { ApolloService } from "../src/services";

/**
 * BUG 2 regression: ApolloService.stop() (which disposes every live WS
 * connection's keep-alive/init timers and stops the ApolloServer) was never
 * wired to a lifecycle hook. The module now registers an injectable
 * ApolloShutdownService whose onModuleDestroy calls stop().
 */
describe("GraphQLModule shutdown provider", () => {
  it("registers ApolloShutdownService in forRoot providers", () => {
    const mod = GraphQLModule.forRoot({
      autoSchemaFile: true,
    } as ApolloOptions) as DynamicModule;

    expect(mod.providers).toContain(ApolloShutdownService);
  });

  it("registers ApolloShutdownService in forRootAsync providers", () => {
    const mod = GraphQLModule.forRootAsync({
      useFactory: () => ({ autoSchemaFile: true }) as ApolloOptions,
    }) as DynamicModule;

    expect(mod.providers).toContain(ApolloShutdownService);
  });

  it("calls apolloService.stop() on onModuleDestroy", async () => {
    const stop = mock(async () => {});
    const fakeApollo = { stop } as unknown as ApolloService;

    const shutdown = new ApolloShutdownService(fakeApollo);
    await shutdown.onModuleDestroy();

    expect(stop).toHaveBeenCalledTimes(1);
  });

  it("implements onModuleInit so the destroy hook is actually registered", () => {
    // Framework contract: onModuleDestroy only fires for providers that also
    // implement onModuleInit.
    const shutdown = new ApolloShutdownService({
      stop: async () => {},
    } as unknown as ApolloService);

    expect(typeof shutdown.onModuleInit).toBe("function");
    expect(() => shutdown.onModuleInit()).not.toThrow();
  });
});
