import { Injectable } from "nestelia";

import { ConfigService } from "./config.service";

export interface User {
  id: number;
  name: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  // ConfigService comes from the global ConfigModule — no explicit import needed
  constructor(private readonly config: ConfigService) {}

  findAll(): User[] {
    return this.users;
  }

  create(name: string): User | { error: string } {
    const max = Number(this.config.get("MAX_USERS"));
    if (this.users.length >= max) {
      return { error: `User limit of ${max} reached` };
    }
    const user: User = { id: this.nextId++, name };
    this.users.push(user);
    return user;
  }
}
