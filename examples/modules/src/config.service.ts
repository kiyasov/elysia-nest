import { Injectable } from "nestelia";

@Injectable()
export class ConfigService {
  private readonly store = new Map<string, string>([
    ["APP_NAME", "nestelia-modules-example"],
    ["MAX_USERS", "100"],
  ]);

  get(key: string): string {
    return this.store.get(key) ?? "";
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }
}
