import "reflect-metadata";

import { beforeEach, describe, expect, it } from "bun:test";

import { Module } from "~/src/core";
import { Controller } from "~/src/decorators";
import {
  MODULE_METADATA,
  ROUTE_METADATA,
  ROUTE_PREFIX_METADATA,
} from "~/src/decorators/constants";
import { Get, Post } from "~/src/decorators/http.decorators";
import { Container } from "~/src/di/container";

describe("Core Decorators", () => {
  beforeEach(() => {
    Container.instance.clear();
  });

  describe("@Controller()", () => {
    it("should define route prefix metadata", () => {
      @Controller("/users")
      class UsersController {}

      const prefix = Reflect.getMetadata(
        ROUTE_PREFIX_METADATA,
        UsersController,
      );
      expect(prefix).toBe("/users");
    });

    it("should use empty string as default prefix", () => {
      @Controller()
      class DefaultController {}

      const prefix = Reflect.getMetadata(
        ROUTE_PREFIX_METADATA,
        DefaultController,
      );
      expect(prefix).toBe("");
    });

    it("should use empty string when no argument provided", () => {
      @Controller()
      class EmptyController {}

      const prefix = Reflect.getMetadata(
        ROUTE_PREFIX_METADATA,
        EmptyController,
      );
      expect(prefix).toBe("");
    });
  });

  describe("@Module()", () => {
    it("should define module metadata on factory function", () => {
      @Module({
        prefix: "/api",
        controllers: [],
        providers: [],
      })
      class TestModule {}

      const metadata = Reflect.getMetadata(MODULE_METADATA, TestModule);
      expect(metadata).toBeDefined();
      expect(metadata.prefix).toBe("/api");
      expect(metadata.controllers).toEqual([]);
      expect(metadata.providers).toEqual([]);
    });

    it("should store imports in metadata", () => {
      @Module({})
      class ImportModule {}

      @Module({
        imports: [ImportModule],
      })
      class TestModule {}

      const metadata = Reflect.getMetadata(MODULE_METADATA, TestModule);
      expect(metadata.imports).toContain(ImportModule);
    });

    it("should store exports in metadata", () => {
      const TOKEN = Symbol("test");

      @Module({
        exports: [TOKEN],
      })
      class TestModule {}

      const metadata = Reflect.getMetadata(MODULE_METADATA, TestModule);
      expect(metadata.exports).toContain(TOKEN);
    });

    it("should store children in metadata", () => {
      @Module({})
      class ChildModule {}

      @Module({
        children: [ChildModule],
      })
      class ParentModule {}

      const metadata = Reflect.getMetadata(MODULE_METADATA, ParentModule);
      expect(metadata.children).toContain(ChildModule);
    });

    it("should store middlewares in metadata", () => {
      const middleware = () => {
        // intentionally empty for testing
      };

      @Module({
        middlewares: [middleware],
      })
      class TestModule {}

      const metadata = Reflect.getMetadata(MODULE_METADATA, TestModule);
      expect(metadata.middlewares).toContain(middleware);
    });
  });

  describe("Controller with routes", () => {
    it("should register routes with HTTP method decorators", () => {
      @Controller("/items")
      class ItemsController {
        @Get()
        findAll() {
          return "all items";
        }

        @Post()
        create() {
          return "created";
        }
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, ItemsController);
      expect(routes).toBeDefined();
      expect(routes).toHaveLength(2);
      expect(routes[0].method).toBe("GET");
      expect(routes[0].path).toBe("");
      expect(routes[1].method).toBe("POST");
      expect(routes[1].path).toBe("");
    });

    it("should register routes with paths", () => {
      @Controller("/users")
      class UsersController {
        @Get("/list")
        list() {
          return [];
        }

        @Get("/:id")
        getById() {
          return {};
        }
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, UsersController);
      expect(routes).toHaveLength(2);
      expect(routes[0].path).toBe("/list");
      expect(routes[1].path).toBe("/:id");
    });
  });
});
