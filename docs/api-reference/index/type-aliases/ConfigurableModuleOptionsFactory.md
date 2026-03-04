# Type Alias: ConfigurableModuleOptionsFactory\<ModuleOptions, FactoryClassMethodKey\>

```ts
type ConfigurableModuleOptionsFactory<ModuleOptions, FactoryClassMethodKey> = Record<`${FactoryClassMethodKey}`, () => Promise<ModuleOptions> | ModuleOptions>;
```

Defined in: [packages/core/src/module-utils/interfaces/configurable-module-async-options.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/interfaces/configurable-module-async-options.interface.ts#L15)

Interface that must be implemented by the module options factory class.
Method key varies depending on the "FactoryClassMethodKey" type argument.

## Type Parameters

| Type Parameter |
| ------ |
| `ModuleOptions` |
| `FactoryClassMethodKey` *extends* `string` |

## Public Api
