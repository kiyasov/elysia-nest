import { Injectable } from "nestelia";
import type { OnModuleDestroy, OnModuleInit } from "nestelia";

import { clearStrategyRegistries } from "./passport-strategy";

/**
 * DI-managed provider that clears the module-level strategy registries when the
 * application shuts down, preventing the global `passport` singleton and the
 * local registries from pinning strategy instances (and their injected
 * dependencies) for the lifetime of the process.
 *
 * Registered in {@link PassportModule}'s providers so the framework resolves a
 * real instance and wires its lifecycle hooks — unlike a `@Module`-decorated
 * class, whose lifecycle methods are never invoked (the decorator replaces the
 * class with a factory function that is never instantiated).
 *
 * `onModuleInit` is intentionally implemented (even though it is a no-op):
 * nestelia only registers a provider's `onModuleDestroy` hook when the provider
 * also implements `onModuleInit`.
 *
 * @internal
 */
@Injectable()
export class PassportCleanupService implements OnModuleInit, OnModuleDestroy {
  onModuleInit(): void {
    // No-op. Present so the framework registers the onModuleDestroy hook.
  }

  onModuleDestroy(): void {
    clearStrategyRegistries();
  }
}
