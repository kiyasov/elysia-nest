import { beforeEach, describe, expect, it } from "bun:test";

import { Container } from "~/src/di/container";
import { Inject, Injectable } from "~/src/di/injectable.decorator";
import type { ProviderToken } from "~/src/di/provider.interface";
import { Scope } from "~/src/di/scope-options.interface";

describe("DI Container", () => {
  let container: Container;

  beforeEach(() => {
    Container.instance.clear();
    container = Container.instance;
  });

  describe("Singleton Scope", () => {
    it("should create singleton instance", async () => {
      @Injectable()
      class SingletonService {
        public readonly id = Math.random();
      }

      container.register([SingletonService]);

      const instance1 = await container.get(SingletonService);
      const instance2 = await container.get(SingletonService);

      expect(instance1).toBe(instance2);
      expect(instance1!.id).toBe(instance2!.id);
    });

    it("should auto-register singleton", async () => {
      @Injectable()
      class AutoService {
        public value = "test";
      }

      container.register([AutoService]);

      const instance = await container.get(AutoService);
      expect(instance).toBeDefined();
      expect(instance!.value).toBe("test");
    });
  });

  describe("Transient Scope", () => {
    it("should create new instance for transient", async () => {
      @Injectable({ scope: Scope.TRANSIENT })
      class TransientService {
        public readonly id = Math.random();
      }

      container.register([TransientService]);

      const instance1 = await container.get(TransientService);
      const instance2 = await container.get(TransientService);

      expect(instance1).not.toBe(instance2);
      expect(instance1!.id).not.toBe(instance2!.id);
    });
  });

  describe("Request Scope", () => {
    it("should create instance per request context", async () => {
      @Injectable({ scope: Scope.REQUEST })
      class RequestService {
        public readonly id = Math.random();
      }

      container.register([RequestService]);

      const context1 = {
        id: "req-1",
        container: new Map<ProviderToken, unknown>(),
      };
      const context2 = {
        id: "req-2",
        container: new Map<ProviderToken, unknown>(),
      };

      const instance1 = await Container.runInRequestContext(context1, () =>
        container.get(RequestService),
      );
      const instance2 = await Container.runInRequestContext(context2, () =>
        container.get(RequestService),
      );

      expect(instance1).not.toBe(instance2);
    });

    it("should return same instance within same request", async () => {
      @Injectable({ scope: Scope.REQUEST })
      class RequestService2 {
        public readonly id = Math.random();
      }

      container.register([RequestService2]);

      const context = {
        id: "req-1",
        container: new Map<ProviderToken, unknown>(),
      };

      const instance1 = await Container.runInRequestContext(context, () =>
        container.get(RequestService2),
      );
      const instance2 = await Container.runInRequestContext(context, () =>
        container.get(RequestService2),
      );

      expect(instance1).toBe(instance2);
    });
  });

  describe("Dependency Injection", () => {
    it("should inject dependencies via constructor", async () => {
      @Injectable()
      class DatabaseService {
        public query() {
          return "data";
        }
      }

      @Injectable()
      class UserService {
        constructor(public db: DatabaseService) {}
      }

      container.register([DatabaseService, UserService]);

      const userService = await container.get<UserService>(UserService);
      expect(userService!.db).toBeDefined();
      expect(userService!.db.query()).toBe("data");
    });

    it("should inject via @Inject decorator", async () => {
      @Injectable()
      class ConfigService {
        public value = "config-value";
      }

      @Injectable()
      class AppService {
        constructor(@Inject(ConfigService) public config: ConfigService) {}
      }

      container.register([ConfigService, AppService]);

      const appService = await container.get<AppService>(AppService);
      expect(appService!.config).toBeDefined();
      expect(appService!.config.value).toBe("config-value");
    });
  });

  describe("Factory Provider", () => {
    it("should resolve factory provider", async () => {
      const TOKEN = Symbol("factory");

      container.register([
        {
          provide: TOKEN,
          useFactory: () => ({ value: "factory-created" }),
        },
      ]);

      const instance = await container.get<Record<string, string>>(TOKEN);
      expect(instance!.value).toBe("factory-created");
    });

    it("should inject dependencies into factory", async () => {
      @Injectable()
      class DepService {
        public name = "dependency";
      }

      const TOKEN = Symbol("factory-with-deps");

      container.register([
        DepService,
        {
          provide: TOKEN,
          useFactory: (dep: DepService) => ({ depName: dep.name }),
          inject: [DepService],
        },
      ]);

      const instance = await container.get<Record<string, string>>(TOKEN);
      expect(instance!.depName).toBe("dependency");
    });
  });

  describe("Value Provider", () => {
    it("should resolve value provider", async () => {
      const TOKEN = Symbol("config");
      const config = { port: 3000, host: "localhost" };

      container.register([
        {
          provide: TOKEN,
          useValue: config,
        },
      ]);

      const instance = await container.get<typeof config>(TOKEN);
      expect(instance).toBe(config);
      expect(instance!.port).toBe(3000);
    });
  });

  describe("Class Provider", () => {
    it("should use useClass provider", async () => {
      abstract class Database {}

      @Injectable()
      class PostgresDb extends Database {
        public type = "postgres";
      }

      const TOKEN = Symbol("db");
      container.register([
        {
          provide: TOKEN,
          useClass: PostgresDb,
        },
      ]);

      const instance = await container.get<PostgresDb>(TOKEN);
      expect(instance!.type).toBe("postgres");
    });
  });
});
