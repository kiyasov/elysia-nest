import { Controller, Get } from "nestelia";

import { AppService } from "./app.service";

@Controller("")
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get("/status")
  status() {
    return this.app.status();
  }
}
