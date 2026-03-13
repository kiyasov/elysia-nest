import "reflect-metadata";

import { Module } from "nestelia";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CacheService } from "./cache.service";
import { DatabaseService } from "./database.service";

@Module({
  controllers: [AppController],
  providers: [DatabaseService, CacheService, AppService],
})
export class AppModule {}
