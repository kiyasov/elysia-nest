# Interface: CanActivate

Defined in: [packages/core/src/guards/guard.interface.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/guards/guard.interface.ts#L11)

Interface for guards

## Extended by

- [`IAuthGuard`](../../packages/passport/src/interfaces/IAuthGuard.md)

## Methods

### canActivate()

```ts
canActivate(context): boolean | Promise<boolean>;
```

Defined in: [packages/core/src/guards/guard.interface.ts:16](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/guards/guard.interface.ts#L16)

Method to determine if a request should proceed

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`ExecutionContext`](ExecutionContext.md) | The execution context |

#### Returns

`boolean` \| `Promise`\<`boolean`\>
