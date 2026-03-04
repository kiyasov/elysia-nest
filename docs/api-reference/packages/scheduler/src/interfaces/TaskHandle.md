# Interface: TaskHandle

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:56](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L56)

Task handle for controlling scheduled tasks

## Methods

### cancel()

```ts
cancel(): void;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:70](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L70)

Cancel the task

#### Returns

`void`

***

### isCanceled()

```ts
isCanceled(): boolean;
```

Defined in: [packages/scheduler/src/interfaces/scheduler.interface.ts:75](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L75)

Check if the task is canceled

#### Returns

`boolean`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="id"></a> `id` | `string` | Unique task identifier | [packages/scheduler/src/interfaces/scheduler.interface.ts:60](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L60) |
| <a id="name"></a> `name` | `string` | Task name | [packages/scheduler/src/interfaces/scheduler.interface.ts:65](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/scheduler.interface.ts#L65) |
