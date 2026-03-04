# Interface: HttpAdapter

Defined in: [packages/core/src/core/http-adapter.ts:8](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L8)

Interface for HTTP adapter - abstracts HTTP server operations

## Public Api

## Methods

### getRequestMethod()

```ts
getRequestMethod(request): string;
```

Defined in: [packages/core/src/core/http-adapter.ts:9](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L9)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `unknown` |

#### Returns

`string`

***

### getRequestUrl()

```ts
getRequestUrl(request): string;
```

Defined in: [packages/core/src/core/http-adapter.ts:10](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `request` | `unknown` |

#### Returns

`string`

***

### setHeader()

```ts
setHeader(
   response, 
   name, 
   value): void;
```

Defined in: [packages/core/src/core/http-adapter.ts:11](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/core/http-adapter.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `response` | `unknown` |
| `name` | `string` |
| `value` | `string` |

#### Returns

`void`
