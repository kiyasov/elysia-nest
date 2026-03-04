# Class: CacheModule

Defined in: [packages/cache/src/cache.module.ts:74](https://github.com/kiyasov/elysia-nest/blob/main/packages/cache/src/cache.module.ts#L74)

Module that provides caching functionality for @kiyasov/elysia-nest.

This module wraps the cache-manager library and provides:
- In-memory caching by default
- Support for Redis and other stores
- Configurable TTL and refresh thresholds
- CacheInterceptor for automatic HTTP caching

## Examples

Basic usage:
```typescript
@Module({
  imports: [CacheModule.register()],
})
export class AppModule {}
```

With Redis:
```typescript
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ttl: 60000,
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

## Properties

| Property | Modifier | Type | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="register"></a> `register` | `static` | (`options`) => [`DynamicModule`](../../../../index/interfaces/DynamicModule.md) | `ConfigurableModuleClass.register` |  |
| <a id="registerasync"></a> `registerAsync` | `static` | (`options`) => [`DynamicModule`](../../../../index/interfaces/DynamicModule.md) | `ConfigurableModuleClass.registerAsync` |  |
