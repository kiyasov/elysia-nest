import passport from "passport";

type Constructor<T = object> = new (...args: unknown[]) => T;
type AbstractConstructor<T = object> = abstract new (...args: unknown[]) => T;
type Done = (error: unknown, user?: unknown, info?: unknown) => void;
type StrategyConstructor = Constructor<passport.Strategy>;
type StrategyInstance = passport.Strategy & {
  validate?: (...args: unknown[]) => unknown;
};

const strategyClassRegistry = new Map<string, StrategyConstructor>();
const strategyInstanceRegistry = new Map<string, StrategyInstance>();
const registeredNames = new Set<string>();

/**
 * Names under which strategy instances were actually registered with the global
 * `passport` singleton (via `passport.use`). Includes passport's default name
 * for unnamed strategies. Used to `passport.unuse` every strategy on cleanup so
 * the singleton does not pin instances (and their DI-injected deps) forever.
 */
const usedPassportNames = new Set<string>();

export interface PassportStrategyMixin<TValidationResult> {
  validate(...args: unknown[]): Promise<TValidationResult> | TValidationResult;
}

export function PassportStrategy<
  TBase extends Constructor,
  TValidationResult = unknown,
>(Strategy: TBase, name?: string) {
  const BaseStrategy = Strategy as unknown as Constructor<passport.Strategy>;

  abstract class StrategyWithMixin
    extends BaseStrategy
    implements PassportStrategyMixin<TValidationResult>
  {
    public abstract validate(
      ...args: unknown[]
    ): Promise<TValidationResult> | TValidationResult;

    constructor(...args: unknown[]) {
      const callback = async (...params: unknown[]) => {
        const done = params[params.length - 1];
        if (typeof done !== "function") {
          throw new Error(
            "Passport strategy callback is missing done function",
          );
        }

        const doneFn = done as Done;

        try {
          const validateArgs = params.slice(0, -1);
          const user = await this.validate(...validateArgs);
          doneFn(null, user);
        } catch (error) {
          doneFn(error);
        }
      };

      super(...args, callback);
      if (name) {
        strategyInstanceRegistry.set(name, this as StrategyInstance);
        usedPassportNames.add(name);
        passport.use(name, this as passport.Strategy);
      } else {
        // Unnamed strategies are registered by passport under `strategy.name`.
        // Capture that name so cleanup can unregister them too.
        const passportName = (this as { name?: string }).name;
        if (passportName) {
          usedPassportNames.add(passportName);
        }
        passport.use(this as passport.Strategy);
      }
    }
  }

  if (name) {
    if (registeredNames.has(name)) {
      throw new Error(`Passport strategy "${name}" is already registered`);
    }
    registeredNames.add(name);
    strategyClassRegistry.set(
      name,
      StrategyWithMixin as AbstractConstructor<passport.Strategy> as StrategyConstructor,
    );
  }

  return StrategyWithMixin as AbstractConstructor<
    PassportStrategyMixin<TValidationResult>
  > as Constructor<PassportStrategyMixin<TValidationResult>>;
}

export function getRegisteredStrategyClass(
  name: string,
): StrategyConstructor | undefined {
  return strategyClassRegistry.get(name);
}

export function getRegisteredStrategyInstance(
  name: string,
): StrategyInstance | undefined {
  return strategyInstanceRegistry.get(name);
}

/**
 * Reset all strategy bookkeeping and unregister every strategy from the global
 * `passport` singleton.
 *
 * Without this, `passport._strategies`, the local class/instance registries and
 * the used-name set retain the last strategy instance per name for the lifetime
 * of the process (each closing over its DI-injected dependencies), and a second
 * strategy declared under the same name — e.g. two test files each defining a
 * "jwt" strategy — would throw `Passport strategy "..." is already registered`.
 *
 * Invoked by {@link PassportCleanupService} through the application lifecycle
 * (`onModuleDestroy`), so it runs on `app.close()`.
 */
export function clearStrategyRegistries(): void {
  for (const name of usedPassportNames) {
    passport.unuse(name);
  }
  usedPassportNames.clear();
  strategyClassRegistry.clear();
  strategyInstanceRegistry.clear();
  registeredNames.clear();
}
