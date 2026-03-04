# Type Alias: SubscribeFn()

```ts
type SubscribeFn = (root, args, context, info) => AsyncIterator<unknown>;
```

Defined in: [packages/apollo/src/decorators/subscription.decorator.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/apollo/src/decorators/subscription.decorator.ts#L8)

Subscribe function type for subscriptions.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `root` | `unknown` |
| `args` | `Record`\<`string`, `unknown`\> |
| `context` | `unknown` |
| `info` | `unknown` |

## Returns

`AsyncIterator`\<`unknown`\>
