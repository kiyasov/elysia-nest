# Interface: EventEmitter

Defined in: [packages/core/src/events/index.ts:2](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/events/index.ts#L2)

## Methods

### emit()

```ts
emit(event, data?): void;
```

Defined in: [packages/core/src/events/index.ts:4](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/events/index.ts#L4)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `data?` | `unknown` |

#### Returns

`void`

***

### on()

```ts
on(event, callback): void;
```

Defined in: [packages/core/src/events/index.ts:5](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/events/index.ts#L5)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `callback` | (`data`) => `void` |

#### Returns

`void`
