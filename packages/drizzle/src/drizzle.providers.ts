import type { Provider } from "nestelia";

import { DRIZZLE_MODULE_OPTIONS } from "./drizzle.constants";
import type {
  DrizzleModuleAsyncOptions,
  DrizzleModuleOptions,
  DrizzleOptionsFactory,
} from "./interfaces/drizzle-module.interface";

/**
 * Builds the provider that exposes the drizzle db instance under `token`.
 *
 * @internal
 */
export function createDrizzleProvider(token: string | symbol): Provider {
  return {
    provide: token,
    useFactory: (options: DrizzleModuleOptions) => options.db,
    inject: [DRIZZLE_MODULE_OPTIONS],
  };
}

/**
 * Builds the async providers needed to resolve `DRIZZLE_MODULE_OPTIONS`
 * from a factory, class, or existing provider.
 *
 * @internal
 */
export function createDrizzleAsyncProviders(
  options: DrizzleModuleAsyncOptions,
): Provider[] {
  if (options.useFactory) {
    return [
      {
        provide: DRIZZLE_MODULE_OPTIONS,
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
        provide: DRIZZLE_MODULE_OPTIONS,
        useFactory: (factory: DrizzleOptionsFactory) =>
          factory.createDrizzleOptions(),
        inject: [options.useClass],
      },
    ];
  }

  if (options.useExisting) {
    return [
      {
        provide: DRIZZLE_MODULE_OPTIONS,
        useFactory: (factory: DrizzleOptionsFactory) =>
          factory.createDrizzleOptions(),
        inject: [options.useExisting],
      },
    ];
  }

  return [];
}
