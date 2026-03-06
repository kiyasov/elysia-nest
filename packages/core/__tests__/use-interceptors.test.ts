import "reflect-metadata";

import { describe, expect, it } from "bun:test";

import { UseInterceptors } from "../src/interceptors/use-interceptors.decorator";
import { INTERCEPTORS_METADATA } from "../src/decorators/constants";

class LogInterceptor {
  intercept() {}
}

class TimingInterceptor {
  constructor(private readonly label: string) {}
  intercept() {}
}

describe("@UseInterceptors on class", () => {
  it("stores interceptor class in metadata", () => {
    @UseInterceptors(LogInterceptor)
    class MyController {}

    const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, MyController);
    expect(interceptors).toHaveLength(1);
    expect(interceptors[0]).toBe(LogInterceptor);
  });

  it("stores interceptor instance in metadata", () => {
    const instance = new TimingInterceptor("req");

    @UseInterceptors(instance)
    class MyController {}

    const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, MyController);
    expect(interceptors[0]).toBe(instance);
  });

  it("stores multiple interceptors", () => {
    const instance = new TimingInterceptor("x");

    @UseInterceptors(LogInterceptor, instance)
    class MyController {}

    const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, MyController);
    expect(interceptors).toHaveLength(2);
  });
});

describe("@UseInterceptors on method", () => {
  it("stores interceptor class on method", () => {
    class MyController {
      @UseInterceptors(LogInterceptor)
      handler() {}
    }

    const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, MyController, "handler");
    expect(interceptors).toHaveLength(1);
    expect(interceptors[0]).toBe(LogInterceptor);
  });

  it("stores interceptor instance on method", () => {
    const instance = new TimingInterceptor("t");

    class MyController {
      @UseInterceptors(instance)
      handler() {}
    }

    const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, MyController, "handler");
    expect(interceptors[0]).toBe(instance);
  });
});
