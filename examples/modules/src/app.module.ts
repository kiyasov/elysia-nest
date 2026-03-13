import "reflect-metadata";

import { Module } from "nestelia";

import { ConfigModule } from "./config.module";
import { OrdersModule } from "./orders.module";
import { UsersModule } from "./users.module";

@Module({
  imports: [ConfigModule, UsersModule, OrdersModule],
})
export class AppModule {}
