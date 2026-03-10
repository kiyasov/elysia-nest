import "reflect-metadata";

import { Database } from "bun:sqlite";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";

import { Injectable } from "nestelia";
import { Test } from "../../testing/src/test";
import {
  DRIZZLE_INSTANCE,
  DRIZZLE_MODULE_OPTIONS,
} from "../src/drizzle.constants";
import { DrizzleModule } from "../src/drizzle.module";
import { InjectDrizzle } from "../src/decorators/inject-drizzle.decorator";

// ── Schema ────────────────────────────────────────────────────────────────────

const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

type BunSQLiteDatabase = ReturnType<typeof drizzle<{ users: typeof users }>>;

function makeDb(): { db: BunSQLiteDatabase; sqlite: Database } {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite, { schema: { users } });
  db.run(
    `CREATE TABLE IF NOT EXISTS users
       (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`,
  );
  return { db, sqlite };
}

// ── Service used in DI tests ──────────────────────────────────────────────────

@Injectable()
class UserService {
  constructor(@InjectDrizzle() private readonly db: BunSQLiteDatabase) {}

  insert(name: string) {
    return this.db.insert(users).values({ name }).returning().all();
  }

  findAll() {
    return this.db.select().from(users).all();
  }

  findByName(name: string) {
    return this.db.select().from(users).where(eq(users.name, name)).all();
  }
}

// ── Module shape ──────────────────────────────────────────────────────────────

describe("DrizzleModule.forRoot — shape", () => {
  it("returns a valid DynamicModule", () => {
    const { db, sqlite } = makeDb();
    const mod = DrizzleModule.forRoot({ db });
    sqlite.close();

    expect(mod.module).toBe(DrizzleModule);
    expect(mod.global).toBe(false);
    expect(Array.isArray(mod.providers)).toBe(true);
    expect(mod.exports).toContain(DRIZZLE_INSTANCE);
  });

  it("uses a custom tag as the provider token", () => {
    const { db, sqlite } = makeDb();
    const mod = DrizzleModule.forRoot({ db, tag: "analytics" });
    sqlite.close();

    expect(mod.exports).toContain("analytics");
    expect(mod.exports).not.toContain(DRIZZLE_INSTANCE);
  });

  it("sets global: true when isGlobal is true", () => {
    const { db, sqlite } = makeDb();
    const mod = DrizzleModule.forRoot({ db, isGlobal: true });
    sqlite.close();

    expect(mod.global).toBe(true);
  });

  it("includes DRIZZLE_MODULE_OPTIONS provider", () => {
    const { db, sqlite } = makeDb();
    const mod = DrizzleModule.forRoot({ db });
    sqlite.close();

    const providers = mod.providers as { provide: unknown }[];
    expect(providers.some((p) => p.provide === DRIZZLE_MODULE_OPTIONS)).toBe(
      true,
    );
  });
});

describe("DrizzleModule.forRootAsync — shape", () => {
  it("returns a valid DynamicModule with useFactory", () => {
    const { db, sqlite } = makeDb();
    const mod = DrizzleModule.forRootAsync({ useFactory: () => ({ db }) });
    sqlite.close();

    expect(mod.module).toBe(DrizzleModule);
    expect(mod.exports).toContain(DRIZZLE_INSTANCE);
  });

  it("includes extraProviders when provided", () => {
    const { db, sqlite } = makeDb();
    const extra = { provide: "EXTRA", useValue: 42 };
    const mod = DrizzleModule.forRootAsync({
      useFactory: () => ({ db }),
      extraProviders: [extra],
    });
    sqlite.close();

    expect((mod.providers as unknown[]).includes(extra)).toBe(true);
  });

  it("uses custom tag when provided", () => {
    const { db, sqlite } = makeDb();
    const mod = DrizzleModule.forRootAsync({
      tag: "secondary",
      useFactory: () => ({ db }),
    });
    sqlite.close();

    expect(mod.exports).toContain("secondary");
  });

  it("includes useClass provider when useClass is specified", () => {
    class FakeFactory {
      createDrizzleOptions() {
        return makeDb();
      }
    }
    const mod = DrizzleModule.forRootAsync({ useClass: FakeFactory as never });
    const providers = mod.providers as { provide?: unknown; useClass?: unknown }[];
    expect(providers.some((p) => p.useClass === FakeFactory)).toBe(true);
  });
});

// ── Real drizzle operations ───────────────────────────────────────────────────

describe("drizzle-orm bun-sqlite — real queries", () => {
  let sqlite: Database;
  let db: BunSQLiteDatabase;

  beforeAll(() => {
    ({ db, sqlite } = makeDb());
  });

  afterAll(() => {
    sqlite.close();
  });

  it("inserts and retrieves a row", () => {
    const [row] = db.insert(users).values({ name: "Alice" }).returning().all();
    expect(row.name).toBe("Alice");
    expect(typeof row.id).toBe("number");
  });

  it("selects multiple rows", () => {
    db.insert(users).values({ name: "Bob" }).run();
    const all = db.select().from(users).all();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it("filters by column", () => {
    const result = db
      .select()
      .from(users)
      .where(eq(users.name, "Alice"))
      .all();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Alice");
  });
});

// ── DI integration ────────────────────────────────────────────────────────────

describe("DrizzleModule — DI integration with TestingModule", () => {
  let sqlite: Database;
  let db: BunSQLiteDatabase;
  let service: UserService;

  beforeAll(async () => {
    ({ db, sqlite } = makeDb());

    // Provide the db instance directly — mirrors what DrizzleModule.forRoot
    // registers under the hood, bypassing the dynamic module import layer.
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DRIZZLE_INSTANCE, useValue: db },
      ],
    }).compile();

    service = moduleRef.get(UserService);
  });

  afterAll(() => {
    sqlite.close();
  });

  it("injects the drizzle instance into the service", () => {
    expect(service).toBeDefined();
  });

  it("inserts a row via the service", () => {
    const [row] = service.insert("Charlie");
    expect(row.name).toBe("Charlie");
  });

  it("queries rows via the service", () => {
    service.insert("Dave");
    const all = service.findAll();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it("filters rows via the service", () => {
    service.insert("Eve");
    const result = service.findByName("Eve");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Eve");
  });
});

// ── aliases ───────────────────────────────────────────────────────────────────

describe("DrizzleModule.register / registerAsync aliases", () => {
  it("register is an alias for forRoot", () => {
    const { db, sqlite } = makeDb();
    const a = DrizzleModule.forRoot({ db });
    const b = DrizzleModule.register({ db });
    sqlite.close();

    expect(b.module).toBe(a.module);
    expect(b.exports).toEqual(a.exports);
  });

  it("registerAsync is an alias for forRootAsync", () => {
    const factory = () => makeDb();
    const a = DrizzleModule.forRootAsync({ useFactory: factory });
    const b = DrizzleModule.registerAsync({ useFactory: factory });

    expect(b.module).toBe(a.module);
    expect(b.exports).toEqual(a.exports);
  });
});
