---
title: Testing
icon: beaker
description: Módulos de teste isolados com substituição de providers
---

O pacote testing fornece utilitários para testes unitários e de integração de aplicações nestelia.

## Quick Start

```typescript
import { describe, expect, it, beforeAll } from "bun:test";
import { Injectable } from "nestelia";
import { Test, TestingModule } from "nestelia/testing";

@Injectable()
class UserService {
  getUsers() {
    return [{ id: 1, name: "John" }];
  }
}

describe("UserService", () => {
  let module: TestingModule;
  let userService: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get(UserService);
  });

  it("should return users", () => {
    expect(userService.getUsers()).toEqual([{ id: 1, name: "John" }]);
  });
});
```

## Mockando Dependências

### Substituir com Valor

```typescript
const mockDb = {
  query: () => [{ id: 1, name: "Mock User" }],
};

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useValue(mockDb)
  .compile();
```

### Substituir com Classe

```typescript
class MockDatabaseService {
  query() {
    return [{ id: 1, name: "Mock" }];
  }
}

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useClass(MockDatabaseService)
  .compile();
```

### Substituir com Factory

```typescript
const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useFactory(() => ({
    query: () => [{ id: 1, name: "Factory Mock" }],
  }))
  .compile();
```

## Referência da API

### Test.createTestingModule(metadata)

Cria um `TestingModuleBuilder`.

**Parâmetros:**
- `metadata` — Configuração do módulo (`providers`, `imports`, `controllers`)

### TestingModuleBuilder

| Método | Descrição |
|--------|-----------|
| `.overrideProvider(token)` | Inicia a substituição de um provider |
| `.useValue(value)` | Substitui por um valor estático |
| `.useClass(metatype)` | Substitui por uma classe diferente |
| `.useFactory(factory, inject?)` | Substitui por uma função factory |
| `.compile()` | Constrói e retorna um `Promise<TestingModule>` |

### TestingModule

| Método | Descrição |
|--------|-----------|
| `.get<T>(token)` | Obtém uma instância de provider (síncrono) |
| `.resolve<T>(token)` | Resolve um provider (assíncrono, para escopos de request) |
| `.has(token)` | Verifica se um provider está registrado |
