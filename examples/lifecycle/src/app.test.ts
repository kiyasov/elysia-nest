import "reflect-metadata";

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { Elysia } from "elysia";

import { createElysiaApplication } from "../../../index";

import { AppModule } from "./app.module";

let server: Elysia;

beforeAll(async () => {
  const app = await createElysiaApplication(AppModule);
  server = app.getHttpServer();
});

describe("lifecycle example", () => {
  it("initializes all services via lifecycle hooks", async () => {
    const res = await server.handle(new Request("http://localhost/status"));
    const body = await res.json();

    expect(body.db).toBe(true);
    expect(body.cache).toBe(true);
    expect(body.dbUrl).toBe("postgres://localhost:5432/app");
  });

  it("CacheService reads DatabaseService url in onModuleInit via ModuleRef", async () => {
    // CacheService.onModuleInit uses ModuleRef.get(DatabaseService).
    // This works because all providers are loaded before any onModuleInit runs.
    const res = await server.handle(new Request("http://localhost/status"));
    const body = await res.json();

    expect(body.dbUrl).toBe("postgres://localhost:5432/app");
    expect(body.cache).toBe(true);
  });
});
