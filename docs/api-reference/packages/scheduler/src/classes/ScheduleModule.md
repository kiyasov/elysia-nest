# Class: ScheduleModule

Defined in: [packages/scheduler/src/schedule.module.ts:33](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/schedule.module.ts#L33)

Module for scheduling tasks (cron, interval, timeout)

## Constructors

### Constructor

```ts
new ScheduleModule(): ScheduleModule;
```

#### Returns

`ScheduleModule`

## Methods

### forRoot()

```ts
static forRoot(): DynamicModule;
```

Defined in: [packages/scheduler/src/schedule.module.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/schedule.module.ts#L37)

Configure the scheduling module with default options

#### Returns

`DynamicModule`

***

### forRootWithOptions()

```ts
static forRootWithOptions(options): DynamicModule;
```

Defined in: [packages/scheduler/src/schedule.module.ts:44](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/schedule.module.ts#L44)

Configure the scheduling module with custom options

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ScheduleModuleOptions`](../interfaces/ScheduleModuleOptions.md) |

#### Returns

`DynamicModule`
