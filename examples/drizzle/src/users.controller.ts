import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from "nestelia";

import { UsersService } from "./users.service";
import { type NewUser } from "./schema";

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  findAll() {
    return this.usersService.findAll();
  }

  @Get("/:id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Post("/")
  create(@Body() body: NewUser) {
    return this.usersService.create(body);
  }

  @Delete("/:id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }
}
