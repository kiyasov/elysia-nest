---
title: Guards
icon: shield
description: "Protege rutas con lógica de autorización usando @UseGuards()"
---

Los guards determinan si una solicitud debe proceder al manejador de ruta. Implementan la interfaz `CanActivate` y se ejecutan automáticamente antes de que se llame al manejador.

## Interfaz CanActivate

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

Si `canActivate` devuelve `false`, la solicitud es rechazada con **403 Forbidden**. Si devuelve `true`, la solicitud continúa normalmente.

## Crear un Guard

```typescript
import { Injectable, CanActivate, ExecutionContext } from "nestelia";

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers.get("authorization") !== null;
  }
}
```

Los guards también pueden ser asíncronos:

```typescript
@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.get("authorization");
    const user = await this.userService.verifyToken(token);
    return user?.role === "admin";
  }
}
```

## Decorador @UseGuards()

Aplica guards a nivel de **método** (ruta individual) o a nivel de **clase** (todas las rutas del controlador). Cuando ambos están presentes, los guards de nivel de clase se ejecutan primero.

```typescript
import { Controller, Get, UseGuards } from "nestelia";

@Controller("/admin")
@UseGuards(AuthGuard)       // se ejecuta en todas las rutas de este controlador
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → manejador
  stats() {
    return { data: "stats" };
  }
}
```

Se pueden encadenar múltiples guards — se ejecutan **en orden**, y el primer `false` detiene la cadena:

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## Guards con Soporte de DI

Si un guard está registrado como proveedor en un módulo, se resolverá desde el contenedor de DI (permitiendo inyección en el constructor). De lo contrario, se instancia directamente.

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard obtiene DI
})
class AdminModule {}
```

## ExecutionContext

El `ExecutionContext` pasado a `canActivate` provee acceso a la solicitud actual y a los metadatos del manejador:

```typescript
interface ExecutionContext {
  /** Clase del controlador */
  getClass<T = any>(): T;
  /** Función del manejador de ruta */
  getHandler(): (...args: unknown[]) => unknown;
  /** Todos los argumentos del manejador */
  getArgs<T extends any[] = any[]>(): T;
  /** Argumento único por índice */
  getArgByIndex<T = any>(index: number): T;
  /** Tipo de contexto — "http" para rutas HTTP */
  getType<T extends string = string>(): T;
  /** Cambiar al contexto HTTP */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Objeto Request de la Web API */
  getRequest<T = any>(): T;
  /** Contexto de Elysia (contiene set.status, set.headers, etc.) */
  getResponse<T = any>(): T;
}
```

### Acceder a la solicitud nativa

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### Acceder al contexto de Elysia (estado, cabeceras, cookies)

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## Pipeline de Solicitud

Los guards se ejecutan **después** de que el controlador y el manejador son resueltos, **antes** que los interceptores y el propio manejador:

```
Solicitud → Controlador resuelto → Guards → Interceptores → Manejador → Respuesta
```
