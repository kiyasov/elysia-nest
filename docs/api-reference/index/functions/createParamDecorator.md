# Function: createParamDecorator()

## Call Signature

```ts
function createParamDecorator(factory): () => ParameterDecorator;
```

Defined in: [packages/core/src/decorators/http.decorators.ts:37](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/http.decorators.ts#L37)

### Parameters

| Parameter | Type |
| ------ | ------ |
| `factory` | `CustomParamFactory` |

### Returns

```ts
(): ParameterDecorator;
```

#### Returns

`ParameterDecorator`

## Call Signature

```ts
function createParamDecorator(type, data?): () => ParameterDecorator;
```

Defined in: [packages/core/src/decorators/http.decorators.ts:40](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/http.decorators.ts#L40)

### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `string` |
| `data?` | `string` |

### Returns

```ts
(): ParameterDecorator;
```

#### Returns

`ParameterDecorator`
