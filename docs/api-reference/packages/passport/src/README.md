# packages/passport/src

## Classes

| Class | Description |
| ------ | ------ |
| [PassportModule](classes/PassportModule.md) | PassportModule registers PassportCleanupService, which clears the strategy registries on application shutdown to prevent memory leaks across application restarts. |

## Functions

| Function | Description |
| ------ | ------ |
| [AuthGuard](functions/AuthGuard.md) | - |
| [clearStrategyRegistries](functions/clearStrategyRegistries.md) | Reset all strategy bookkeeping and unregister every strategy from the global `passport` singleton. |
| [PassportStrategy](functions/PassportStrategy.md) | - |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [IAuthGuard](interfaces/IAuthGuard.md) | Interface for guards |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [Type](type-aliases/Type.md) | - |
