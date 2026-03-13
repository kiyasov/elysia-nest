import { Global, Module } from "nestelia";

import { ConfigService } from "./config.service";

// @Global() makes ConfigService available in every module
// without needing to import ConfigModule explicitly.
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
