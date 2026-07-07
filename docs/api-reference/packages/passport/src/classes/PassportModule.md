# Class: PassportModule

Defined in: [packages/passport/src/passport.module.ts:17](https://github.com/nestelia/nestelia/blob/main/packages/passport/src/passport.module.ts#L17)

PassportModule registers PassportCleanupService, which clears the
strategy registries on application shutdown to prevent memory leaks across
application restarts.

Note: the cleanup MUST live on an injectable provider, not on this module
class. `@Module` replaces the class with a factory function that is never
instantiated, so lifecycle hooks declared here would never fire.

## Constructors

### Constructor

```ts
new PassportModule(): PassportModule;
```

#### Returns

`PassportModule`
