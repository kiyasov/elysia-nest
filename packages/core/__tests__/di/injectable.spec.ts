import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { Inject, Injectable, INJECTABLE_METADATA } from "~/src/di";
import { Scope } from "~/src/di/scope-options.interface";

describe("@Injectable()", () => {
  it("should add metadata to class", () => {
    @Injectable()
    class TestService {}

    const metadata = Reflect.getMetadata(INJECTABLE_METADATA, TestService);
    expect(metadata).toBeDefined();
    expect(metadata.scope).toBe(Scope.SINGLETON);
  });

  it("should set transient scope", () => {
    @Injectable({ scope: Scope.TRANSIENT })
    class TransientService {}

    const metadata = Reflect.getMetadata(INJECTABLE_METADATA, TransientService);
    expect(metadata.scope).toBe(Scope.TRANSIENT);
  });

  it("should set request scope", () => {
    @Injectable({ scope: Scope.REQUEST })
    class RequestService {}

    const metadata = Reflect.getMetadata(INJECTABLE_METADATA, RequestService);
    expect(metadata.scope).toBe(Scope.REQUEST);
  });
});

describe("@Inject()", () => {
  it("should store injection metadata", () => {
    const TOKEN = Symbol("test");

    @Injectable()
    class TestService {
      constructor(@Inject(TOKEN) private dep: unknown) {}
    }

    const metadata = Reflect.getMetadata("design:paramtypes", TestService);
    expect(metadata).toBeDefined();
  });
});
