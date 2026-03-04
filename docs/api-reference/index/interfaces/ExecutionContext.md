# Interface: ExecutionContext

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L39)

Execution context interface providing access to
the request/response and handler information

## Public Api

## Methods

### getArgByIndex()

```ts
getArgByIndex<T>(index): T;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:53](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L53)

Get argument by index

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `number` |

#### Returns

`T`

***

### getArgs()

```ts
getArgs<T>(): T;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:58](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L58)

Get all arguments

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `any`[] | `any`[] |

#### Returns

`T`

***

### getClass()

```ts
getClass<T>(): T;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:43](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L43)

Returns the class of the current handler

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Returns

`T`

***

### getHandler()

```ts
getHandler(): (...args) => unknown;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:48](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L48)

Returns the handler function

#### Returns

```ts
(...args): unknown;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `unknown`[] |

##### Returns

`unknown`

***

### getType()

```ts
getType<TContext>(): TContext;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:63](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L63)

Get type of the context

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `TContext` *extends* `string` | `string` |

#### Returns

`TContext`

***

### switchToHttp()

```ts
switchToHttp(): HttpArgumentsHost;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:68](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L68)

Switch to HTTP context

#### Returns

[`HttpArgumentsHost`](HttpArgumentsHost.md)

***

### switchToRpc()

```ts
switchToRpc(): RpcArgumentsHost;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:73](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L73)

Switch to RPC context

#### Returns

[`RpcArgumentsHost`](RpcArgumentsHost.md)

***

### switchToWs()

```ts
switchToWs(): WsArgumentsHost;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:78](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L78)

Switch to WebSocket context

#### Returns

[`WsArgumentsHost`](WsArgumentsHost.md)
