---
title: API del Contenedor
icon: box
description: Acceso directo al contenedor de DI para casos de uso avanzados
---

El singleton `DIContainer` provee acceso de bajo nivel al sistema de inyección de dependencias. La mayoría de las aplicaciones no lo necesitarán directamente, pero es útil para pruebas, proveedores dinámicos y extensiones del framework.

## Obtener una Instancia

```typescript
import { DIContainer } from "nestelia";

const service = await DIContainer.get(UserService, UserModule);
```

## Registrar Proveedores

```typescript
DIContainer.register([
  UserService,
  { provide: "CONFIG", useValue: { port: 3000 } },
], MyModuleClass);
```

## Registrar Controladores

```typescript
DIContainer.registerControllers([UserController, AdminController], MyModuleClass);
```

## Limpiar el Contenedor

Útil para el aislamiento de pruebas — elimina todos los módulos y proveedores registrados:

```typescript
import { beforeEach } from "bun:test";
import { DIContainer } from "nestelia";

beforeEach(() => {
  DIContainer.clear();
});
```

## Gestión de Módulos

```typescript
// Agregar un módulo
const moduleRef = DIContainer.addModule(MyModule, "MyModule");

// Obtener un módulo por clave
const moduleRef = DIContainer.getModuleByKey("MyModule");

// Obtener todos los módulos
const modules = DIContainer.getModules();
```

## Alcance de Solicitud

El contenedor usa `AsyncLocalStorage` para gestionar los proveedores con alcance de solicitud. Cuando llega una solicitud:

1. `Container.runInRequestContext()` crea un nuevo contexto
2. Los proveedores con alcance `REQUEST` obtienen una instancia nueva para ese contexto
3. El contexto se limpia después de la respuesta

```typescript
@Injectable({ scope: Scope.REQUEST })
class RequestLogger {
  private requestId = crypto.randomUUID();

  log(message: string) {
    console.log(`[${this.requestId}] ${message}`);
  }
}
```

## Resolución de Clave de Módulo

Los proveedores están limitados a los módulos. Al llamar a `DIContainer.get()`, pasa la clase del módulo para buscar proveedores dentro de un módulo específico:

```typescript
const service = await DIContainer.get(UserService, UserModule);
```

Si se omite, el contenedor busca en todos los módulos.

## Módulos Globales

```typescript
// Marca un módulo como global para que sus proveedores sean accesibles en cualquier lugar
const moduleRef = DIContainer.addModule(ConfigModule, "ConfigModule");
DIContainer.addGlobalModule(moduleRef);
DIContainer.bindGlobalScope();
```
