import { beforeEach, describe, expect, it } from "bun:test";

import { Injectable } from "@kiyasov/elysia-nest";
import { Test } from "../src/test";
import type { TestingModule } from "../src/testing.module-builder";

describe("TestingModule", () => {
  let moduleRef: TestingModule;

  beforeEach(() => {
    // Container is cleared between tests via Test.createTestingModule
  });

  describe("Basic provider resolution", () => {
    it("should resolve simple provider", async () => {
      @Injectable()
      class SimpleService {
        getValue() {
          return "simple";
        }
      }

      moduleRef = await Test.createTestingModule({
        providers: [SimpleService],
      }).compile();

      const service = moduleRef.get<SimpleService>(SimpleService);
      expect(service).toBeDefined();
      expect(service.getValue()).toBe("simple");
    });

    it("should resolve provider with dependency", async () => {
      @Injectable()
      class DatabaseService {
        query() {
          return [{ id: 1, name: "Test" }];
        }
      }

      @Injectable()
      class UserService {
        constructor(private db: DatabaseService) {}

        getUsers() {
          return this.db.query();
        }
      }

      moduleRef = await Test.createTestingModule({
        providers: [UserService, DatabaseService],
      }).compile();

      const userService = moduleRef.get<UserService>(UserService);
      expect(userService).toBeDefined();
      expect(userService.getUsers()).toEqual([{ id: 1, name: "Test" }]);
    });
  });

  describe("Provider overrides", () => {
    it("should override provider with useValue", async () => {
      @Injectable()
      class ConfigService {
        getValue() {
          return "real";
        }
      }

      @Injectable()
      class AppService {
        constructor(private config: ConfigService) {}

        getConfig() {
          return this.config.getValue();
        }
      }

      const mockConfig = { getValue: () => "mocked" };

      moduleRef = await Test.createTestingModule({
        providers: [AppService, ConfigService],
      })
        .overrideProvider(ConfigService)
        .useValue(mockConfig)
        .compile();

      const appService = moduleRef.get<AppService>(AppService);
      expect(appService.getConfig()).toBe("mocked");
    });

    it("should override provider with useClass", async () => {
      @Injectable()
      class LoggerService {
        log() {
          return "console";
        }
      }

      @Injectable()
      class FileLoggerService {
        log() {
          return "file";
        }
      }

      @Injectable()
      class AppService {
        constructor(private logger: LoggerService) {}

        doSomething() {
          return this.logger.log();
        }
      }

      moduleRef = await Test.createTestingModule({
        providers: [AppService, LoggerService],
      })
        .overrideProvider(LoggerService)
        .useClass(FileLoggerService)
        .compile();

      const appService = moduleRef.get<AppService>(AppService);
      expect(appService.doSomething()).toBe("file");
    });

    it("should override provider with useFactory", async () => {
      @Injectable()
      class ApiService {
        fetch() {
          return "real-api";
        }
      }

      @Injectable()
      class DataService {
        constructor(private api: ApiService) {}

        getData() {
          return this.api.fetch();
        }
      }

      moduleRef = await Test.createTestingModule({
        providers: [DataService, ApiService],
      })
        .overrideProvider(ApiService)
        .useFactory(() => ({ fetch: () => "mocked-api" }))
        .compile();

      const dataService = moduleRef.get<DataService>(DataService);
      expect(dataService.getData()).toBe("mocked-api");
    });
  });

  describe("Module queries", () => {
    it("should check if provider exists", async () => {
      @Injectable()
      class ExistingService {}

      @Injectable()
      class NonExistingService {}

      moduleRef = await Test.createTestingModule({
        providers: [ExistingService],
      }).compile();

      expect(moduleRef.has(ExistingService)).toBe(true);
      expect(moduleRef.has(NonExistingService)).toBe(false);
    });

    it("should throw when getting non-existent provider", async () => {
      @Injectable()
      class ExistingService {}

      @Injectable()
      class NonExistingService {}

      moduleRef = await Test.createTestingModule({
        providers: [ExistingService],
      }).compile();

      expect(() => moduleRef.get(NonExistingService)).toThrow();
    });
  });

  describe("Async resolution", () => {
    it("should resolve provider asynchronously", async () => {
      @Injectable()
      class AsyncService {
        async getValue() {
          return "async-value";
        }
      }

      moduleRef = await Test.createTestingModule({
        providers: [AsyncService],
      }).compile();

      const service = await moduleRef.resolve<AsyncService>(AsyncService);
      expect(service).toBeDefined();
      expect(await service.getValue()).toBe("async-value");
    });
  });
});
