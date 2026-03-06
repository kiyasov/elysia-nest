import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { PARAMS_METADATA, ParamType } from "~/src/decorators/param.decorators";
import {
  Body,
  File,
  Files,
  Form,
  Params,
  processParameters,
  Query,
} from "~/src/decorators/param.decorators";

describe("Param Decorators (Validation)", () => {
  describe("Metadata decorators", () => {
    it("should register Body parameter with DTO", () => {
      class UserDto {}

      class TestController {
        create(@Body(UserDto) user: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "create",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.BODY);
      expect(params[0].dto).toBe(UserDto);
      expect(params[0].index).toBe(0);
    });

    it("should register Body parameter without DTO", () => {
      class TestController {
        create(@Body() data: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "create",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.BODY);
      expect(params[0].dto).toBeUndefined();
    });

    it("should register Form parameter", () => {
      class TestController {
        submit(@Form() data: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "submit",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.FORM);
    });

    it("should register Params with name", () => {
      class TestController {
        getById(@Params("id") id: string) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "getById",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.PARAMS);
      expect(params[0].paramName).toBe("id");
    });

    it("should register Params without name", () => {
      class TestController {
        getAll(@Params() params: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "getAll",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.PARAMS);
      expect(params[0].paramName).toBeUndefined();
    });

    it("should register Query with name", () => {
      class TestController {
        search(@Query("q") query: string) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "search",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.QUERY);
      expect(params[0].paramName).toBe("q");
    });

    it("should register Query without name", () => {
      class TestController {
        filter(@Query() query: any) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "filter",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.QUERY);
      expect(params[0].paramName).toBeUndefined();
    });

    it("should register File parameter with name", () => {
      class TestController {
        upload(@File("avatar") file: File) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "upload",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.FILE);
      expect(params[0].paramName).toBe("avatar");
    });

    it("should register File parameter without name", () => {
      class TestController {
        upload(@File() file: File) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "upload",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.FILE);
      expect(params[0].paramName).toBeUndefined();
    });

    it("should register Files parameter with name", () => {
      class TestController {
        uploadMany(@Files("documents") files: File[]) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "uploadMany",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.FILES);
      expect(params[0].paramName).toBe("documents");
    });

    it("should register Files parameter without name", () => {
      class TestController {
        uploadMany(@Files() files: File[]) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "uploadMany",
      );
      expect(params).toHaveLength(1);
      expect(params[0].type).toBe(ParamType.FILES);
      expect(params[0].paramName).toBeUndefined();
    });

    it("should register multiple parameters in order", () => {
      class TestController {
        update(
          @Params("id") id: string,
          @Body() body: any,
          @Query("force") force: boolean,
        ) {}
      }

      const params = Reflect.getMetadata(
        PARAMS_METADATA,
        TestController,
        "update",
      );
      expect(params).toHaveLength(3);
      expect(params[0]).toEqual({
        index: 0,
        type: ParamType.PARAMS,
        dto: undefined,
        paramName: "id",
      });
      expect(params[1]).toEqual({
        index: 1,
        type: ParamType.BODY,
        dto: undefined,
        paramName: undefined,
      });
      expect(params[2]).toEqual({
        index: 2,
        type: ParamType.QUERY,
        dto: undefined,
        paramName: "force",
      });
    });
  });

  describe("processParameters", () => {
    it("should return empty array when no metadata", async () => {
      class TestController {
        handle() {}
      }

      const ctx = {
        body: {},
        params: {},
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "handle");

      expect(result).toEqual([]);
    });

    it("should extract body parameter", async () => {
      class TestController {
        create(@Body() data: any) {}
      }

      const ctx = {
        body: { name: "John", age: 30 },
        params: {},
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "create");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: "John", age: 30 });
    });

    it("should extract params with name", async () => {
      class TestController {
        getById(@Params("id") id: string) {}
      }

      const ctx = {
        body: {},
        params: { id: "123", slug: "test" },
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "getById");

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("123");
    });

    it("should extract all params when no name", async () => {
      class TestController {
        getAll(@Params() params: any) {}
      }

      const ctx = {
        body: {},
        params: { id: "123", slug: "test" },
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "getAll");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: "123", slug: "test" });
    });

    it("should extract query with name", async () => {
      class TestController {
        search(@Query("q") query: string) {}
      }

      const ctx = {
        body: {},
        params: {},
        query: { q: "search-term", page: "1" },
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "search");

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("search-term");
    });

    it("should extract all query when no name", async () => {
      class TestController {
        filter(@Query() query: any) {}
      }

      const ctx = {
        body: {},
        params: {},
        query: { category: "tech", sort: "desc" },
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "filter");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ category: "tech", sort: "desc" });
    });

    it("should handle multipart form data", async () => {
      class TestController {
        submit(@Form() data: any) {}
      }

      const ctx = {
        body: { name: "John", avatar: new globalThis.File([""], "avatar.png") },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "submit");

      expect(result).toHaveLength(1);
      // File fields should be removed
      const formData = result[0] as Record<string, unknown>;
      expect(formData.name).toBe("John");
      expect(formData.avatar).toBeUndefined();
    });

    it("should handle non-multipart form data", async () => {
      class TestController {
        submit(@Form() data: any) {}
      }

      const ctx = {
        body: { name: "John", email: "john@example.com" },
        params: {},
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "submit");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ name: "John", email: "john@example.com" });
    });

    it("should extract single file by name", async () => {
      class TestController {
        upload(@File("avatar") file: File) {}
      }

      const file = new globalThis.File(["content"], "avatar.png");
      const ctx = {
        body: { avatar: file, name: "John" },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "upload");

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(file);
    });

    it("should extract first file when no name specified", async () => {
      class TestController {
        upload(@File() file: File) {}
      }

      const file1 = new globalThis.File(["content1"], "file1.png");
      const file2 = new globalThis.File(["content2"], "file2.png");
      const ctx = {
        body: { doc1: file1, doc2: file2 },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "upload");

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(file1);
    });

    it("should return null for file when not multipart", async () => {
      class TestController {
        upload(@File("avatar") file: File) {}
      }

      const ctx = {
        body: {},
        params: {},
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "upload");

      expect(result).toHaveLength(1);
      expect(result[0]).toBeNull();
    });

    it("should extract files array by name", async () => {
      class TestController {
        uploadMany(@Files("documents") files: File[]) {}
      }

      const file1 = new globalThis.File(["content1"], "doc1.pdf");
      const file2 = new globalThis.File(["content2"], "doc2.pdf");
      const ctx = {
        body: { documents: [file1, file2] },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "uploadMany");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([file1, file2]);
    });

    it("should extract single file as array when name specified", async () => {
      class TestController {
        upload(@Files("document") files: File[]) {}
      }

      const file = new globalThis.File(["content"], "doc.pdf");
      const ctx = {
        body: { document: file },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "upload");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([file]);
    });

    it("should extract all files when no name specified", async () => {
      class TestController {
        uploadAll(@Files() files: File[]) {}
      }

      const file1 = new globalThis.File(["content1"], "doc1.pdf");
      const file2 = new globalThis.File(["content2"], "doc2.pdf");
      const ctx = {
        body: { doc1: file1, doc2: file2 },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "uploadAll");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([file1, file2]);
    });

    it("should return empty array for files when not multipart", async () => {
      class TestController {
        upload(@Files() files: File[]) {}
      }

      const ctx = {
        body: {},
        params: {},
        query: {},
        request: { headers: new Headers() },
      };
      const result = await processParameters(ctx, TestController, "upload");

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([]);
    });

    it("should handle mixed file and non-file fields", async () => {
      class TestController {
        upload(@Files("documents") files: File[], @Body() data: any) {}
      }

      const file = new globalThis.File(["content"], "doc.pdf");
      const ctx = {
        body: { documents: [file], name: "John" },
        params: {},
        query: {},
        request: {
          headers: new Headers({ "content-type": "multipart/form-data" }),
        },
      };
      const result = await processParameters(ctx, TestController, "upload");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([file]);
      expect(result[1]).toEqual({});
    });
  });
});
