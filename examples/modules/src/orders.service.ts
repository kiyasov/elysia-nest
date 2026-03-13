import { Injectable } from "nestelia";

import { ConfigService } from "./config.service";
import { UsersService } from "./users.service";

export interface Order {
  id: number;
  userId: number;
  item: string;
}

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private nextId = 1;

  // UsersService comes from the imported UsersModule.
  // ConfigService comes from the global ConfigModule.
  constructor(
    private readonly users: UsersService,
    private readonly config: ConfigService,
  ) {}

  findAll(): Order[] {
    return this.orders;
  }

  create(userId: number, item: string): Order | { error: string } {
    const user = this.users.findAll().find((u) => u.id === userId);
    if (!user) {
      return { error: `User ${userId} not found` };
    }
    const order: Order = { id: this.nextId++, userId, item };
    this.orders.push(order);
    return order;
  }

  appName(): string {
    return this.config.get("APP_NAME");
  }
}
