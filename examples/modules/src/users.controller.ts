import { t } from "elysia";

import { Body, Controller, Get, Post } from "nestelia";

import { UsersService } from "./users.service";

@Controller("/users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("/")
  findAll() {
    return this.users.findAll();
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.users.create(body.name);
  }
}
