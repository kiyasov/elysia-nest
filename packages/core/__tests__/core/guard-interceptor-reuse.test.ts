import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

import { setupController } from "~/src/core/controller-setup";
import { Controller } from "~/src/decorators/controller.decorator";
import { Get } from "~/src/decorators/http.decorators";
import { Container, DIContainer, Scope } from "~/src/di";
import { Injectable } from "~/src/di/injectable.decorator";
import { UseGuards } from "~/src/guards/use-guards.decorator";
import { UseInterceptors } from "~/src/interceptors/use-interceptors.decorator";

/**
 * Runtime regression tests for issues C2 (guards re-resolved per request) and
 * C3 (interceptors re-instantiated per request, losing state).
 */

// ── C2: singleton guard resolved ONCE across requests ─────────────────────────

let guardConstructions = 0;
let guardActivations = 0;

class OnceGuard {
  constructor() {
    guardConstructions++;
  }
  canActivate() {
    guardActivations++;
    return true;
  }
}

@Injectable()
@Controller("/g")
class GuardController {
  @UseGuards(OnceGuard)
  @Get("/")
  handler() {
    return { ok: true };
  }
}

// ── C2 scope preservation: REQUEST-scoped guard resolved PER request ──────────

let reqGuardConstructions = 0;

@Injectable({ scope: Scope.REQUEST })
class RequestScopedGuard {
  constructor() {
    reqGuardConstructions++;
  }
  canActivate() {
    return true;
  }
}

@Injectable()
@Controller("/rg")
class ReqGuardController {
  @UseGuards(RequestScopedGuard)
  @Get("/")
  handler() {
    return { ok: true };
  }
}

// ── C3: stateful interceptor instance REUSED across requests ──────────────────

let interceptorConstructions = 0;

class CountingInterceptor {
  count = 0;
  constructor() {
    interceptorConstructions++;
  }
  intercept() {
    this.count++;
  }
}

@Injectable()
@Controller("/i")
class InterceptorController {
  @UseInterceptors(CountingInterceptor)
  @Get("/")
  handler() {
    return { ok: true };
  }
}

describe("Guard/interceptor bootstrap resolution (C2/C3)", () => {
  let app: Elysia;

  beforeEach(() => {
    Container.instance.clear();
    guardConstructions = 0;
    guardActivations = 0;
    reqGuardConstructions = 0;
    interceptorConstructions = 0;
  });

  afterEach(() => {
    Container.instance.clear();
  });

  it("resolves a singleton guard once and reuses it across requests (C2)", async () => {
    DIContainer.register([GuardController], GuardController as never);
    DIContainer.registerControllers([GuardController], GuardController as never);
    app = new Elysia();
    await setupController(app, GuardController, GuardController, "");

    await app.handle(new Request("http://localhost/g"));
    await app.handle(new Request("http://localhost/g"));

    // Constructed once, but canActivate runs on every request.
    expect(guardConstructions).toBe(1);
    expect(guardActivations).toBe(2);
  });

  it("still resolves a REQUEST-scoped guard per request (C2 scope preservation)", async () => {
    DIContainer.register([RequestScopedGuard, ReqGuardController], ReqGuardController as never);
    DIContainer.registerControllers([ReqGuardController], ReqGuardController as never);
    app = new Elysia();
    await setupController(app, ReqGuardController, ReqGuardController, "");

    await app.handle(new Request("http://localhost/rg"));
    await app.handle(new Request("http://localhost/rg"));

    // Request scope must NOT be hoisted — a fresh instance per request.
    expect(reqGuardConstructions).toBe(2);
  });

  it("reuses a stateful interceptor instance across requests (C3)", async () => {
    let seen: CountingInterceptor | undefined;
    const orig = CountingInterceptor.prototype.intercept;
    CountingInterceptor.prototype.intercept = function (this: CountingInterceptor) {
      seen = this;
      return orig.call(this);
    };

    DIContainer.register([InterceptorController], InterceptorController as never);
    DIContainer.registerControllers([InterceptorController], InterceptorController as never);
    app = new Elysia();
    await setupController(app, InterceptorController, InterceptorController, "");

    await app.handle(new Request("http://localhost/i"));
    await app.handle(new Request("http://localhost/i"));

    CountingInterceptor.prototype.intercept = orig;

    // Constructed ONCE and reused → internal counter accumulates across requests.
    expect(interceptorConstructions).toBe(1);
    expect(seen).toBeDefined();
    expect(seen!.count).toBe(2);
  });
});
