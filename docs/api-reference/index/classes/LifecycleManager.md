# Class: LifecycleManager

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:10](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L10)

Class to manage lifecycle hooks across the application

## Constructors

### Constructor

```ts
new LifecycleManager(): LifecycleManager;
```

#### Returns

`LifecycleManager`

## Methods

### clear()

```ts
clear(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:104](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L104)

Clear all registered providers to prevent memory leaks

#### Returns

`void`

***

### register()

```ts
register(provider): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:47](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L47)

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
triggerBeforeApplicationShutdown(): Promise<void>;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:97](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L97)

Trigger beforeApplicationShutdown hooks for all registered providers.
Awaits async hooks so cleanup completes before the caller proceeds.

#### Returns

`Promise`\<`void`\>

***

### triggerOnApplicationBootstrap()

```ts
triggerOnApplicationBootstrap(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:70](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L70)

Trigger onApplicationBootstrap hooks for all registered providers

#### Returns

`void`

***

### triggerOnApplicationShutdown()

```ts
triggerOnApplicationShutdown(): Promise<void>;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:113](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L113)

Trigger onApplicationShutdown hooks for all registered providers.
Awaits async hooks so cleanup completes before the caller proceeds.

#### Returns

`Promise`\<`void`\>

***

### triggerOnModuleDestroy()

```ts
triggerOnModuleDestroy(): Promise<void>;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:89](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L89)

Trigger onModuleDestroy hooks for all registered providers.
Awaits async hooks so cleanup completes before the caller proceeds.

#### Returns

`Promise`\<`void`\>

***

### triggerOnModuleInit()

```ts
triggerOnModuleInit(): void;
```

Defined in: [packages/core/src/lifecycle/lifecycle-manager.ts:56](https://github.com/nestelia/nestelia/blob/main/packages/core/src/lifecycle/lifecycle-manager.ts#L56)

Trigger onModuleInit hooks for all registered providers

#### Returns

`void`
