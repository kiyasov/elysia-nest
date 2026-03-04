# Function: SetMetadata()

```ts
function SetMetadata<K, V>(metadataKey, metadataValue): MethodDecorator & ClassDecorator;
```

Defined in: [packages/core/src/decorators/set-metadata.decorator.ts:13](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/decorators/set-metadata.decorator.ts#L13)

Decorator that assigns metadata to the class using the specified key.

This metadata can be reflected using the `Reflect` API.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `K` | `string` |
| `V` | `any` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `metadataKey` | `K` | The key used to store the metadata. |
| `metadataValue` | `V` | The value to store. |

## Returns

`MethodDecorator` & `ClassDecorator`

## Public Api
