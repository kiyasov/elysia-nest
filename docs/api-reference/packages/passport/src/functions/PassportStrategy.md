# Function: PassportStrategy()

```ts
function PassportStrategy<TBase, TValidationResult>(Strategy, name?): Constructor<PassportStrategyMixin<TValidationResult>>;
```

Defined in: [packages/passport/src/passport-strategy.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/passport/src/passport-strategy.ts#L18)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TBase` *extends* `Constructor`\<`object`\> | - |
| `TValidationResult` | `unknown` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `Strategy` | `TBase` |
| `name?` | `string` |

## Returns

`Constructor`\<`PassportStrategyMixin`\<`TValidationResult`\>\>
