# Class: ApolloShutdownService

Defined in: [packages/apollo/src/graphql.module.ts:27](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L27)

Internal provider that shuts the Apollo Server down on application
teardown. It disposes every live WebSocket connection (clearing their
keep-alive intervals and init timers) and stops the ApolloServer's
background machinery, preventing a per-restart leak.

It is registered in the module's `providers` so the DI container resolves
it. NOTE the framework lifecycle contract: a provider's `onModuleDestroy`
only fires if it ALSO implements `onModuleInit`, so this class implements
both. Module CLASSES (like [GraphQLModule](GraphQLModule.md)) never receive lifecycle
hooks — the cleanup must live in an injectable provider such as this one.

## Implements

- [`OnModuleInit`](../../../../index/interfaces/OnModuleInit.md)
- [`OnModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md)

## Constructors

### Constructor

```ts
new ApolloShutdownService(apolloService): ApolloShutdownService;
```

Defined in: [packages/apollo/src/graphql.module.ts:28](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `apolloService` | [`ApolloService`](ApolloService.md) |

#### Returns

`ApolloShutdownService`

## Methods

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [packages/apollo/src/graphql.module.ts:42](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L42)

Stops the Apollo Server and disposes all WebSocket connections.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`OnModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md).[`onModuleDestroy`](../../../../index/interfaces/OnModuleDestroy.md#onmoduledestroy)

***

### onModuleInit()

```ts
onModuleInit(): void;
```

Defined in: [packages/apollo/src/graphql.module.ts:37](https://github.com/nestelia/nestelia/blob/main/packages/apollo/src/graphql.module.ts#L37)

Intentionally empty. Required so the destroy hook is registered — the
lifecycle manager only wires `onModuleDestroy` for providers that also
implement `onModuleInit`.

#### Returns

`void`

#### Implementation of

[`OnModuleInit`](../../../../index/interfaces/OnModuleInit.md).[`onModuleInit`](../../../../index/interfaces/OnModuleInit.md#onmoduleinit)
