import { ElysiaNestApplication } from "../../../../packages/microservices/elysia-nest-application";
import { APP_FILTERS_METADATA, MODULE_METADATA } from "../decorators/constants";
import type { ModuleOptions } from "../decorators/types";
import type { Type } from "../di";
import type { ExceptionFilter } from "../exceptions";
import { validateTsConfig } from "./helpers";

// Module factory type - accepts any function (module created by @Module decorator)
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type ModuleFactory = Function;

/**
 * Creates an Elysia-Nest application with microservices support.
 *
 * @param rootModule Root module decorated with @Module()
 * @returns ElysiaNestApplication instance
 *
 * @example
 * ```typescript
 * const app = await createElysiaApplication(AppModule);
 *
 * // Connect Redis microservice
 * app.connectMicroservice({
 *   transport: Transport.REDIS,
 *   options: {
 *     host: 'localhost',
 *     port: 6379
 *   }
 * });
 *
 * // Start all microservices
 * await app.startAllMicroservices();
 *
 * // Start HTTP server
 * await app.listen(3000);
 * ```
 */
export async function createElysiaApplication(
  rootModule: ModuleFactory,
): Promise<ElysiaNestApplication> {
  validateTsConfig();

  const elysiaApp = await rootModule();

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
