/**
 * Integration test that reproduces the cross-module DI bug:
 * "Provider X not found in module AppModule"
 *
 * Scenario mirrors real-world apps (e.g. cweb):
 *   - ConfigModule (@Global)  → ConfigService
 *   - UsersModule             → UsersService  (injects ConfigService from global)
 *   - OrdersModule            → OrdersService (injects UsersService + ConfigService)
 *   - AppModule imports all three
 *
 * Before the fix, initializeSingletonProviders() called container.get(token, AppModule)
 * for every provider across all modules, causing cross-module dependency lookups to
 * fail with "Provider UsersService not found in module AppModule".
 */
import "reflect-metadata";

import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { createElysiaApplication } from "../../../index";
import { AppModule } from "./app.module";

describe("cross-module DI integration (createElysiaApplication)", () => {
  let app: Awaited<ReturnType<typeof createElysiaApplication>>;
  let server: ReturnType<typeof app.getHttpServer>;

  beforeAll(async () => {
    app = await createElysiaApplication(AppModule);
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("UsersController resolves UsersService (cross-global-module DI)", async () => {
    const res = await server.handle(new Request("http://localhost/users", { method: "GET" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("OrdersController resolves OrdersService (injects UsersService from another module)", async () => {
    const res = await server.handle(new Request("http://localhost/orders", { method: "GET" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("full cross-module flow: create user then create order", async () => {
    // Create user
    const userRes = await server.handle(
      new Request("http://localhost/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alice" }),
      }),
    );
    expect(userRes.status).toBe(200);
    const user = (await userRes.json()) as { id: number };
    expect(user.id).toBe(1);

    // Create order for that user (OrdersService depends on UsersService from UsersModule)
    const orderRes = await server.handle(
      new Request("http://localhost/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, item: "Book" }),
      }),
    );
    expect(orderRes.status).toBe(200);
    const order = await orderRes.json();
    expect(order).toEqual({ id: 1, userId: 1, item: "Book" });
  });
});
