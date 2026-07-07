import type {
  OnApplicationBootstrap,
  OnModuleInit,
} from "../interfaces/lifecycle.interface";
import { Logger } from "../logger";

/**
 * Class to manage lifecycle hooks across the application
 */
export class LifecycleManager {
  private providers: any[] = [];
  private bootstrapTriggered = false;

  /**
   * Invoke `hookName` on every registered provider that implements it, awaiting
   * the result so async hooks (DB/connection close, worker drain) fully settle
   * before the phase is considered complete. Runs best-effort: a throwing or
   * rejecting hook is logged and does NOT prevent the remaining providers'
   * hooks — or the later shutdown phases — from running.
   */
  private async runHook(
    hookName:
      | "onModuleDestroy"
      | "beforeApplicationShutdown"
      | "onApplicationShutdown",
  ): Promise<void> {
    for (const provider of this.providers) {
      if (typeof provider !== "object" || provider === null) continue;
      const hook = (provider as Record<string, unknown>)[hookName];
      if (typeof hook !== "function") continue;
      try {
        await (hook as () => unknown).call(provider);
      } catch (error) {
        Logger.error(
          `Error in ${hookName} hook: ${
            error instanceof Error ? error.stack ?? error.message : String(error)
          }`,
          "LifecycleManager",
        );
      }
    }
  }

  /**
   * Register a provider with lifecycle hooks
   */
  public register(provider: any) {
    if (provider) {
      this.providers.push(provider);
    }
  }

  /**
   * Trigger onModuleInit hooks for all registered providers
   */
  public triggerOnModuleInit() {
    for (const provider of this.providers) {
      if (
        typeof provider === "object" &&
        (provider as OnModuleInit).onModuleInit
      ) {
        (provider as OnModuleInit).onModuleInit();
      }
    }
  }

  /**
   * Trigger onApplicationBootstrap hooks for all registered providers
   */
  public triggerOnApplicationBootstrap() {
    // Idempotent: bootstrap runs once per application, whether triggered by
    // createElysiaApplication (init) or a later listen() call.
    if (this.bootstrapTriggered) return;
    this.bootstrapTriggered = true;
    for (const provider of this.providers) {
      if (
        typeof provider === "object" &&
        (provider as OnApplicationBootstrap).onApplicationBootstrap
      ) {
        (provider as OnApplicationBootstrap).onApplicationBootstrap();
      }
    }
  }

  /**
   * Trigger onModuleDestroy hooks for all registered providers.
   * Awaits async hooks so cleanup completes before the caller proceeds.
   */
  public async triggerOnModuleDestroy(): Promise<void> {
    await this.runHook("onModuleDestroy");
  }

  /**
   * Trigger beforeApplicationShutdown hooks for all registered providers.
   * Awaits async hooks so cleanup completes before the caller proceeds.
   */
  public async triggerBeforeApplicationShutdown(): Promise<void> {
    await this.runHook("beforeApplicationShutdown");
  }

  /**
   * Clear all registered providers to prevent memory leaks
   */
  public clear(): void {
    this.providers = [];
    this.bootstrapTriggered = false;
  }

  /**
   * Trigger onApplicationShutdown hooks for all registered providers.
   * Awaits async hooks so cleanup completes before the caller proceeds.
   */
  public async triggerOnApplicationShutdown(): Promise<void> {
    await this.runHook("onApplicationShutdown");
  }
}

// Global lifecycle manager instance
let lifecycleManager: LifecycleManager | null = null;

/**
 * Get the global lifecycle manager instance
 */
export function getLifecycleManager(): LifecycleManager {
  if (!lifecycleManager) {
    lifecycleManager = new LifecycleManager();
  }
  return lifecycleManager;
}
