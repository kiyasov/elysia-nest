import { t } from "elysia";

import { Body, Controller, Get, Post } from "nestelia";

import { OrdersService } from "./orders.service";

@Controller("/orders")
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get("/")
  findAll() {
    return this.orders.findAll();
  }

  @Post("/")
  create(
    @Body(t.Object({ userId: t.Number(), item: t.String() }))
    body: { userId: number; item: string },
  ) {
    return this.orders.create(body.userId, body.item);
  }
}
