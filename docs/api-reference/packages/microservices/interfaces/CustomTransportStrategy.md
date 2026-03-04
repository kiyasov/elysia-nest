# Interface: CustomTransportStrategy

Defined in: [packages/microservices/interfaces/microservice.interface.ts:72](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L72)

Interface that custom transport strategies must implement.
Pass an object conforming to this interface to connectMicroservice
to use a transport not provided by this package.

## Methods

### close()

```ts
close(): void;
```

Defined in: [packages/microservices/interfaces/microservice.interface.ts:74](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L74)

#### Returns

`void`

***

### listen()

```ts
listen(callback): void;
```

Defined in: [packages/microservices/interfaces/microservice.interface.ts:73](https://github.com/kiyasov/elysia-nest/blob/main/packages/microservices/interfaces/microservice.interface.ts#L73)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callback` | (`err?`, ...`optionalParams`) => `void` |

#### Returns

`void`
