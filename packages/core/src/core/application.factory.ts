import { ElysiaNestApplication } from "../../../../packages/microservices/elysia-nest-application";
import { APP_FILTERS_METADATA, MODULE_METADATA } from "../decorators/constants";
import type { ModuleOptions } from "../decorators/types";
import { Container, type Type } from "../di";
import type { ExceptionFilter } from "../exceptions";
import type { LoggerService, LogLevel } from "../logger";
import { Logger } from "../logger";
import { validateTsConfig } from "./helpers";
import { initializeSingletonProviders } from "./module.utils";

// Module factory type - accepts any function (module created by @Module decorator)
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type ModuleFactory = Function;

export interface ApplicationOptions {
  /** Override the default logger. Pass `false` to disable logging entirely, or an array of LogLevel to filter. */
  logger?: LoggerService | LogLevel[] | false;
}

/**
 * Creates an Elysia-Nest application with microservices support.
 *
 * @param rootModule Root module decorated with @Module()
 * @param options Application options (logger, etc.)
 * @returns ElysiaNestApplication instance
 *
 * @example
 * ```typescript
 * const app = await createElysiaApplication(AppModule);
 *
 * // Disable logging
 * const app = await createElysiaApplication(AppModule, { logger: false });
 *
 * // Custom log levels
 * const app = await createElysiaApplication(AppModule, { logger: ['error', 'warn'] });
 * ```
 */
export async function createElysiaApplication(
  rootModule: ModuleFactory,
  options?: ApplicationOptions,
): Promise<ElysiaNestApplication> {
  if (options?.logger !== undefined) {
    Logger.overrideLogger(options.logger);
  }

  validateTsConfig();
  Container.instance.beginInitSession();

  const elysiaApp = await rootModule();

  // All modules are now registered and import relationships are fully wired.
  // Call initializeSingletonProviders once here so that cross-module dependency
  // lookups succeed for every provider regardless of initialization order.
  await initializeSingletonProviders();

  // Get module metadata to extract controllers
  const moduleMetadata: ModuleOptions = Reflect.getMetadata(MODULE_METADATA, rootModule) || {};
  const controllers = moduleMetadata.controllers || [];

  const nestApp = new ElysiaNestApplication(elysiaApp);
  nestApp.setControllers(controllers);

  // Extract and apply APP_FILTER providers from the module
  const appFilters =
    (Reflect.getMetadata(APP_FILTERS_METADATA, rootModule) as
      | Array<ExceptionFilter | Type<ExceptionFilter>>
      | undefined) || [];
  if (appFilters.length > 0) {
    nestApp.useGlobalFilters(...appFilters);
    nestApp.initGlobalFilters();
  }

  return nestApp;
}
