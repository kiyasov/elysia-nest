---
title: API do Container
icon: box
description: Acesso direto ao container de DI para casos de uso avançados
---

O singleton `DIContainer` fornece acesso de baixo nível ao sistema de injeção de dependências. A maioria das aplicações não precisará disso diretamente, mas é útil para testes, providers dinâmicos e extensões de framework.

## Obtendo uma Instância

```typescript
import { DIContainer } from "nestelia";

const service = await DIContainer.get(UserService, UserModule);
```

## Registrando Providers

```typescript
DIContainer.register([
  UserService,
  { provide: "CONFIG", useValue: { port: 3000 } },
], MyModuleClass);
```

## Registrando Controllers

```typescript
DIContainer.registerControllers([UserController, AdminController], MyModuleClass);
```

## Limpando o Container

Útil para isolamento de testes — remove todos os módulos e providers registrados:

```typescript
import { beforeEach } from "bun:test";
import { DIContainer } from "nestelia";

beforeEach(() => {
  DIContainer.clear();
});
```

## Gerenciamento de Módulos

```typescript
// Adicionar um módulo
const moduleRef = DIContainer.addModule(MyModule, "MyModule");

// Obter um módulo pela chave
const moduleRef = DIContainer.getModuleByKey("MyModule");

// Obter todos os módulos
const modules = DIContainer.getModules();
```

## Escopo de Request

O container usa `AsyncLocalStorage` para gerenciar providers com escopo de request. Quando uma requisição chega:

1. `Container.runInRequestContext()` cria um novo contexto
2. Providers com escopo `REQUEST` recebem uma instância nova para aquele contexto
3. O contexto é limpo após a resposta

```typescript
@Injectable({ scope: Scope.REQUEST })
class RequestLogger {
  private requestId = crypto.randomUUID();

  log(message: string) {
    console.log(`[${this.requestId}] ${message}`);
  }
}
```

## Resolução de Chave de Módulo

Providers são escopados por módulos. Ao chamar `DIContainer.get()`, passe a classe do módulo para buscar providers dentro de um módulo específico:

```typescript
const service = await DIContainer.get(UserService, UserModule);
```

Se omitido, o container busca em todos os módulos.

## Módulos Globais

```typescript
// Marcar um módulo como global para que seus providers sejam acessíveis em todo lugar
const moduleRef = DIContainer.addModule(ConfigModule, "ConfigModule");
DIContainer.addGlobalModule(moduleRef);
DIContainer.bindGlobalScope();
```
