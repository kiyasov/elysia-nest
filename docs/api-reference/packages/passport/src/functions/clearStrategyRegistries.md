# Function: clearStrategyRegistries()

```ts
function clearStrategyRegistries(): void;
```

Defined in: [packages/passport/src/passport-strategy.ts:119](https://github.com/nestelia/nestelia/blob/main/packages/passport/src/passport-strategy.ts#L119)

Reset all strategy bookkeeping and unregister every strategy from the global
`passport` singleton.

Without this, `passport._strategies`, the local class/instance registries and
the used-name set retain the last strategy instance per name for the lifetime
of the process (each closing over its DI-injected dependencies), and a second
strategy declared under the same name — e.g. two test files each defining a
"jwt" strategy — would throw `Passport strategy "..." is already registered`.

Invoked by PassportCleanupService through the application lifecycle
(`onModuleDestroy`), so it runs on `app.close()`.

## Returns

`void`
