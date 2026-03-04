# packages/testing/src

Elysia-Nest Testing Module

A comprehensive testing module for Elysia-Nest applications, providing:
- Testing module builder for isolated unit tests
- Provider override capabilities for mocking
- Factory-based dependency injection
- Support for all provider types (value, class, factory)

## Example

Quick start:
```typescript
import { Test } from '@@kiyasov/elysia-nest/testing';

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

  it('should work', () => {
    expect(service).toBeDefined();
  });
});
```

## Classes

| Class | Description |
| ------ | ------ |
| [Test](classes/Test.md) | Test utilities for creating testing modules. |
| [TestingModule](classes/TestingModule.md) | Compiled testing module with methods to access providers |
| [TestingModuleBuilder](classes/TestingModuleBuilder.md) | Builder for creating and configuring testing modules. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [OverridesMetadata](interfaces/OverridesMetadata.md) | Metadata for provider overrides in testing module |
