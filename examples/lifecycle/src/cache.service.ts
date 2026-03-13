import { Injectable, ModuleRef, OnModuleInit } from "nestelia";

import { DatabaseService } from "./database.service";

@Injectable()
export class CacheService implements OnModuleInit {
  private ready = false;
  private dbUrl = "";

  // ModuleRef is injected automatically by the framework
  constructor(private readonly moduleRef: ModuleRef) {}

  // onModuleInit runs after ALL providers are loaded, so
  // DatabaseService is guaranteed to be resolved here.
  onModuleInit() {
    const db = this.moduleRef.get(DatabaseService);
    this.dbUrl = db.getUrl();
    this.ready = true;
    console.log(`[CacheService] Initialized, connected to db at ${this.dbUrl}`);
  }

  isReady(): boolean {
    return this.ready;
  }

  getDbUrl(): string {
    return this.dbUrl;
  }
}
