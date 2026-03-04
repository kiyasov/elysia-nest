# Interface: OnApplicationBootstrap

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:14](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L14)

Interface for lifecycle hooks called when the application is bootstrapped
This method is called after all modules have been initialized

## Methods

### onApplicationBootstrap()

```ts
onApplicationBootstrap(): void | Promise<void>;
```

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:15](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L15)

#### Returns

`void` \| `Promise`\<`void`\>
