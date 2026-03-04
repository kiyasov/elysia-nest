# Interface: ScheduledTask

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:81](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L81)

Base interface for a scheduled task

## Methods

### cancel()

```ts
cancel(): void;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:95](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L95)

Cancel the task

#### Returns

`void`

***

### getHandle()

```ts
getHandle(): TaskHandle;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:105](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L105)

Get task handle

#### Returns

[`TaskHandle`](TaskHandle.md)

***

### isCanceled()

```ts
isCanceled(): boolean;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:100](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L100)

Check if the task is canceled

#### Returns

`boolean`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `string` | Unique task identifier | [packages/scheduler/src/interfaces/scheduler.interface.ts:85](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L85) |
| <a id="name"></a> `name` | `string` | Task name | [packages/scheduler/src/interfaces/scheduler.interface.ts:90](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L90) |
