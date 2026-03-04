# Class: CacheModule

Defined in: [packages/cache/src/cache.module.ts:80](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L80)

Module that provides caching functionality for @kiyasov/elysia-nest.

This module wraps the cache-manager library and provides:
- In-memory caching by default
- Support for Redis and other stores
- Configurable TTL and refresh thresholds
- CacheInterceptor for automatic HTTP caching

## Examples

```typescript
@Module({
  imports: [CacheModule.register({ ttl: 60000 })],
})
export class AppModule {}
```

With async configuration:
```typescript
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        ttl: config.get('CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Public Api

## Extends

- `ConfigurableModuleClass`

## Indexable

```ts
[key: string]: any
```

## Constructors

### Constructor

```ts
new CacheModule(): CacheModule;
```

Defined in: [packages/core/src/module-utils/interfaces/configurable-module-cls.interface.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/module-utils/interfaces/configurable-module-cls.interface.ts#L23)

#### Returns

`CacheModule`

#### Inherited from

```ts
ConfigurableModuleClass.constructor
```

## Methods

### forRoot()

```ts
static forRoot<T>(options?): DynamicModule;
```

Defined in: [packages/cache/src/cache.module.ts:93](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L93)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CacheModuleOptions`](../type-aliases/CacheModuleOptions.md)\<`T`\> |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

***

### forRootAsync()

```ts
static forRootAsync<T>(options): DynamicModule;
```

Defined in: [packages/cache/src/cache.module.ts:99](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L99)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CacheModuleAsyncOptions`](../interfaces/CacheModuleAsyncOptions.md)\<`T`\> |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

***

### register()

```ts
static register<T>(options?): DynamicModule;
```

Defined in: [packages/cache/src/cache.module.ts:81](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L81)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CacheModuleOptions`](../type-aliases/CacheModuleOptions.md)\<`T`\> |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

#### Overrides

```ts
ConfigurableModuleClass.register
```

***

### registerAsync()

```ts
static registerAsync<T>(options): DynamicModule;
```

Defined in: [packages/cache/src/cache.module.ts:87](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L87)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `Record`\<`string`, `unknown`\> | `Record`\<`string`, `unknown`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`CacheModuleAsyncOptions`](../interfaces/CacheModuleAsyncOptions.md)\<`T`\> |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

#### Overrides

```ts
ConfigurableModuleClass.registerAsync
```
