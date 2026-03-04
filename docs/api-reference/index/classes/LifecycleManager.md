# Class: LifecycleManager

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L12)

Class to manage lifecycle hooks across the application

## Constructors

### Constructor

```ts
new LifecycleManager(): LifecycleManager;
```

#### Returns

`LifecycleManager`

## Methods

### register()

```ts
register(provider): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L18)

Register a provider with lifecycle hooks

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `provider` | `any` |

#### Returns

`void`

***

### triggerBeforeApplicationShutdown()

```ts
triggerBeforeApplicationShutdown(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:69](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L69)

Trigger beforeApplicationShutdown hooks for all registered providers

#### Returns

`void`

***

### triggerOnApplicationBootstrap()

```ts
triggerOnApplicationBootstrap(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:41](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L41)

Trigger onApplicationBootstrap hooks for all registered providers

#### Returns

`void`

***

### triggerOnApplicationShutdown()

```ts
triggerOnApplicationShutdown(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:83](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L83)

Trigger onApplicationShutdown hooks for all registered providers

#### Returns

`void`

***

### triggerOnModuleDestroy()

```ts
triggerOnModuleDestroy(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:55](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L55)

Trigger onModuleDestroy hooks for all registered providers

#### Returns

`void`

***

### triggerOnModuleInit()

```ts
triggerOnModuleInit(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L27)

Trigger onModuleInit hooks for all registered providers

#### Returns

`void`
