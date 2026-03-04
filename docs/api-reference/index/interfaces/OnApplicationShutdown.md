# Interface: OnApplicationShutdown

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:38](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L38)

Interface for lifecycle hooks called when the application is shutting down
This method is called when all connections are closed and the application is about to exit

## Methods

### onApplicationShutdown()

```ts
onApplicationShutdown(): void | Promise<void>;
```

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:39](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L39)

#### Returns

`void` \| `Promise`\<`void`\>
