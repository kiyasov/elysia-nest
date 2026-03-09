---
title: Injeção de Dependências
icon: plug
description: DI baseada em construtor com múltiplos escopos
---

O nestelia fornece um sistema completo de injeção de dependências. Services são registrados em módulos e injetados automaticamente em controllers e outros services.

## @Injectable()

Marque uma classe como injetável para que o container de DI possa gerenciá-la:

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  findAll() {
    return [{ id: 1, name: "John" }];
  }
}
```

## @Inject()

Especifique explicitamente um token de dependência no construtor:

```typescript
@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
}
```

## @Optional()

Marque uma dependência como opcional — retorna `undefined` se não estiver disponível:

```typescript
constructor(
  @Inject("ANALYTICS") @Optional() private analytics?: AnalyticsService
) {}
```

## Escopos

Controle o ciclo de vida dos seus services com escopos:

```typescript
import { Injectable, Scope } from "nestelia";

// Padrão — uma instância compartilhada em toda a aplicação
@Injectable()
class SingletonService {}

// Nova instância para cada injeção
@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}

// Nova instância para cada requisição HTTP (via AsyncLocalStorage)
@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}
```

| Escopo | Comportamento |
|--------|---------------|
| `SINGLETON` | Instância única para toda a aplicação (padrão) |
| `TRANSIENT` | Nova instância a cada vez que é injetada |
| `REQUEST` | Nova instância por requisição HTTP |

## Registrando Providers

Providers são registrados no array `providers` de um módulo:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
class UserModule {}
```

## Exportando Providers

Para tornar um provider disponível para outros módulos, adicione-o a `exports`:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService], // pode injetar DatabaseService
})
class UserModule {}
```

## Providers Customizados

Veja a página de [Providers Customizados](/pt/advanced/custom-providers) para providers de valor, classe, factory e alias.

## Dependências Circulares

Veja a página de [Referências Avançadas](/pt/advanced/forward-ref) para resolver dependências circulares com `forwardRef()`.
