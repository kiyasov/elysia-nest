# Class: GraphQLPubSubModule

Defined in: [packages/graphql-pubsub/src/graphql-pubsub.module.ts:91](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L91)

Feature module that provides a [RedisPubSub](RedisPubSub.md) instance for use with
GraphQL subscriptions.

Register it once at the root level using [forRoot](#forroot) or
[forRootAsync](#forrootasync), then inject the instance anywhere with
`@Inject(GRAPHQL_PUBSUB)` or the [InjectPubSub](../functions/InjectPubSub.md) shortcut.

## Example

```typescript
// Synchronous — static Redis options
@Module({
  imports: [
    GraphQLPubSubModule.forRoot({
      useValue: { connection: { host: "localhost", port: 6379 } },
    }),
  ],
})
export class AppModule {}

// Asynchronous — derive options from another provider
@Module({
  imports: [
    GraphQLPubSubModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: { host: config.get("REDIS_HOST"), port: 6379 },
      }),
    }),
  ],
})
export class AppModule {}
```

## Constructors

### Constructor

```ts
new GraphQLPubSubModule(): GraphQLPubSubModule;
```

#### Returns

`GraphQLPubSubModule`

## Methods

### forRoot()

```ts
static forRoot(options?): typeof GraphQLPubSubModuleCore;
```

Defined in: [packages/graphql-pubsub/src/graphql-pubsub.module.ts:98](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L98)

Registers the module with a synchronous configuration.

The returned class is decorated with `@Global` by default (override with
`isGlobal: false`).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`GraphQLPubSubModuleOptions`](../interfaces/GraphQLPubSubModuleOptions.md) |

#### Returns

*typeof* [`GraphQLPubSubModuleCore`](GraphQLPubSubModuleCore.md)

***

### forRootAsync()

```ts
static forRootAsync(options): typeof GraphQLPubSubModuleCore;
```

Defined in: [packages/graphql-pubsub/src/graphql-pubsub.module.ts:154](https://github.com/kiyasov/elysia-nest/blob/main/packages/graphql-pubsub/src/graphql-pubsub.module.ts#L154)

Registers the module with an asynchronous configuration.

The `useFactory` is resolved once by the DI container and its result is
stored under the [GRAPHQL\_PUBSUB\_OPTIONS](../variables/GRAPHQL_PUBSUB_OPTIONS.md) token. The
[GRAPHQL\_PUBSUB](../variables/GRAPHQL_PUBSUB.md) provider then receives the resolved options
as its first argument.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `inject?`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md)[]; `isGlobal?`: `boolean`; `useFactory`: (...`args`) => \| [`RedisPubSubOptions`](../interfaces/RedisPubSubOptions.md) \| `Promise`\<[`RedisPubSubOptions`](../interfaces/RedisPubSubOptions.md)\>; \} |
| `options.inject?` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md)[] |
| `options.isGlobal?` | `boolean` |
| `options.useFactory` | (...`args`) => \| [`RedisPubSubOptions`](../interfaces/RedisPubSubOptions.md) \| `Promise`\<[`RedisPubSubOptions`](../interfaces/RedisPubSubOptions.md)\> |

#### Returns

*typeof* [`GraphQLPubSubModuleCore`](GraphQLPubSubModuleCore.md)

#### Example

```typescript
GraphQLPubSubModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    connection: { host: await config.getRedisHost(), port: 6379 },
  }),
});
```
