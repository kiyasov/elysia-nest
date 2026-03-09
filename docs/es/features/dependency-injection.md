---
title: Inyección de Dependencias
icon: plug
description: DI basada en constructores con múltiples alcances
---

nestelia proporciona un sistema completo de inyección de dependencias. Los servicios se registran en módulos y se inyectan automáticamente en los controladores y otros servicios.

## @Injectable()

Marca una clase como inyectable para que el contenedor de DI la gestione:

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

Especifica explícitamente un token de dependencia en el constructor:

```typescript
@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
}
```

## @Optional()

Marca una dependencia como opcional — devuelve `undefined` si no está disponible:

```typescript
constructor(
  @Inject("ANALYTICS") @Optional() private analytics?: AnalyticsService
) {}
```

## Alcances

Controla el ciclo de vida de tus servicios con alcances:

```typescript
import { Injectable, Scope } from "nestelia";

// Por defecto — una instancia compartida en toda la aplicación
@Injectable()
class SingletonService {}

// Nueva instancia en cada inyección
@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}

// Nueva instancia por cada solicitud HTTP (mediante AsyncLocalStorage)
@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}
```

| Alcance | Comportamiento |
|---------|---------------|
| `SINGLETON` | Una única instancia para toda la aplicación (por defecto) |
| `TRANSIENT` | Nueva instancia cada vez que se inyecta |
| `REQUEST` | Nueva instancia por cada solicitud HTTP |

## Registrar Proveedores

Los proveedores se registran en el arreglo `providers` de un módulo:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
class UserModule {}
```

## Exportar Proveedores

Para que un proveedor esté disponible en otros módulos, agrégalo a `exports`:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService], // puede inyectar DatabaseService
})
class UserModule {}
```

## Proveedores Personalizados

Consulta la página de [Proveedores Personalizados](/es/advanced/custom-providers) para proveedores de valor, clase, fábrica y alias.

## Dependencias Circulares

Consulta la página de [Referencias Hacia Adelante](/es/advanced/forward-ref) para resolver dependencias circulares con `forwardRef()`.
