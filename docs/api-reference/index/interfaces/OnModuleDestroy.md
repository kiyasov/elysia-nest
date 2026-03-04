# Interface: OnModuleDestroy

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:22](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L22)

Interface for lifecycle hooks called before a module is destroyed
This method is called when the application is shutting down

## Methods

### onModuleDestroy()

```ts
onModuleDestroy(): void | Promise<void>;
```

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:23](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L23)

#### Returns

`void` \| `Promise`\<`void`\>
