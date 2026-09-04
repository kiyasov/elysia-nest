import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import {
  Inject,
  Injectable,
  INJECTABLE_METADATA,
  INJECT_METADATA,
} from "~/src/di";
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

  it("keeps inherited injection metadata isolated", () => {
    const BASE_TOKEN = Symbol("base");
    const CHILD_TOKEN = Symbol("child");

    class BaseService {
      constructor(@Inject(BASE_TOKEN) _dep: unknown) {}
    }

    class ChildService extends BaseService {
      constructor(@Inject(CHILD_TOKEN) _dep: unknown) {
        super(_dep);
      }
    }

    expect(Reflect.getOwnMetadata(INJECT_METADATA, BaseService)).toEqual([
      { index: 0, token: BASE_TOKEN },
    ]);
    expect(Reflect.getOwnMetadata(INJECT_METADATA, ChildService)).toEqual([
      { index: 0, token: CHILD_TOKEN },
    ]);
  });
});
