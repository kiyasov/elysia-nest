import {
  type ConnectionOptions,
  type Job,
  type JobsOptions,
  Queue,
  type WorkerOptions,
  Worker,
} from "bullmq";
import IORedis, { type Redis, type RedisOptions } from "ioredis";
import { Inject, Injectable, Logger } from "nestelia";

import { BULLMQ_MODULE_OPTIONS } from "./bullmq.constants";
import type {
  AddJobOptions,
  DelayDuration,
  QueueModuleOptions,
} from "./interfaces";
import { durationToMs } from "./utils";

/**
 * Processor function executed for every job pulled from a queue.
 */
export type JobProcessor = (job: Job) => Promise<unknown> | unknown;

/**
 * Injectable producer/consumer facade over BullMQ.
 *
 * Producing side — enqueue jobs with {@link add} / {@link addDelayed}.
 * Consuming side — workers are normally wired automatically from `@Processor`
 * classes by the {@link QueueExplorer}, but {@link registerWorker} is available
 * for manual registration.
 *
 * Queues are created lazily and cached per name. A single shared `ioredis`
 * client (built once from {@link QueueModule.forRoot}'s connection options, or
 * the ready-made client supplied there) backs every queue and worker instead of
 * BullMQ opening a fresh socket per instance. BullMQ transparently
 * `.duplicate()`s this client for the blocking connections that workers and
 * queue-events require, so an app with N queues + N processors keeps its Redis
 * connection count bounded rather than paying two sockets per queue.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class EmailService {
 *   constructor(private readonly queue: QueueService) {}
 *
 *   async sendWelcome(userId: string) {
 *     await this.queue.add("email", { userId }, { attempts: 3 });
 *   }
 * }
 * ```
 */
@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private readonly queues = new Map<string, Queue>();
  private readonly workers = new Map<string, Worker>();
  private readonly connection: ConnectionOptions;
  private readonly prefix?: string;
  private readonly defaultJobOptions?: JobsOptions;

  /** The single ioredis client shared by every queue and worker. */
  private sharedConnection?: Redis;
  /** Whether this service constructed (and therefore must close) the client. */
  private ownsConnection = false;

  constructor(
    @Inject(BULLMQ_MODULE_OPTIONS) options: QueueModuleOptions,
  ) {
    this.connection = options.connection;
    this.prefix = options.prefix;
    this.defaultJobOptions = options.defaultJobOptions;
  }

  /**
   * Resolve the single shared ioredis client backing every queue and worker.
   *
   * When the module was configured with a ready-made client, that client is
   * reused as-is and its lifecycle stays with the caller. When configured with
   * plain connection options, exactly one client is constructed on first use
   * and cached, so N queues + N workers share one base connection instead of
   * opening a socket each. `maxRetriesPerRequest: null` puts the client in the
   * blocking-capable mode BullMQ requires for workers/queue-events, and
   * `lazyConnect` defers the socket to the first command so construction stays
   * side-effect free. BullMQ `.duplicate()`s this client where a dedicated
   * blocking connection is needed.
   */
  private getConnection(): Redis {
    if (this.sharedConnection) return this.sharedConnection;

    const configured = this.connection as unknown;
    if (QueueService.isRedisClient(configured)) {
      this.sharedConnection = configured as Redis;
      this.ownsConnection = false;
      return this.sharedConnection;
    }

    this.sharedConnection = new IORedis({
      lazyConnect: true,
      ...(configured as RedisOptions),
      maxRetriesPerRequest: null,
    });
    this.ownsConnection = true;
    return this.sharedConnection;
  }

  /**
   * Duck-type check: a ready-made ioredis/cluster client exposes a
   * `duplicate()` method, whereas a plain `RedisOptions` object does not.
   */
  private static isRedisClient(value: unknown): value is Redis {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as { duplicate?: unknown }).duplicate === "function"
    );
  }

  /**
   * Get (creating and caching on first use) the producer {@link Queue} for
   * `name`.
   */
  getQueue(name: string): Queue {
    let queue = this.queues.get(name);
    if (!queue) {
      queue = new Queue(name, {
        // A live IORedis client is a valid ConnectionOptions at runtime (BullMQ
        // reuses it and duplicates only for blocking connections); the cast
        // bridges a type-identity skew between our ioredis import and BullMQ's.
        connection: this.getConnection() as ConnectionOptions,
        prefix: this.prefix,
        defaultJobOptions: this.defaultJobOptions,
      });
      this.queues.set(name, queue);
    }
    return queue;
  }

  /**
   * Enqueue a job. The job name defaults to the queue name; pass
   * `options.name` to target a specific `@Process({ name })` handler.
   */
  async add<T = unknown>(
    queueName: string,
    data: T,
    options: AddJobOptions = {},
  ): Promise<Job<T>> {
    const { name, ...jobOptions } = options;
    return this.getQueue(queueName).add(
      name ?? queueName,
      data,
      jobOptions,
    ) as Promise<Job<T>>;
  }

  /**
   * Enqueue a job to run after a delay, expressed as milliseconds or a
   * {@link DelayDuration} object.
   */
  async addDelayed<T = unknown>(
    queueName: string,
    data: T,
    delay: DelayDuration | number,
    options: AddJobOptions = {},
  ): Promise<Job<T>> {
    return this.add(queueName, data, {
      ...options,
      delay: durationToMs(delay),
    });
  }

  /**
   * Create and track a {@link Worker} for `queueName`. At most one worker per
   * queue is created; a second registration is ignored with a warning.
   */
  registerWorker(
    queueName: string,
    processor: JobProcessor,
    options: Omit<Partial<WorkerOptions>, "connection" | "prefix"> = {},
  ): Worker {
    const existing = this.workers.get(queueName);
    if (existing) {
      this.logger.warn(
        `A worker for queue "${queueName}" is already registered; ignoring duplicate.`,
      );
      return existing;
    }

    const worker = new Worker(queueName, async (job) => processor(job), {
      ...options,
      connection: this.getConnection() as ConnectionOptions,
      prefix: this.prefix,
    });

    worker.on("failed", (job, err) => {
      this.logger.error(
        `Job "${queueName}" (${job?.id ?? "unknown"}) failed: ${err.message}`,
      );
    });

    this.workers.set(queueName, worker);
    return worker;
  }

  /** Return the registered worker for `queueName`, if any. */
  getWorker(queueName: string): Worker | undefined {
    return this.workers.get(queueName);
  }

  /**
   * Close every worker and queue, then quit the shared Redis client so no
   * connection leaks. A caller-supplied client is left open for its owner to
   * close. Called automatically on application shutdown.
   */
  async close(): Promise<void> {
    await Promise.all(
      [...this.workers.values()].map((worker) => worker.close()),
    );
    await Promise.all([...this.queues.values()].map((queue) => queue.close()));
    this.workers.clear();
    this.queues.clear();

    if (this.sharedConnection && this.ownsConnection) {
      const client = this.sharedConnection;
      // Quit flushes pending replies; disconnect guarantees the socket (and any
      // in-flight reconnect) is torn down even if quit could not reach Redis.
      await client.quit().catch(() => {});
      client.disconnect();
    }
    this.sharedConnection = undefined;
    this.ownsConnection = false;
  }
}
