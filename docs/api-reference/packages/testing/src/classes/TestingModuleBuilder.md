# Class: TestingModuleBuilder

Defined in: [packages/testing/src/testing.module-builder.ts:81](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L81)

Builder for creating and configuring testing modules.

## Example

```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
  providers: [MyService],
})
  .overrideProvider(DatabaseService)
  .useValue(mockDb)
  .compile();

const service = moduleRef.get(MyService);
```

## Constructors

### Constructor

```ts
new TestingModuleBuilder(metadata): TestingModuleBuilder;
```

Defined in: [packages/testing/src/testing.module-builder.ts:85](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L85)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`ModuleOptions`](../../../../index/interfaces/ModuleOptions.md) |

#### Returns

`TestingModuleBuilder`

## Methods

### addOverride()

```ts
addOverride(override): void;
```

Defined in: [packages/testing/src/testing.module-builder.ts:100](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L100)

**`Internal`**

Add provider override

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `override` | [`OverridesMetadata`](../interfaces/OverridesMetadata.md) |

#### Returns

`void`

***

### compile()

```ts
compile(): Promise<TestingModule>;
```

Defined in: [packages/testing/src/testing.module-builder.ts:121](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L121)

Compile the testing module and initialize all providers

#### Returns

`Promise`\<[`TestingModule`](TestingModule.md)\>

***

### overrideClass()

```ts
overrideClass<T>(token): OverrideByBuilder<T>;
```

Defined in: [packages/testing/src/testing.module-builder.ts:114](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L114)

Override a class provider

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`Type`](../../../../index/interfaces/Type.md)\<`T`\> |

#### Returns

`OverrideByBuilder`\<`T`\>

***

### overrideProvider()

```ts
overrideProvider<T>(token): OverrideByBuilder<T>;
```

Defined in: [packages/testing/src/testing.module-builder.ts:107](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/testing.module-builder.ts#L107)

Override a provider with mock/stub

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `token` | [`ProviderToken`](../../../../index/type-aliases/ProviderToken.md) |

#### Returns

`OverrideByBuilder`\<`T`\>
