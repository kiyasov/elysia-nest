import "reflect-metadata";

import { describe, expect, it } from "bun:test";
import { t } from "elysia";

import { PARAMS_METADATA, ROUTE_METADATA } from "~/src/decorators/constants";
import {
  Body,
  Ctx,
  Delete,
  ElysiaContext,
  Get,
  Head,
  Headers,
  Ip,
  Options,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  Session,
} from "~/src/decorators/http.decorators";

describe("HTTP Method Decorators", () => {
  describe("Basic HTTP methods", () => {
    it("should register GET route", () => {
      class TestController {
        @Get("/test")
        testMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes).toHaveLength(1);
      expect(routes[0].method).toBe("GET");
      expect(routes[0].path).toBe("/test");
      expect(routes[0].propertyKey).toBe("testMethod");
    });

    it("should register POST route", () => {
      class TestController {
        @Post("/create")
        createMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].method).toBe("POST");
    });

    it("should register PUT route", () => {
      class TestController {
        @Put("/update")
        updateMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].method).toBe("PUT");
    });

    it("should register PATCH route", () => {
      class TestController {
        @Patch("/patch")
        patchMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].method).toBe("PATCH");
    });

    it("should register DELETE route", () => {
      class TestController {
        @Delete("/delete")
        deleteMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].method).toBe("DELETE");
    });

    it("should register OPTIONS route", () => {
      class TestController {
        @Options("/options")
        optionsMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].method).toBe("OPTIONS");
    });

    it("should register HEAD route", () => {
      class TestController {
        @Head("/head")
        headMethod() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].method).toBe("HEAD");
    });
  });

  describe("Multiple routes on same controller", () => {
    it("should register multiple routes", () => {
      class TestController {
        @Get()
        findAll() {}

        @Get(":id")
        findOne() {}

        @Post()
        create() {}

        @Put(":id")
        update() {}

        @Delete(":id")
        remove() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes).toHaveLength(5);
    });

    it("should preserve route order", () => {
      class TestController {
        @Get("first")
        first() {}

        @Get("second")
        second() {}

        @Get("third")
        third() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].path).toBe("first");
      expect(routes[1].path).toBe("second");
      expect(routes[2].path).toBe("third");
    });
  });

  describe("Empty path handling", () => {
    it("should use empty string as default path", () => {
      class TestController {
        @Get()
        rootPath() {}
      }

      const routes = Reflect.getMetadata(ROUTE_METADATA, TestController);
      expect(routes[0].path).toBe("");
    });
  });
});

describe("Parameter Decorators", () => {
  describe("@Body(schema)", () => {
    it("should register body parameter with schema", () => {
      const schema = t.Object({ name: t.String() });
      class TestController {
        create(@Body(schema) data: unknown) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "create",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("body");
      expect(params[0].index).toBe(0);
      expect(params[0].schema).toBe(schema);
    });
  });

  describe("@Param()", () => {
    it("should register param with schema", () => {
      const schema = t.Object({ id: t.String() });

      class TestController {
        getById(@Param(schema) params: { id: string }) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "getById",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("param");
      expect(params[0].schema).toBe(schema);
    });
  });

  describe("@Query()", () => {
    it("should register query parameter with schema", () => {
      class TestController {
        search(@Query(t.Object({ search: t.String() })) query: { search: string }) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "search",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("query");
      expect(params[0].schema).toBeDefined();
    });

    it("should register query parameter with object schema", () => {
      const schema = t.Object({ name: t.String() });
      class TestController {
        filter(@Query(schema) query: { name: string }) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "filter",
      );
      expect(params[0].type).toBe("query");
      expect(params[0].schema).toBe(schema);
    });
  });

  describe("@Req()", () => {
    it("should register request parameter", () => {
      class TestController {
        handle(@Req() req: Request) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("request");
    });
  });

  describe("@Res()", () => {
    it("should register response parameter", () => {
      class TestController {
        handle(@Res() res: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("response");
    });
  });

  describe("@Ctx()", () => {
    it("should register context parameter", () => {
      class TestController {
        handle(@Ctx() ctx: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("context");
    });
  });

  describe("@ElysiaContext()", () => {
    it("should register elysia context parameter", () => {
      class TestController {
        handle(@ElysiaContext() ctx: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("elysiaContext");
    });
  });

  describe("@Headers()", () => {
    it("should register headers parameter without name", () => {
      class TestController {
        handle(@Headers() headers: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("headers");
      expect(params[0].data).toBeUndefined();
    });

    it("should register headers parameter with name", () => {
      class TestController {
        handle(@Headers("authorization") auth: string) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params[0].data).toBe("authorization");
    });
  });

  describe("@Ip()", () => {
    it("should register ip parameter", () => {
      class TestController {
        handle(@Ip() ip: string) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("ip");
    });
  });

  describe("@Session()", () => {
    it("should register session parameter", () => {
      class TestController {
        handle(@Session() session: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "handle",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe("session");
    });
  });

  describe("Multiple parameters", () => {
    it("should register multiple parameters in correct order", () => {
      const paramSchema = t.Object({ id: t.String() });
      const bodySchema = t.Object({});
      const querySchema = t.Object({ force: t.Boolean() });
      class TestController {
        update(
          @Param(paramSchema) param: { id: string },
          @Body(bodySchema) body: unknown,
          @Query(querySchema) query: { force: boolean },
        ) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "update",
      );
      expect(params).toHaveLength(3);
      expect(params[0]).toEqual({ index: 0, type: "param", schema: paramSchema });
      expect(params[1]).toEqual({
        index: 1,
        type: "body",
        schema: bodySchema,
      });
      expect(params[2]).toEqual({ index: 2, type: "query", schema: querySchema });
    });

    it("should sort parameters by index", () => {
      const schemaZ = t.Object({ z: t.String() });
      const schemaA = t.Object({ a: t.String() });
      const schemaM = t.Object({ m: t.String() });
      class TestController {
        test(
          @Query(schemaZ) z: { z: string },
          @Query(schemaA) a: { a: string },
          @Query(schemaM) m: { m: string },
        ) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "test",
      );
      expect(params[0].schema).toBe(schemaZ);
      expect(params[0].index).toBe(0);
      expect(params[1].schema).toBe(schemaA);
      expect(params[1].index).toBe(1);
      expect(params[2].schema).toBe(schemaM);
      expect(params[2].index).toBe(2);
    });
  });
});
