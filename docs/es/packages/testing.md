---
title: Testing
icon: beaker
description: Módulos de prueba aislados con sobreescritura de proveedores
---

El paquete de testing provee utilidades para pruebas unitarias e integración de aplicaciones nestelia.

## Inicio Rápido

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

## Simular Dependencias (Mocking)

### Sobreescribir con un Valor

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

### Sobreescribir con una Clase

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

### Sobreescribir con una Fábrica

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

## Referencia de la API

### Test.createTestingModule(metadata)

Crea un `TestingModuleBuilder`.

**Parámetros:**
- `metadata` — Configuración del módulo (`providers`, `imports`, `controllers`)

### TestingModuleBuilder

| Método | Descripción |
|--------|-------------|
| `.overrideProvider(token)` | Inicia la sobreescritura de un proveedor |
| `.useValue(value)` | Reemplaza con un valor estático |
| `.useClass(metatype)` | Reemplaza con una clase diferente |
| `.useFactory(factory, inject?)` | Reemplaza con una función de fábrica |
| `.compile()` | Construye y devuelve un `Promise<TestingModule>` |

### TestingModule

| Método | Descripción |
|--------|-------------|
| `.get<T>(token)` | Obtiene una instancia de proveedor (síncrono) |
| `.resolve<T>(token)` | Resuelve un proveedor (asíncrono, para alcance request) |
| `.has(token)` | Verifica si un proveedor está registrado |
