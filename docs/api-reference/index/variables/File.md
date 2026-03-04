# Variable: File()

```ts
const File: (paramNameOrDtoOrOptions?, dtoTypeOrFileOptions?) => (target, propertyKey, parameterIndex) => void;
```

Defined in: [packages/core/src/decorators/param.decorators.ts:458](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/param.decorators.ts#L458)

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
