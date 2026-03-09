---
title: Referencias Hacia Adelante
icon: link
description: Resuelve dependencias circulares con forwardRef()
---

Las dependencias circulares ocurren cuando dos servicios dependen el uno del otro. nestelia provee `forwardRef()` para manejar estos casos.

## El Problema

```typescript
// Esto crea una dependencia circular:
@Injectable()
class ServiceA {
  constructor(@Inject(ServiceB) private b: ServiceB) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

Al momento de la resolución, `ServiceA` necesita `ServiceB`, que a su vez necesita `ServiceA` — un interbloqueo (deadlock).

## La Solución

Usa `forwardRef()` en al menos uno de los lados de la referencia circular:

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

`forwardRef(() => ServiceB)` difiere la resolución de `ServiceB` hasta que todos los proveedores han sido registrados, rompiendo la cadena circular.

## Cuándo Usar forwardRef

- Dos servicios que se referencian mutuamente
- Un servicio que referencia a un controlador y viceversa
- Imports circulares entre módulos

## Buenas Prácticas

Las dependencias circulares suelen indicar un problema de diseño. Antes de recurrir a `forwardRef()`, considera:

1. **Extraer la lógica compartida** en un tercer servicio del que ambos dependan
2. **Usar eventos** — un servicio publica, el otro se suscribe
3. **Reestructurar módulos** — mover los proveedores compartidos a un módulo común

Usa `forwardRef()` solo cuando la refactorización no sea práctica.
