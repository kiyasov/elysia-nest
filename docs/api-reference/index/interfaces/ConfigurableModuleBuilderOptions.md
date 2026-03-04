# Interface: ConfigurableModuleBuilderOptions

Defined in: [packages/core/src/module-utils/configurable-module.builder.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/configurable-module.builder.ts#L23)

## Public Api

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="alwaystransient"></a> `alwaysTransient?` | `boolean` | Indicates whether module should always be "transient" - meaning, every time you call the static method to construct a dynamic module, regardless of what arguments you pass in, a new "unique" module will be created. **Default** `false` | [packages/core/src/module-utils/configurable-module.builder.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/configurable-module.builder.ts#L44) |
| <a id="modulename"></a> `moduleName?` | `string` | By default, an UUID will be used as a module options provider token. Explicitly specifying the "moduleName" will instruct the "ConfigurableModuleBuilder" to use a more descriptive provider token. For example, `moduleName: "Cache"` will auto-generate the provider token: "CACHE_MODULE_OPTIONS". | [packages/core/src/module-utils/configurable-module.builder.ts:36](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/configurable-module.builder.ts#L36) |
| <a id="optionsinjectiontoken"></a> `optionsInjectionToken?` | `string` \| `symbol` | Specifies what injection token should be used for the module options provider. By default, an auto-generated UUID will be used. | [packages/core/src/module-utils/configurable-module.builder.ts:28](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/configurable-module.builder.ts#L28) |
