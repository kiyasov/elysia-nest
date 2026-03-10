import { Injectable, NotFoundException } from "nestelia";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";

import { InjectDrizzle } from "../../../packages/drizzle/src";
import { users, type NewUser, type User } from "./schema";

type DB = ReturnType<typeof drizzle<{ users: typeof users }>>;

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: DB) {}

  findAll(): User[] {
    return this.db.select().from(users).all();
  }

  findOne(id: number): User {
    const [user] = this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .all();

    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  create(dto: NewUser): User {
    const [created] = this.db
      .insert(users)
      .values(dto)
      .returning()
      .all();
    return created;
  }

  remove(id: number): { deleted: boolean } {
    const result = this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning()
      .all();
    return { deleted: result.length > 0 };
  }
}
