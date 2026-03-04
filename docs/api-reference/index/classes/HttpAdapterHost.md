# Class: HttpAdapterHost

Defined in: [packages/core/src/core/http-adapter.ts:21](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L21)

Host class for accessing the HTTP adapter.
Used to abstract the underlying HTTP server.

## Public Api

## Accessors

### httpAdapter

#### Get Signature

```ts
get httpAdapter(): HttpAdapter | undefined;
```

Defined in: [packages/core/src/core/http-adapter.ts:27](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L27)

Get the HTTP adapter instance

##### Returns

[`HttpAdapter`](../interfaces/HttpAdapter.md) \| `undefined`

#### Set Signature

```ts
set httpAdapter(adapter): void;
```

Defined in: [packages/core/src/core/http-adapter.ts:34](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L34)

Set the HTTP adapter instance

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `adapter` | [`HttpAdapter`](../interfaces/HttpAdapter.md) \| `undefined` |

##### Returns

`void`

## Constructors

### Constructor

```ts
new HttpAdapterHost(): HttpAdapterHost;
```

#### Returns

`HttpAdapterHost`
