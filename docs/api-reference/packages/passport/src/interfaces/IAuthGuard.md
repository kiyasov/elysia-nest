# Interface: IAuthGuard

Defined in: [packages/passport/src/auth.guard.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/passport/src/auth.guard.ts#L22)

Interface for guards

## Extends

- [`CanActivate`](../../../../index/interfaces/CanActivate.md)

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
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) | The execution context |

#### Returns

`boolean` \| `Promise`\<`boolean`\>

#### Inherited from

[`CanActivate`](../../../../index/interfaces/CanActivate.md).[`canActivate`](../../../../index/interfaces/CanActivate.md#canactivate)

***

### getRequest()

```ts
getRequest(context): unknown;
```

Defined in: [packages/passport/src/auth.guard.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/passport/src/auth.guard.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | [`ExecutionContext`](../../../../index/interfaces/ExecutionContext.md) |

#### Returns

`unknown`

***

### handleRequest()

```ts
handleRequest<TUser>(
   err, 
   user, 
   info?, ...
   rest): unknown;
```

Defined in: [packages/passport/src/auth.guard.ts:24](https://github.com/kiyasov/elysia-nest/blob/main/packages/passport/src/auth.guard.ts#L24)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TUser` | `unknown` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `unknown` |
| `user` | `TUser` |
| `info?` | `unknown` |
| ...`rest?` | `unknown`[] |

#### Returns

`unknown`
