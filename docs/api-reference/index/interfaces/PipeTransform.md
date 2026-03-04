# Interface: PipeTransform

Defined in: [packages/core/src/pipes/pipe.interface.ts:12](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/pipes/pipe.interface.ts#L12)

Interface for pipes

## Methods

### transform()

```ts
transform(value, metadata?): any;
```

Defined in: [packages/core/src/pipes/pipe.interface.ts:18](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/pipes/pipe.interface.ts#L18)

Method to transform input data

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | The value to transform |
| `metadata?` | [`PipeMetadata`](PipeMetadata.md) | Additional metadata |

#### Returns

`any`
