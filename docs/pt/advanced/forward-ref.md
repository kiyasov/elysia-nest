---
title: Referências Avançadas
icon: link
description: Resolva dependências circulares com forwardRef()
---

Dependências circulares ocorrem quando dois services dependem um do outro. O nestelia fornece `forwardRef()` para tratar esses casos.

## O Problema

```typescript
// Isso cria uma dependência circular:
@Injectable()
class ServiceA {
  constructor(@Inject(ServiceB) private b: ServiceB) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

No momento da resolução, `ServiceA` precisa de `ServiceB` que precisa de `ServiceA` — um deadlock.

## A Solução

Use `forwardRef()` em pelo menos um lado da referência circular:

```typescript
import { Injectable, Inject, forwardRef } from "nestelia";

@Injectable()
class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB)) private b: ServiceB
  ) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

`forwardRef(() => ServiceB)` adia a resolução de `ServiceB` até que todos os providers tenham sido registrados, quebrando a cadeia circular.

## Quando Usar forwardRef

- Dois services que fazem referência um ao outro
- Um service que referencia um controller e vice-versa
- Imports circulares entre módulos

## Boas Práticas

Dependências circulares frequentemente indicam um problema de design. Antes de recorrer a `forwardRef()`, considere:

1. **Extrair lógica compartilhada** em um terceiro service do qual ambos dependam
2. **Usar eventos** — um service publica, o outro subscreve
3. **Reestruturar módulos** — mover providers compartilhados para um módulo comum

Use `forwardRef()` apenas quando a refatoração não for prática.
