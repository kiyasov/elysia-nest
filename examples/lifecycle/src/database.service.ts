import { Injectable, OnModuleDestroy, OnModuleInit } from "nestelia";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private connected = false;
  private url = "";

  async onModuleInit() {
    this.url = "postgres://localhost:5432/app";
    this.connected = true;
    console.log(`[DatabaseService] Connected to ${this.url}`);
  }

  async onModuleDestroy() {
    this.connected = false;
    console.log("[DatabaseService] Disconnected");
  }

  isConnected(): boolean {
    return this.connected;
  }

  getUrl(): string {
    return this.url;
  }
}
