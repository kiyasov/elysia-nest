import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import {
  GRAPHQL_PUBSUB,
  GRAPHQL_PUBSUB_OPTIONS,
  GraphQLPubSubModule,
  GraphQLPubSubGlobalModule,
  GraphQLPubSubModuleCore,
} from "../src/graphql-pubsub.module";

describe("GraphQLPubSubModule.forRoot", () => {
  it("returns a module class", () => {
    const mod = GraphQLPubSubModule.forRoot({ useValue: {} });
    expect(typeof mod).toBe("function");
  });

  it("registers GRAPHQL_PUBSUB in providers metadata", () => {
    GraphQLPubSubModule.forRoot({ useValue: { connection: { host: "localhost", port: 6379 } } });
    const providers = Reflect.getMetadata("providers", GraphQLPubSubGlobalModule) as Array<{ provide: unknown }>;
    const pubsubProvider = providers.find((p) => p.provide === GRAPHQL_PUBSUB);
    expect(pubsubProvider).toBeDefined();
  });

  it("exports GRAPHQL_PUBSUB token", () => {
    GraphQLPubSubModule.forRoot({ useValue: {} });
    const exports = Reflect.getMetadata("exports", GraphQLPubSubGlobalModule) as unknown[];
    expect(exports).toContain(GRAPHQL_PUBSUB);
  });

  it("returns global module by default (isGlobal=true)", () => {
    const mod = GraphQLPubSubModule.forRoot({ useValue: {} });
    expect(mod).toBe(GraphQLPubSubGlobalModule);
  });

  it("returns non-global module when isGlobal=false", () => {
    const mod = GraphQLPubSubModule.forRoot({ useValue: {}, isGlobal: false });
    expect(mod).toBe(GraphQLPubSubModuleCore);
  });

  it("useValue path creates GRAPHQL_PUBSUB_OPTIONS provider", () => {
    GraphQLPubSubModule.forRoot({ useValue: { connection: { host: "redis", port: 6379 } } });
    const providers = Reflect.getMetadata("providers", GraphQLPubSubGlobalModule) as Array<{ provide: unknown; useValue?: unknown }>;
    const optionsProvider = providers.find((p) => p.provide === GRAPHQL_PUBSUB_OPTIONS);
    expect(optionsProvider).toBeDefined();
  });
});

describe("GraphQLPubSubModule.forRootAsync", () => {
  it("returns a module class", () => {
    const mod = GraphQLPubSubModule.forRootAsync({
      useFactory: async () => ({ connection: { host: "localhost", port: 6379 } }),
    });
    expect(typeof mod).toBe("function");
  });

  it("registers GRAPHQL_PUBSUB provider", () => {
    GraphQLPubSubModule.forRootAsync({
      useFactory: async () => ({}),
    });
    const providers = Reflect.getMetadata("providers", GraphQLPubSubGlobalModule) as Array<{ provide: unknown }>;
    expect(providers.find((p) => p.provide === GRAPHQL_PUBSUB)).toBeDefined();
  });

  it("registers GRAPHQL_PUBSUB_OPTIONS with useFactory", () => {
    const factory = async () => ({});
    GraphQLPubSubModule.forRootAsync({ useFactory: factory });
    const providers = Reflect.getMetadata("providers", GraphQLPubSubGlobalModule) as Array<{ provide: unknown; useFactory?: unknown }>;
    const optProvider = providers.find((p) => p.provide === GRAPHQL_PUBSUB_OPTIONS) as { useFactory?: unknown } | undefined;
    expect(optProvider?.useFactory).toBe(factory);
  });

  it("returns global module by default", () => {
    const mod = GraphQLPubSubModule.forRootAsync({ useFactory: async () => ({}) });
    expect(mod).toBe(GraphQLPubSubGlobalModule);
  });

  it("returns non-global module when isGlobal=false", () => {
    const mod = GraphQLPubSubModule.forRootAsync({
      useFactory: async () => ({}),
      isGlobal: false,
    });
    expect(mod).toBe(GraphQLPubSubModuleCore);
  });

  it("passes inject array to options provider", () => {
    const TOKEN = "CONFIG";
    GraphQLPubSubModule.forRootAsync({
      useFactory: async () => ({}),
      inject: [TOKEN],
    });
    const providers = Reflect.getMetadata("providers", GraphQLPubSubGlobalModule) as Array<{ provide: unknown; inject?: unknown[] }>;
    const optProvider = providers.find((p) => p.provide === GRAPHQL_PUBSUB_OPTIONS) as { inject?: unknown[] } | undefined;
    expect(optProvider?.inject).toContain(TOKEN);
  });
});
