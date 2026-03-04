# Interface: CacheModuleAsyncOptions\<T\>

Defined in: [packages/cache/src/interfaces/cache-module.interface.ts:76](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L76)

Options for dynamically (asynchronously) configuring the Cache module.

This interface provides multiple ways to configure the cache module:
- useFactory: Use a factory function
- useClass: Use a class implementing CacheOptionsFactory
- useExisting: Use an existing provider

## Public Api

## Extends

- [`ConfigurableModuleAsyncOptions`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md)\<[`CacheOptions`](../type-aliases/CacheOptions.md)\<`T`\>, keyof [`CacheOptionsFactory`](CacheOptionsFactory.md)\>

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `T` *extends* `StoreConfigRecord` | `StoreConfigRecord` | Store-specific configuration type. |

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="extraproviders"></a> `extraProviders?` | [`Provider`](../../../../index/type-aliases/Provider.md)[] | Extra providers to be registered within the scope of this module. Useful for providing dependencies required by the factory function. **Example** `extraProviders: [RedisService]` | - | - | [packages/cache/src/interfaces/cache-module.interface.ts:144](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L144) |
| <a id="imports"></a> `imports?` | ( \| [`Type`](../../../../index/interfaces/Type.md)\<`unknown`\> \| [`DynamicModule`](../../../../index/interfaces/DynamicModule.md))[] | - | - | [`ModuleMetadata`](../../../../index/interfaces/ModuleMetadata.md).[`imports`](../../../../index/interfaces/ModuleMetadata.md#imports) | [packages/core/src/interfaces/index.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/index.ts#L9) |
| <a id="inject"></a> `inject?` | ( \| [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) \| \{ `optional?`: `boolean`; `token`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md); \})[] | Dependencies that the factory may inject. **Example** `inject: [ConfigService, RedisService]` | [`ConfigurableModuleAsyncOptions`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md).[`inject`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md#inject) | - | [packages/cache/src/interfaces/cache-module.interface.ts:132](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L132) |
| <a id="isglobal"></a> `isGlobal?` | `boolean` | If `true`, register `CacheModule` as a global module. **Default** `false` | - | - | [packages/cache/src/interfaces/cache-module.interface.ts:151](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L151) |
| <a id="provideinjectiontokensfrom"></a> `provideInjectionTokensFrom?` | [`Provider`](../../../../index/type-aliases/Provider.md)[] | List of parent module's providers that will be filtered to only provide necessary providers for the 'inject' array useful to pass options to nested async modules | - | [`ConfigurableModuleAsyncOptions`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md).[`provideInjectionTokensFrom`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md#provideinjectiontokensfrom) | [packages/core/src/module-utils/interfaces/configurable-module-async-options.interface.ts:62](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/interfaces/configurable-module-async-options.interface.ts#L62) |
| <a id="useclass"></a> `useClass?` | [`Type`](../../../../index/interfaces/Type.md)\<[`CacheOptionsFactory`](CacheOptionsFactory.md)\<`T`\>\> | Injection token resolving to a class that will be instantiated as a provider. The class must implement the `CacheOptionsFactory` interface. **Example** `useClass: CacheConfigService` | [`ConfigurableModuleAsyncOptions`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md).[`useClass`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md#useclass) | - | [packages/cache/src/interfaces/cache-module.interface.ts:102](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L102) |
| <a id="useexisting"></a> `useExisting?` | [`Type`](../../../../index/interfaces/Type.md)\<[`CacheOptionsFactory`](CacheOptionsFactory.md)\<`T`\>\> | Injection token resolving to an existing provider. The provider must implement the `CacheOptionsFactory` interface. **Example** `useExisting: ConfigService` | [`ConfigurableModuleAsyncOptions`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md).[`useExisting`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md#useexisting) | - | [packages/cache/src/interfaces/cache-module.interface.ts:91](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L91) |
| <a id="usefactory"></a> `useFactory?` | (...`args`) => \| [`CacheOptions`](../type-aliases/CacheOptions.md)\<`T`\> \| `Promise`\<[`CacheOptions`](../type-aliases/CacheOptions.md)\<`T`\>\> | Function returning options (or a Promise resolving to options) to configure the cache module. **Example** `useFactory: (configService: ConfigService) => ({ ttl: configService.get('CACHE_TTL'), store: redisStore, }), inject: [ConfigService],` | [`ConfigurableModuleAsyncOptions`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md).[`useFactory`](../../../../index/interfaces/ConfigurableModuleAsyncOptions.md#usefactory) | - | [packages/cache/src/interfaces/cache-module.interface.ts:120](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/interfaces/cache-module.interface.ts#L120) |
