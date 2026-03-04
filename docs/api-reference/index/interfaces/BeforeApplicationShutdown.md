# Interface: BeforeApplicationShutdown

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L30)

Interface for lifecycle hooks called before the application is closed
This method is called after all OnModuleDestroy hooks have been called

## Methods

### beforeApplicationShutdown()

```ts
beforeApplicationShutdown(): void | Promise<void>;
```

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:31](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L31)

#### Returns

`void` \| `Promise`\<`void`\>
