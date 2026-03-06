import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { UseGuards } from "../src/guards/use-guards.decorator";
import { GUARDS_METADATA } from "../src/decorators/constants";

class AlwaysAllowGuard {
  canActivate() {
    return true;
  }
}

class ApiKeyGuard {
  constructor(private readonly key: string) {}
  canActivate() {
    return this.key === "secret";
  }
}

describe("@UseGuards on class", () => {
  it("stores guard class in metadata", () => {
    @UseGuards(AlwaysAllowGuard)
    class MyController {}

    const guards = Reflect.getMetadata(GUARDS_METADATA, MyController);
    expect(guards).toHaveLength(1);
    expect(guards[0]).toBe(AlwaysAllowGuard);
  });

  it("stores guard instance in metadata", () => {
    const instance = new ApiKeyGuard("secret");

    @UseGuards(instance)
    class MyController {}

    const guards = Reflect.getMetadata(GUARDS_METADATA, MyController);
    expect(guards[0]).toBe(instance);
  });

  it("stores multiple guards", () => {
    const instance = new ApiKeyGuard("key");

    @UseGuards(AlwaysAllowGuard, instance)
    class MyController {}

    const guards = Reflect.getMetadata(GUARDS_METADATA, MyController);
    expect(guards).toHaveLength(2);
    expect(guards[0]).toBe(AlwaysAllowGuard);
    expect(guards[1]).toBe(instance);
  });
});

describe("@UseGuards on method", () => {
  it("stores guard class on method", () => {
    class MyController {
      @UseGuards(AlwaysAllowGuard)
      handler() {}
    }

    const guards = Reflect.getMetadata(GUARDS_METADATA, MyController, "handler");
    expect(guards).toHaveLength(1);
    expect(guards[0]).toBe(AlwaysAllowGuard);
  });

  it("stores guard instance on method", () => {
    const instance = new ApiKeyGuard("secret");

    class MyController {
      @UseGuards(instance)
      handler() {}
    }

    const guards = Reflect.getMetadata(GUARDS_METADATA, MyController, "handler");
    expect(guards[0]).toBe(instance);
  });

  it("accumulates guards from multiple decorators", () => {
    class MyController {
      @UseGuards(AlwaysAllowGuard)
      @UseGuards(new ApiKeyGuard("k"))
      handler() {}
    }

    const guards = Reflect.getMetadata(GUARDS_METADATA, MyController, "handler");
    expect(guards).toHaveLength(2);
  });
});
