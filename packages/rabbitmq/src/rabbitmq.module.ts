import { Module, Injectable, Inject, Container } from "nestelia";
import type { DynamicModule, Provider, ProviderToken, LoggerService } from "nestelia";
import { Logger, createMethodMetadataCache } from "nestelia";
import { AmqpConnection } from "./amqp/connection";
import { AmqpConnectionManager } from "./amqp/connectionManager";
import { convertUriConfigObjectsToUris, validateRabbitMqUris } from "./amqp/utils";
import {
  RABBIT_HANDLER,
  RABBIT_CONFIG_TOKEN,
  RABBIT_PARAM_TYPE,
  RABBIT_HEADER_TYPE,
  RABBIT_REQUEST_TYPE,
} from "./rabbitmq.constants";
import {
  RABBIT_PAYLOAD_METADATA,
  RABBIT_HEADER_METADATA,
  RABBIT_REQUEST_METADATA,
} from "./decorators/rabbitmq.decorators";
import type {
  RabbitMQConfig,
  RabbitHandlerConfig,
  MessageHandlerOptions,
  RabbitMQHandlers,
} from "./interfaces/rabbitmq.interface";

/**
 * Resolves the list of per-registration handler configs for a given handler.
 */
export function resolveHandlerConfigs(
  handlers: RabbitMQHandlers,
  lookupKey: string | undefined,
): (MessageHandlerOptions | undefined)[] {
  if (!lookupKey) {
    return [undefined];
  }
  if (!Object.prototype.hasOwnProperty.call(handlers, lookupKey)) {
    return [];
  }
  const raw = handlers[lookupKey];
  if (Array.isArray(raw)) {
    return raw;
  }
  return [raw];
}

// ── Parameter decorator resolution ─────────────────────────────────

interface ParamMeta {
  index: number;
  propertyKey?: string;
  type: number;
}

interface CachedRabbitParams {
  payload: ParamMeta[];
  header: ParamMeta[];
  request: ParamMeta[];
}

const rabbitParamCache = createMethodMetadataCache<CachedRabbitParams>();

function getCachedParams(proto: object, methodName: string | symbol): CachedRabbitParams {
  return rabbitParamCache.get(proto, methodName, () => ({
    payload: Reflect.getMetadata(RABBIT_PAYLOAD_METADATA, proto, methodName) || [],
    header: Reflect.getMetadata(RABBIT_HEADER_METADATA, proto, methodName) || [],
    request: Reflect.getMetadata(RABBIT_REQUEST_METADATA, proto, methodName) || [],
  }));
}

function resolveHandlerArgs(
  instance: object,
  methodName: string | symbol,
  message: unknown,
  rawMessage: unknown,
  headers: unknown,
): unknown[] {
  const proto = Object.getPrototypeOf(instance);
  const { payload: payloadMeta, header: headerMeta, request: requestMeta } =
    getCachedParams(proto, methodName);

  const allMeta = [...payloadMeta, ...headerMeta, ...requestMeta];

  // No parameter decorators — pass (message, rawMessage, headers) directly
  if (allMeta.length === 0) {
    return [message, rawMessage, headers];
  }

  const maxIndex = Math.max(...allMeta.map((m) => m.index));
  const args = new Array(maxIndex + 1);

  for (const meta of allMeta) {
    let value: unknown;
    if (meta.type === RABBIT_PARAM_TYPE) {
      value =
        meta.propertyKey && message && typeof message === "object"
          ? (message as Record<string, unknown>)[meta.propertyKey]
          : message;
    } else if (meta.type === RABBIT_HEADER_TYPE) {
      value =
        meta.propertyKey && headers && typeof headers === "object"
          ? (headers as Record<string, unknown>)[meta.propertyKey]
          : headers;
    } else if (meta.type === RABBIT_REQUEST_TYPE) {
      value =
        meta.propertyKey && rawMessage && typeof rawMessage === "object"
          ? (rawMessage as Record<string, unknown>)[meta.propertyKey]
          : rawMessage;
    }
    args[meta.index] = value;
  }

  return args;
}

// ── Module ─────────────────────────────────────────────────────────

export interface RabbitMQModuleOptions extends RabbitMQConfig {
  isGlobal?: boolean;
}

@Module({
  providers: [],
  exports: [],
})
export class RabbitMQModule {
  /**
   * Shared manager that owns every named connection created through this
   * module. Kept static so that multiple `forRoot`/`forRootAsync`
   * registrations (one per named connection) share a single registry, and so
   * the shutdown hook can close them all.
   */
  static readonly connectionManager = new AmqpConnectionManager();

  /**
   * Names of connections whose handlers have already been registered. The
   * bootstrap guard is PER-CONNECTION (not a single boolean) so that every
   * named connection registers its handlers exactly once — a single boolean
   * would let the first connection's bootstrap suppress all the others.
   */
  private static readonly bootstrappedConnections = new Set<string>();

