# Class: Test

Defined in: [packages/testing/src/test.ts:30](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/test.ts#L30)

Test utilities for creating testing modules.

## Example

```typescript
describe('MyService', () => {
  let moduleRef: TestingModule;
  let service: MyService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [MyService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue({ query: () => [] })
      .compile();

    service = moduleRef.get(MyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## Constructors

### Constructor

```ts
new Test(): Test;
```

#### Returns

`Test`

## Methods

### createTestingModule()

```ts
static createTestingModule(metadata): TestingModuleBuilder;
```

Defined in: [packages/testing/src/test.ts:34](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/test.ts#L34)

Create a testing module builder with the given metadata

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`ModuleOptions`](../../../../index/interfaces/ModuleOptions.md) |

#### Returns

[`TestingModuleBuilder`](TestingModuleBuilder.md)

***

### createTestingModuleAndCompile()

```ts
static createTestingModuleAndCompile(metadata): Promise<TestingModule>;
```

Defined in: [packages/testing/src/test.ts:41](https://github.com/kiyasov/elysia-nest/blob/main/packages/testing/src/test.ts#L41)

Create a testing module and compile it immediately

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `metadata` | [`ModuleOptions`](../../../../index/interfaces/ModuleOptions.md) |

#### Returns

`Promise`\<[`TestingModule`](TestingModule.md)\>
