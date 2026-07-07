import { Module } from "nestelia";

import { PassportCleanupService } from "./passport-cleanup.service";

/**
 * PassportModule registers {@link PassportCleanupService}, which clears the
 * strategy registries on application shutdown to prevent memory leaks across
 * application restarts.
 *
 * Note: the cleanup MUST live on an injectable provider, not on this module
 * class. `@Module` replaces the class with a factory function that is never
 * instantiated, so lifecycle hooks declared here would never fire.
 */
@Module({
  providers: [PassportCleanupService],
})
export class PassportModule {}
