# Interface: HttpArgumentsHost

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:6](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L6)

HTTP context interface for request/response access

## Public Api

## Methods

### getNext()

```ts
getNext<T>(): T;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L9)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Returns

`T`

***

### getRequest()

```ts
getRequest<T>(): T;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:7](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L7)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Returns

`T`

***

### getResponse()

```ts
getResponse<T>(): T;
```

Defined in: [packages/core/src/interfaces/execution-context.interface.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/execution-context.interface.ts#L8)

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

#### Returns

`T`
