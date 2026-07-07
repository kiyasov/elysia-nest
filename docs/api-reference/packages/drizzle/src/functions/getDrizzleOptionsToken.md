# Function: getDrizzleOptionsToken()

```ts
function getDrizzleOptionsToken(token): string;
```

Defined in: [packages/drizzle/src/drizzle.constants.ts:36](https://github.com/nestelia/nestelia/blob/main/packages/drizzle/src/drizzle.constants.ts#L36)

**`Internal`**

Builds the per-instance options token for a given drizzle instance token.

Each `DrizzleModule` registration provides (and injects) its options under
this unique token — keyed by the instance token (default `DRIZZLE_INSTANCE`
or a custom `tag`). Keeping the token unique prevents a second registration
from overwriting the first registration's options when core merges the
deduped `DrizzleModule` scope, which previously caused every drizzle
instance to collapse onto the last-registered db.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | `string` \| `symbol` | The drizzle instance token (default or a custom `tag`). |

## Returns

`string`

A stable string token unique to this instance.
