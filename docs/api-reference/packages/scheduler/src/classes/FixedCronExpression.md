# Class: FixedCronExpression

Defined in: [packages/scheduler/src/interfaces/cron.interface.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/cron.interface.ts#L14)

Fixed cron expression

## Implements

- [`CronExpression`](../interfaces/CronExpression.md)

## Constructors

### Constructor

```ts
new FixedCronExpression(expression): FixedCronExpression;
```

Defined in: [packages/scheduler/src/interfaces/cron.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/cron.interface.ts#L15)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expression` | `string` |

#### Returns

`FixedCronExpression`

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [packages/scheduler/src/interfaces/cron.interface.ts:17](https://github.com/kiyasov/elysia-nest/blob/main/packages/scheduler/src/interfaces/cron.interface.ts#L17)

Convert to a string representation

#### Returns

`string`

#### Implementation of

[`CronExpression`](../interfaces/CronExpression.md).[`toString`](../interfaces/CronExpression.md#tostring)
