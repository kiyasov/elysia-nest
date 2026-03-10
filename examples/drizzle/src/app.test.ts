import "reflect-metadata";

import { Database } from "bun:sqlite";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { Test } from "../../../packages/testing/src";
import { DRIZZLE_INSTANCE } from "../../../packages/drizzle/src";
import { users } from "./schema";
import { UsersService } from "./users.service";

let sqlite: Database;
let service: UsersService;

beforeAll(async () => {
  sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema: { users } });

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  const moduleRef = await Test.createTestingModule({
    providers: [
      UsersService,
      { provide: DRIZZLE_INSTANCE, useValue: db },
    ],
  }).compile();

  service = moduleRef.get(UsersService);
});

afterAll(() => {
  sqlite.close();
});

describe("UsersService", () => {
  it("starts with an empty table", () => {
    expect(service.findAll()).toHaveLength(0);
  });

  it("creates a user", () => {
    const user = service.create({ name: "Alice", email: "alice@example.com" });
    expect(user.id).toBeDefined();
    expect(user.name).toBe("Alice");
  });

  it("finds all users", () => {
    service.create({ name: "Bob", email: "bob@example.com" });
    expect(service.findAll().length).toBeGreaterThanOrEqual(2);
  });

  it("finds a user by id", () => {
    const created = service.create({ name: "Charlie", email: "charlie@example.com" });
    const found = service.findOne(created.id);
    expect(found.email).toBe("charlie@example.com");
  });

  it("throws NotFoundException for unknown id", () => {
    expect(() => service.findOne(99999)).toThrow("User #99999 not found");
  });

  it("removes a user", () => {
    const user = service.create({ name: "Dave", email: "dave@example.com" });
    const result = service.remove(user.id);
    expect(result.deleted).toBe(true);
    expect(() => service.findOne(user.id)).toThrow();
  });
});
