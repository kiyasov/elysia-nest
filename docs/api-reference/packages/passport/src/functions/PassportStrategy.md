# Function: PassportStrategy()

```ts
function PassportStrategy<TBase, TValidationResult>(Strategy, name?): Constructor<PassportStrategyMixin<TValidationResult>>;
```

Defined in: [packages/passport/src/passport-strategy.ts:27](https://github.com/nestelia/nestelia/blob/main/packages/passport/src/passport-strategy.ts#L27)

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