  /**
   * Marks a connection as bootstrapped. Returns `true` when it was already
   * bootstrapped (the caller should skip re-registration) and `false` on the
   * first call for that connection name.
   * @internal
   */
  static markConnectionBootstrapped(name: string): boolean {
    if (RabbitMQModule.bootstrappedConnections.has(name)) {
      return true;
    }
    RabbitMQModule.bootstrappedConnections.add(name);
    return false;
  }

  /**
   * Clears the per-connection bootstrap guard. Called on shutdown so a
   * subsequent boot (e.g. across test suites) re-registers handlers.
   * @internal
   */
  static resetBootstrapGuard(): void {
    RabbitMQModule.bootstrappedConnections.clear();
  }

  static async AmqpConnectionFactory(
    config: RabbitMQConfig,
  ): Promise<AmqpConnection | undefined> {
    const logger: LoggerService =
      config?.logger || new Logger(RabbitMQModule.name);
    if (config == undefined) {
      logger.log?.(
        "RabbitMQ config not provided, skipping connection initialization.",
      );
      return undefined;
    }

    config.uri = convertUriConfigObjectsToUris(config.uri) as unknown as string;
    validateRabbitMqUris(config.uri as unknown as string[]);

    const connection = new AmqpConnection(config);
    this.connectionManager.addConnection(connection);
    await connection.init();
    logger.log?.("Successfully connected to RabbitMQ");
    return connection;
  }

  static forRoot(options: RabbitMQModuleOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: AmqpConnection,
      useFactory: async () => {
        await RabbitMQModule.AmqpConnectionFactory(options);
        const conn = RabbitMQModule.connectionManager.getConnection(
          options?.name || "default",
        );
        return conn!;
      },
    };

    const connectionManagerProvider: Provider = {
      provide: AmqpConnectionManager,
      useFactory: () => RabbitMQModule.connectionManager,
    };

    const configProvider: Provider = {
      provide: RABBIT_CONFIG_TOKEN,
      useValue: options,
    };

    return {
      module: RabbitMQModule,
      global: options.isGlobal,
      providers: [
        connectionProvider,
        connectionManagerProvider,
        configProvider,
        RabbitMQExplorer,
      ],
      exports: [AmqpConnection, AmqpConnectionManager, RABBIT_CONFIG_TOKEN],
    };
  }

  static forRootAsync(options: {
    useFactory: (
      ...args: unknown[]
    ) => Promise<RabbitMQModuleOptions> | RabbitMQModuleOptions;
    inject?: Array<
      ProviderToken | { token: ProviderToken; optional?: boolean }
    >;
    isGlobal?: boolean;
  }): DynamicModule {
    const inject = options.inject || [];

    const configProvider: Provider = {
      provide: RABBIT_CONFIG_TOKEN,
      useFactory: options.useFactory,
      inject,
    };

    const connectionProvider: Provider = {
      provide: AmqpConnection,
      useFactory: async (config: RabbitMQConfig) => {
        await RabbitMQModule.AmqpConnectionFactory(config);
        const conn = RabbitMQModule.connectionManager.getConnection(
          config?.name || "default",
        );
        return conn!;
      },
      inject: [RABBIT_CONFIG_TOKEN],
    };

    const connectionManagerProvider: Provider = {
      provide: AmqpConnectionManager,
      useFactory: () => RabbitMQModule.connectionManager,
    };

    return {
      module: RabbitMQModule,
      global: options.isGlobal,
      providers: [
        configProvider,
        connectionProvider,
        connectionManagerProvider,
        RabbitMQExplorer,
      ],
      exports: [AmqpConnection, AmqpConnectionManager, RABBIT_CONFIG_TOKEN],
    };
  }

  static forFeature(handlers: unknown[]): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: handlers as Provider[],
      exports: handlers as Provider[],
    };
  }

  static attach(connection: AmqpConnection): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [
        {
          provide: AmqpConnection,
          useValue: connection,
        },
      ],
      exports: [AmqpConnection],
    };
  }
}

// ── Explorer ───────────────────────────────────────────────────────

@Injectable()
export class RabbitMQExplorer {
  private readonly logger = new Logger(RabbitMQExplorer.name);

  constructor(
    @Inject(AmqpConnectionManager)
    private readonly connectionManager: AmqpConnectionManager,
  ) {}

  async onModuleInit(): Promise<void> {
    // Bootstrap EVERY registered connection. A single shared explorer instance
    // is injected with the connection manager (not one connection), so each
    // named connection registers its own handlers exactly once — multi-
    // connection setups no longer silently drop the second connection's
    // handlers.
    for (const connection of this.connectionManager.getConnections()) {
      await this.bootstrapConnection(connection);
    }
  }

