# Class: SchedulerRegistry

Defined in: [packages/scheduler/src/services/scheduler.service.ts:213](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L213)

Registry for managing multiple schedulers

## Constructors

### Constructor

```ts
new SchedulerRegistry(): SchedulerRegistry;
```

#### Returns

`SchedulerRegistry`

## Methods

### addScheduler()

```ts
addScheduler(name, scheduler): void;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:219](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L219)

Add a scheduler to the registry

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `scheduler` | [`Scheduler`](Scheduler.md) |

#### Returns

`void`

***

### clear()

```ts
clear(): void;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:251](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L251)

Clear all schedulers

#### Returns

`void`

***

### getScheduler()

```ts
getScheduler(name): Scheduler | undefined;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:226](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L226)

Get a scheduler by name

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

[`Scheduler`](Scheduler.md) \| `undefined`

***

### getSchedulerNames()

```ts
getSchedulerNames(): string[];
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:244](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L244)

Get all scheduler names

#### Returns

`string`[]

***

### removeScheduler()

```ts
removeScheduler(name): void;
```

Defined in: [packages/scheduler/src/services/scheduler.service.ts:233](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/services/scheduler.service.ts#L233)

Remove a scheduler from the registry

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`void`
