import { Injectable, OnApplicationBootstrap } from "nestelia";

import { CacheService } from "./cache.service";
import { DatabaseService } from "./database.service";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private readonly db: DatabaseService,
    private readonly cache: CacheService,
  ) {}

  // onApplicationBootstrap fires after all modules are fully initialized
  onApplicationBootstrap() {
    console.log(
      `[AppService] App ready — db: ${this.db.isConnected()}, cache: ${this.cache.isReady()}`,
    );
  }

  status() {
    return {
      db: this.db.isConnected(),
      cache: this.cache.isReady(),
      dbUrl: this.db.getUrl(),
    };
  }
}