  private async bootstrapConnection(connection: AmqpConnection): Promise<void> {
    const config = connection.configuration;

    if (config.registerHandlers === false) {
      this.logger.log(
        "Skipping RabbitMQ Handlers due to configuration.",
      );
      return;
    }

    // Per-connection guard: register this connection's handlers only once.
    if (RabbitMQModule.markConnectionBootstrapped(config.name)) {
      return;
    }

    this.logger.log("Initializing RabbitMQ Handlers");

    const container = Container.instance;
    const processedTokens = new Set<unknown>();

    for (const moduleRef of container.getModules().values()) {
      for (const [token, wrapper] of moduleRef.getProviders()) {
        if (processedTokens.has(token)) continue;
        processedTokens.add(token);

        if (!wrapper.metatype || typeof wrapper.metatype !== "function")
          continue;

        const proto = wrapper.metatype.prototype;
        if (!proto) continue;

        // Check if any method has RABBIT_HANDLER metadata
        const methodNames = Object.getOwnPropertyNames(proto).filter(
          (name) => name !== "constructor",
        );

        const handlerMethods = methodNames.filter((name) =>
          Reflect.getMetadata(RABBIT_HANDLER, proto, name),
        );

        if (handlerMethods.length === 0) continue;

        try {
          const instance = await container.get(token);
          if (!instance) continue;

          const className =
            (wrapper.metatype as { name?: string }).name ?? String(token);
          this.logger.log(`Registering rabbitmq handlers from ${className}`);

          for (const methodName of handlerMethods) {
            const handlerConfig = Reflect.getMetadata(
              RABBIT_HANDLER,
              proto,
              methodName,
            ) as RabbitHandlerConfig;

            if (
              handlerConfig.connection &&
              handlerConfig.connection !== config.name
            ) {
              continue;
            }

            const originalMethod = (instance as Record<string, Function>)[
              methodName
            ];
            if (typeof originalMethod !== "function") continue;

            // Create bound handler that resolves parameter decorators
            const boundHandler = async (
              msg: unknown,
              rawMessage: unknown,
              headers: unknown,
            ) => {
              const args = resolveHandlerArgs(
                instance as object,
                methodName,
                msg,
                rawMessage,
                headers,
              );
              return originalMethod.apply(instance, args);
            };

            const handlerDisplayName = `${className}.${methodName} {${handlerConfig.type}} -> ${
              handlerConfig.queueOptions?.channel
                ? `${handlerConfig.queueOptions.channel}::`
                : ""
            }${handlerConfig.exchange}::${handlerConfig.routingKey}::${handlerConfig.queue || "amqpgen"}`;

            // Resolve module-level handler configs
            const handlerLookupKey =
              handlerConfig.name || config.defaultHandler;

            const moduleHandlerConfigs = resolveHandlerConfigs(
              config.handlers,
              handlerLookupKey,
            );

            for (const moduleHandlerConfig of moduleHandlerConfigs) {
              const mergedConfig: RabbitHandlerConfig = {
                ...handlerConfig,
                ...moduleHandlerConfig,
                type: handlerConfig.type,
              };

              if (
                mergedConfig.type === "rpc" &&
                !config.enableDirectReplyTo
              ) {
                this.logger.warn(
                  `Direct Reply-To is disabled. RPC handler ${handlerDisplayName} will not be registered`,
                );
                continue;
              }

              this.logger.log(handlerDisplayName);

              try {
                switch (mergedConfig.type) {
                  case "rpc":
                    await connection.createRpc(
                      boundHandler,
                      mergedConfig,
                    );
                    break;

                  case "subscribe":
                    if (mergedConfig.batchOptions) {
                      await connection.createBatchSubscriber(
                        boundHandler as (
                          msg: (unknown | undefined)[],
                          rawMessage?: unknown[],
                          headers?: unknown[],
                        ) => Promise<void>,
                        mergedConfig,
                      );
                    } else {
                      await connection.createSubscriber(
                        boundHandler,
                        mergedConfig,
                        methodName,
                      );
                    }
                    break;

                  default:
                    throw new Error(
                      `Unexpected handler type ${mergedConfig.type}`,
                    );
                }
              } catch (err) {
                this.logger.error(
                  `Failed to register handler ${handlerDisplayName}: ${(err as Error).message}`,
                );
              }
            }
          }
        } catch (err) {
          const name =
            (wrapper.metatype as { name?: string }).name ?? String(token);
          this.logger.error(
            `Failed to register RabbitMQ handlers for ${name}: ${(err as Error).message}`,
          );
        }
      }
    }
  }

  async onApplicationShutdown(): Promise<void> {
    this.logger.verbose?.("Closing AMQP Connections");
    // Close ALL managed connections, not just one — otherwise every extra
    // named connection leaks its sockets/channels until process exit. The
    // manager awaits each AmqpConnection.close().
    await this.connectionManager.close();
    RabbitMQModule.resetBootstrapGuard();
  }
}
