# Class: GraphQLModule

Defined in: [packages/apollo/src/graphql.module.ts:61](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L61)

GraphQL module for nestelia backed by Apollo Server.
Provides static and async configuration methods.

## Example

```typescript
GraphQLModule.forRoot({
  path: "/graphql",
  autoSchemaFile: true,
  playground: true,
})
```

## Implements

- [`OnModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md)

## Constructors

### Constructor

```ts
new GraphQLModule(): GraphQLModule;
```

#### Returns

`GraphQLModule`

## Methods

### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [packages/apollo/src/graphql.module.ts:62](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L62)

#### Returns

`void`

#### Implementation of

[`OnModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md).[`onModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md#onmoduledestroy)

***

### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [packages/apollo/src/graphql.module.ts:91](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L91)

Configures GraphQL with static options.
The Apollo Server is started eagerly during module bootstrap.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ApolloOptions`](../interfaces/ApolloOptions.md) | GraphQL configuration options. |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

Dynamic module configuration.

#### Example

```typescript
import { ElysiaFactory } from 'nestelia';

const app = await ElysiaFactory.create(AppModule);

@Module({
  imports: [
    GraphQLModule.forRoot({
      path: '/graphql',
      autoSchemaFile: true,
      playground: true,
    })
  ]
})
class AppModule {}
```

***

### forRootAsync()

```ts
static forRootAsync(options): DynamicModule;
```

Defined in: [packages/apollo/src/graphql.module.ts:140](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L140)

Configures GraphQL with async options resolved from the DI container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `inject?`: [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md)[]; `useFactory`: (...`args`) => \| [`ApolloOptions`](../interfaces/ApolloOptions.md)\<`unknown`\> \| `Promise`\<[`ApolloOptions`](../interfaces/ApolloOptions.md)\<`unknown`\>\>; \} | Async configuration options. |
| `options.inject?` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md)[] | - |
| `options.useFactory` | (...`args`) => \| [`ApolloOptions`](../interfaces/ApolloOptions.md)\<`unknown`\> \| `Promise`\<[`ApolloOptions`](../interfaces/ApolloOptions.md)\<`unknown`\>\> | - |

#### Returns

[`DynamicModule`](../../../../index/interfaces/DynamicModule.md)

Dynamic module configuration.

#### Example

```typescript
GraphQLModule.forRootAsync({
  useFactory: async (configService: ConfigService) => ({
    path: '/graphql',
    autoSchemaFile: true,
    playground: configService.get('NODE_ENV') !== 'production',
  }),
  inject: [ConfigService],
})
```
