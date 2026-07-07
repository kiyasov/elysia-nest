import type { Provider } from "nestelia";

import { getDrizzleOptionsToken } from "./drizzle.constants";
import type {
  DrizzleModuleAsyncOptions,
  DrizzleModuleOptions,
  DrizzleOptionsFactory,
} from "./interfaces/drizzle-module.interface";

/**
 * Builds the provider that exposes the drizzle db instance under `token`.
 *
 * Injects the options from the per-instance token derived from `token`, so
 * multiple registrations never share (and overwrite) a single options token.
 *
 * @internal
 */
export function createDrizzleProvider(token: string | symbol): Provider {
  return {
    provide: token,
    useFactory: (options: DrizzleModuleOptions) => options.db,
    inject: [getDrizzleOptionsToken(token)],
  };
}

/**
 * Builds the async providers needed to resolve the per-instance options
 * token from a factory, class, or existing provider.
 *
 * @param options - Async configuration options.
 * @param token - The drizzle instance token these options belong to.
 *
 * @internal
 */
export function createDrizzleAsyncProviders(
  options: DrizzleModuleAsyncOptions,
  token: string | symbol,
): Provider[] {
  const optionsToken = getDrizzleOptionsToken(token);

  if (options.useFactory) {
    return [
      {
        provide: optionsToken,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      },
    ];
  }

  if (options.useClass) {
    return [
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      {
        provide: optionsToken,
        useFactory: (factory: DrizzleOptionsFactory) =>
          factory.createDrizzleOptions(),
        inject: [options.useClass],
      },
    ];
  }

  if (options.useExisting) {
    return [
      {
        provide: optionsToken,
        useFactory: (factory: DrizzleOptionsFactory) =>
          factory.createDrizzleOptions(),
        inject: [options.useExisting],
      },
    ];
  }

  return [];
}
