import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { GUARDS_METADATA } from "~/src/decorators/constants";
import { Get } from "~/src/decorators/http.decorators";
import type { CanActivate } from "~/src/guards/guard.interface";
import { UseGuards } from "~/src/guards/use-guards.decorator";
import type { ExecutionContext } from "~/src/interfaces/execution-context.interface";

// ─── Stub guards ──────────────────────────────────────────────────────────────

class AllowGuard implements CanActivate {
  canActivate(_ctx: ExecutionContext): boolean {
    return true;
  }
}

class DenyGuard implements CanActivate {
  canActivate(_ctx: ExecutionContext): boolean {
    return false;
  }
}

class AsyncGuard implements CanActivate {
  async canActivate(_ctx: ExecutionContext): Promise<boolean> {
    return true;
  }
}

// ─── Metadata storage ─────────────────────────────────────────────────────────

describe("@UseGuards() metadata", () => {
  it("stores guard on a method", () => {
    class TestController {
      @UseGuards(AllowGuard)
      @Get("/")
      handler() {}
    }

    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      TestController,
      "handler",
    );
    expect(guards).toEqual([AllowGuard]);
  });

  it("stores guard on a class", () => {
    @UseGuards(AllowGuard)
    class TestController {
      @Get("/")
      handler() {}
    }

    const guards = Reflect.getMetadata(GUARDS_METADATA, TestController);
    expect(guards).toEqual([AllowGuard]);
  });

  it("accumulates multiple guards on a method", () => {
    class TestController {
      @UseGuards(AllowGuard, DenyGuard)
      @Get("/")
      handler() {}
    }

    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      TestController,
      "handler",
    );
    expect(guards).toEqual([AllowGuard, DenyGuard]);
  });

  it("accumulates multiple guards on a class", () => {
    @UseGuards(AllowGuard, DenyGuard)
    class TestController {
      handler() {}
    }

    const guards = Reflect.getMetadata(GUARDS_METADATA, TestController);
    expect(guards).toEqual([AllowGuard, DenyGuard]);
  });

  it("stacks multiple @UseGuards() calls on a method", () => {
    class TestController {
      @UseGuards(DenyGuard)
      @UseGuards(AllowGuard)
      @Get("/")
      handler() {}
    }

    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      TestController,
      "handler",
    );
    expect(guards).toHaveLength(2);
    expect(guards).toContain(AllowGuard);
    expect(guards).toContain(DenyGuard);
  });

  it("class and method guards are stored independently", () => {
    @UseGuards(AllowGuard)
    class TestController {
      @UseGuards(DenyGuard)
      @Get("/")
      handler() {}
    }

    const classGuards = Reflect.getMetadata(GUARDS_METADATA, TestController);
    const methodGuards = Reflect.getMetadata(
      GUARDS_METADATA,
      TestController,
      "handler",
    );

    expect(classGuards).toEqual([AllowGuard]);
    expect(methodGuards).toEqual([DenyGuard]);
  });

  it("returns undefined when no guards are set", () => {
    class TestController {
      @Get("/")
      handler() {}
    }

    const classGuards = Reflect.getMetadata(GUARDS_METADATA, TestController);
    const methodGuards = Reflect.getMetadata(
      GUARDS_METADATA,
      TestController,
      "handler",
    );

    expect(classGuards).toBeUndefined();
    expect(methodGuards).toBeUndefined();
  });

  it("accepts async guard class", () => {
    class TestController {
      @UseGuards(AsyncGuard)
      @Get("/")
      handler() {}
    }

    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      TestController,
      "handler",
    );
    expect(guards).toEqual([AsyncGuard]);
  });
});

// ─── CanActivate interface ────────────────────────────────────────────────────

describe("CanActivate interface", () => {
  it("sync guard returns boolean", () => {
    const guard = new AllowGuard();
    const result = guard.canActivate({} as ExecutionContext);
    expect(typeof result).toBe("boolean");
    expect(result).toBe(true);
  });

  it("deny guard returns false", () => {
    const guard = new DenyGuard();
    expect(guard.canActivate({} as ExecutionContext)).toBe(false);
  });

  it("async guard returns Promise<boolean>", async () => {
    const guard = new AsyncGuard();
    const result = guard.canActivate({} as ExecutionContext);
    expect(result).toBeInstanceOf(Promise);
    expect(await result).toBe(true);
  });
});
