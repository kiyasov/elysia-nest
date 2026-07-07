import passport from "passport";

import { Container, UnauthorizedException } from "nestelia";
import type { CanActivate } from "nestelia";
import type { ExecutionContext } from "nestelia";
import {
  getRegisteredStrategyClass,
  getRegisteredStrategyInstance,
} from "./passport-strategy";

type StrategyType = string | string[] | undefined;
type VerifyFn = (
  request: unknown,
  done: (err: unknown, user?: unknown, info?: unknown) => void,
) => void;
type StrategyInstance = { validate?: (...args: unknown[]) => unknown };
type ProviderTokenCache = Map<
  string,
  (new (...args: unknown[]) => unknown) | null
>;

export interface IAuthGuard extends CanActivate {
  getRequest(context: ExecutionContext): unknown;
  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info?: unknown,
    ...rest: unknown[]
  ): unknown;
}

export type Type<T> = new (...args: unknown[]) => T;

export function AuthGuard(type?: StrategyType): Type<IAuthGuard> {
  class MixinAuthGuard implements IAuthGuard {
    private static providerTokenCache: ProviderTokenCache = new Map();

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = this.getRequest(context);
      const user = await this.authenticate(request);
      this.assignUser(request, user);
      this.handleRequest(null, user);
      return true;
    }

    public getRequest(context: ExecutionContext): unknown {
      const value = context.switchToHttp().getRequest<unknown>();
      if (value && typeof value === "object" && "ctx" in value) {
        const nested = (value as { ctx?: unknown }).ctx;
        if (nested) {
          return nested;
        }
      }
      if (value && typeof value === "object" && "request" in value) {
        const nested = (value as { request?: unknown }).request;
        if (nested) {
          return nested;
        }
      }
      if (value && typeof value === "object" && "req" in value) {
        const nested = (value as { req?: unknown }).req;
        if (nested) {
          return nested;
        }
      }
      return value;
    }

    public handleRequest<TUser = unknown>(err: unknown, user: TUser): TUser {
      // Reject when the strategy errored OR produced no user. A failed
      // authentication resolves `user` as null/undefined/false with no error;
      // returning it here (as the old code did) authorized the request with an
      // unset `request.user` — an auth bypass. Mirrors NestJS's AuthGuard.
      if (err || !user) {
        throw err ?? new UnauthorizedException();
      }
      return user;
    }

    private assignUser(request: unknown, user: unknown): void {
      if (!request || typeof request !== "object") {
        return;
      }

      const visited = new Set<object>();
      const queue: unknown[] = [request];

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current || typeof current !== "object") {
          continue;
        }
        if (visited.has(current)) {
          continue;
        }
        visited.add(current);

        // Prototype pollution protection: only assign to own property or extensible object
        const carrier = current as Record<string, unknown>;
        const hasUserProp = Object.prototype.hasOwnProperty.call(
          carrier,
          "user",
        );
        const canExtend = Object.isExtensible(current) && !("user" in carrier);

        if (hasUserProp || canExtend) {
          carrier.user = user;
        }

        const nested = current as {
          req?: unknown;
          ctx?: unknown;
          request?: unknown;
        };
        if (nested.req) {
          queue.push(nested.req);
        }
        if (nested.ctx) {
          queue.push(nested.ctx);
        }
        if (nested.request) {
          queue.push(nested.request);
        }
      }
    }

    private async authenticate(request: unknown): Promise<unknown> {
      const strategyInstance = await this.getStrategyInstance();
      if (strategyInstance?.validate) {
        return await strategyInstance.validate(request);
      }

      await this.ensureStrategyInitialized();
      const strategy = this.resolveStrategy();
      if (strategy) {
        return this.authenticateWithStrategy(strategy, request);
      }

      // Validate strategy type before passing to passport
      const strategyType = this.normalizeStrategyType(type);
      if (!strategyType) {
        throw new Error("AuthGuard: strategy type is required");
      }

      return new Promise((resolve, reject) => {
        const authenticate = passport.authenticate(
          strategyType,
          { session: false },
          (err: unknown, user: unknown, info: unknown) => {
            if (err) {
              reject(err);
              return;
            }
            if (info instanceof Error) {
              reject(info);
              return;
            }
            resolve(user);
          },
        );

        authenticate(
          request as Record<string, unknown>,
          {} as Record<string, unknown>,
          (error?: unknown) => {
            if (error) {
              reject(error);
            }
          },
        );
      });
    }

    private normalizeStrategyType(
      strategyType: StrategyType,
    ): string | string[] | null {
      if (strategyType === undefined || strategyType === null) {
        return null;
      }
      if (typeof strategyType === "string") {
        // Sanitize: only allow alphanumeric, hyphen, underscore
        if (/^[a-zA-Z0-9_-]+$/.test(strategyType)) {
          return strategyType;
        }
        throw new Error(`Invalid strategy name: ${strategyType}`);
      }
      if (Array.isArray(strategyType)) {
        const validated = strategyType.filter((s): s is string => {
          if (typeof s !== "string") {
            return false;
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(s)) {
            throw new Error(`Invalid strategy name in array: ${s}`);
          }
          return true;
        });
        return validated.length > 0 ? validated : null;
      }
      return null;
    }

    private async getStrategyInstance(): Promise<StrategyInstance | null> {
      const strategyName = Array.isArray(type) ? type[0] : type;
      if (!strategyName) {
        return null;
      }
      const registeredInstance = getRegisteredStrategyInstance(strategyName);
      if (registeredInstance) {
        return registeredInstance;
      }
      const registeredClass = getRegisteredStrategyClass(strategyName);
      if (!registeredClass) {
        return null;
      }
      const providerToken = this.findStrategyProviderToken(registeredClass);
      await Container.instance.get(providerToken ?? registeredClass);
      return getRegisteredStrategyInstance(strategyName) ?? null;
    }

    private findStrategyProviderToken(
      registeredClass: new (...args: unknown[]) => unknown,
    ): (new (...args: unknown[]) => unknown) | null {
      const cacheKey = registeredClass.name;
      const cached = MixinAuthGuard.providerTokenCache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      for (const moduleRef of Container.instance.getModules().values()) {
        for (const token of moduleRef.getProviders().keys()) {
          if (typeof token !== "function") {
            continue;
          }
          const candidatePrototype = (token as { prototype?: unknown })
            .prototype;
          if (
            candidatePrototype &&
            registeredClass.prototype.isPrototypeOf(candidatePrototype)
          ) {
            MixinAuthGuard.providerTokenCache.set(
              cacheKey,
              token as new (...args: unknown[]) => unknown,
            );
            return token as new (...args: unknown[]) => unknown;
          }
        }
      }

      MixinAuthGuard.providerTokenCache.set(cacheKey, null);
      return null;
    }

    private async ensureStrategyInitialized(): Promise<void> {
      const strategyName = Array.isArray(type) ? type[0] : type;
      if (
        !strategyName ||
        this.resolveStrategy() ||
        getRegisteredStrategyInstance(strategyName)
      ) {
        return;
      }
      // Strategy instance will be registered when DI instantiates the strategy provider.
    }

    private resolveStrategy(): { _verify?: VerifyFn } | null {
      const strategyName = Array.isArray(type) ? type[0] : type;
      if (!strategyName) {
        return null;
      }
      const resolved = (passport as any)._strategy(strategyName) as
        | { _verify?: VerifyFn }
        | undefined;
      return resolved ?? null;
    }

    private authenticateWithStrategy(
      strategy: { _verify?: VerifyFn },
      request: unknown,
    ): Promise<unknown> {
      if (typeof strategy._verify !== "function") {
        return Promise.resolve(null);
      }

      return new Promise((resolve, reject) => {
        strategy._verify!(request, (err, user, info) => {
          if (err) {
            reject(err);
            return;
          }
          if (info instanceof Error) {
            reject(info);
            return;
          }
          resolve(user);
        });
      });
    }
  }

  return MixinAuthGuard;
}
