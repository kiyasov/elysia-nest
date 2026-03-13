import "reflect-metadata";

import { beforeEach, describe, expect, it } from "bun:test";

import { Test } from "../../../packages/testing/src";
import { ConfigService } from "./config.service";
import { OrdersService } from "./orders.service";
import { UsersService } from "./users.service";

describe("modules example", () => {
  describe("ConfigService (@Global)", () => {
    it("returns configured values", async () => {
      const module = await Test.createTestingModule({
        providers: [ConfigService],
      }).compile();

      const config = module.get(ConfigService);
      expect(config.get("APP_NAME")).toBe("nestelia-modules-example");
      expect(config.get("MAX_USERS")).toBe("100");
    });
  });

  describe("UsersService", () => {
    let users: UsersService;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [UsersService, ConfigService],
      }).compile();
      users = module.get(UsersService);
    });

    it("creates a user", () => {
      const user = users.create("Alice");
      expect(user).toEqual({ id: 1, name: "Alice" });
    });

    it("enforces MAX_USERS limit", async () => {
      const module = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: ConfigService,
            useValue: { get: (k: string) => (k === "MAX_USERS" ? "1" : "") },
          },
        ],
      }).compile();

      const svc = module.get(UsersService);
      svc.create("Alice");
      const result = svc.create("Bob");
      expect(result).toEqual({ error: "User limit of 1 reached" });
    });
  });

  describe("OrdersService (cross-module DI)", () => {
    let orders: OrdersService;
    let users: UsersService;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [ConfigService, UsersService, OrdersService],
      }).compile();

      orders = module.get(OrdersService);
      users = module.get(UsersService);
    });

    it("creates an order for an existing user", () => {
      users.create("Alice");
      const order = orders.create(1, "Book");
      expect(order).toEqual({ id: 1, userId: 1, item: "Book" });
    });

    it("rejects order for unknown user", () => {
      const result = orders.create(99, "Book");
      expect(result).toEqual({ error: "User 99 not found" });
    });

    it("reads config via global ConfigService", () => {
      expect(orders.appName()).toBe("nestelia-modules-example");
    });
  });
});
