# Type Alias: ConfigurableModuleCls\<ModuleOptions, MethodKey, FactoryClassMethodKey, ExtraModuleDefinitionOptions\>

```ts
type ConfigurableModuleCls<ModuleOptions, MethodKey, FactoryClassMethodKey, ExtraModuleDefinitionOptions> = () => any & Record<`${MethodKey}`, (options) => DynamicModule> & Record<`${MethodKey}Async`, (options) => DynamicModule>;
```

Defined in: [packages/core/src/module-utils/interfaces/configurable-module-cls.interface.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/interfaces/configurable-module-cls.interface.ts#L16)

Class that represents a blueprint/prototype for a configurable Nest module.
This class provides static methods for constructing dynamic modules. Their names
can be controlled through the "MethodKey" type argument.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `ModuleOptions` | - |
| `MethodKey` *extends* `string` | *typeof* `DEFAULT_METHOD_KEY` |
| `FactoryClassMethodKey` *extends* `string` | *typeof* `DEFAULT_FACTORY_CLASS_METHOD_KEY` |
| `ExtraModuleDefinitionOptions` | \{ \} |

## Public Api
