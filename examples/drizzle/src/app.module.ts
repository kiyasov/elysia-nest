import "reflect-metadata";

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Module } from "nestelia";

import { DrizzleModule } from "../../../packages/drizzle/src";
import { users } from "./schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

// Create and seed an in-memory SQLite database
const sqlite = new Database(":memory:");
const db = drizzle(sqlite, { schema: { users } });

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

db.run(`INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob',   'bob@example.com')`);

@Module({
  imports: [
    DrizzleModule.forRoot({ db, isGlobal: true }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
