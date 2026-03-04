# Variable: Files()

```ts
const Files: (paramNameOrDtoOrOptions?, dtoTypeOrFileOptions?) => (target, propertyKey, parameterIndex) => void;
```

Defined in: [packages/core/src/decorators/param.decorators.ts:459](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L459)

## Parameters

| Parameter | Type |
| ------ | ------ |
| `paramNameOrDtoOrOptions?` | `unknown` |
| `dtoTypeOrFileOptions?` | `unknown` |

## Returns

```ts
(
   target, 
   propertyKey, 
   parameterIndex): void;
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `object` |
| `propertyKey` | `string` \| `symbol` |
| `parameterIndex` | `number` |

### Returns

`void`
