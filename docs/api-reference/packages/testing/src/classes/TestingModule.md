# Class: TestingModule

Defined in: [packages/testing/src/testing.module-builder.ts:327](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L327)

Compiled testing module with methods to access providers

## Accessors

### container

#### Get Signature

```ts
get container(): Container;
```

Defined in: [packages/testing/src/testing.module-builder.ts:410](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L410)

Get the container instance

##### Returns

[`Container`](../../../../index/classes/Container.md)

***

### module

#### Get Signature

```ts
get module(): Module;
```

Defined in: [packages/testing/src/testing.module-builder.ts:403](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L403)

Get the module reference

##### Returns

`Module`

## Constructors

### Constructor

```ts
new TestingModule(
   _module, 
   _container, 
   _instances?): TestingModule;
```

Defined in: [packages/testing/src/testing.module-builder.ts:328](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L328)

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `_module` | `Module` | `undefined` | - |
| `_container` | [`Container`](../../../../index/classes/Container.md) | `undefined` | - |
| `_instances` | `unknown`[] | `[]` | Resolved provider instances collected during compile(), in registration order. Used to drive the destroy lifecycle hooks on close(). |

#### Returns

`TestingModule`

## Methods

### close()

```ts
close(): Promise<void>;
```

Defined in: [packages/testing/src/testing.module-builder.ts:438](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L438)

Clean up the testing module, firing destroy lifecycle hooks and releasing
the resources this module owns.

Fires the destroy hooks in NestJS order — onModuleDestroy →
beforeApplicationShutdown → onApplicationShutdown — over every collected
provider instance, awaiting each so async cleanup (closing DB/Redis/
RabbitMQ connections, draining workers) settles before close() resolves.
Runs best-effort: a throwing hook is logged and never prevents the
remaining hooks from running.

Note: this intentionally does NOT call `Container.clear()`. That method
wipes PROCESS-GLOBAL singletons — the lifecycle manager, the global
exception filters, the global event emitter and the schema cache — which
are shared with real applications booted via createElysiaApplication and
with other tests. Clearing them here would silently destroy an unrelated
running app's lifecycle registrations / filters / listeners.

The isolated test container created in compile() is not registered in any
global registry, so once this TestingModule is dropped it becomes eligible
for garbage collection on its own. Container exposes no instance-scoped
clear (adding one would require a core change, which is out of scope), so
we clear only the state we own here: the collected instance list.

#### Returns

`Promise`\<`void`\>

***

### get()

```ts
get<T>(token): T;
```

Defined in: [packages/testing/src/testing.module-builder.ts:342](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L342)

Get a provider instance from the module.
Synchronous - returns already resolved instance.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`T`

***

### has()

```ts
has(token): boolean;
```

Defined in: [packages/testing/src/testing.module-builder.ts:391](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L391)

Check if provider exists in module

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`boolean`

***

### resolve()

```ts
resolve<T>(token): Promise<T>;
```

Defined in: [packages/testing/src/testing.module-builder.ts:376](https://github.com/nestelia/nestelia/blob/main/packages/testing/src/testing.module-builder.ts#L376)

Resolve a provider instance (async, for request-scoped providers)

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`Promise`\<`T`\>
