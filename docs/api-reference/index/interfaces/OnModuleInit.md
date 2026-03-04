# Interface: OnModuleInit

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:6](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L6)

Interface for lifecycle hooks called when a module is initialized
This method is called once all the modules are instantiated but before
the application is fully started

## Methods

### onModuleInit()

```ts
onModuleInit(): void | Promise<void>;
```

Defined in: [packages/core/src/interfaces/lifecycle.interface.ts:7](https://github.com/kiyasov/elysia-nest/blob/main/packages/core/src/interfaces/lifecycle.interface.ts#L7)

#### Returns

`void` \| `Promise`\<`void`\>
