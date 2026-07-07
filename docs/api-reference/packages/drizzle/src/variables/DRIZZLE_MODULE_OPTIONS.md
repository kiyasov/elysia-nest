# Variable: DRIZZLE\_MODULE\_OPTIONS

```ts
const DRIZZLE_MODULE_OPTIONS: "DRIZZLE_MODULE_OPTIONS" = "DRIZZLE_MODULE_OPTIONS";
```

Defined in: [packages/drizzle/src/drizzle.constants.ts:19](https://github.com/nestelia/nestelia/blob/main/packages/drizzle/src/drizzle.constants.ts#L19)

**`Internal`**

Base injection token for the raw Drizzle module options object.

Never inject this token directly — options are registered under a
per-instance token derived via [getDrizzleOptionsToken](../functions/getDrizzleOptionsToken.md) so that
multiple `DrizzleModule` registrations never collide on a shared token.
