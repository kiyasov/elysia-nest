---
title: Módulos
icon: boxes
description: Organiza tu aplicación en bloques cohesivos
---

Los módulos son la forma principal de organizar una aplicación nestelia. Cada módulo encapsula un conjunto de controladores, proveedores e imports.

## Definir un Módulo

Usa el decorador `@Module()` para declarar un módulo:

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## Opciones del Módulo

```typescript
interface ModuleOptions {
  controllers?: Type[];        // Manejadores de rutas
  providers?: Provider[];      // Servicios inyectables
  imports?: any[];             // Otros módulos a importar
  exports?: ProviderToken[];   // Proveedores disponibles para módulos que importan este
  middlewares?: Middleware[];   // Middleware basado en clases o funcional
  children?: (() => Promise<any>)[]; // Módulos hijos
  prefix?: string;             // Prefijo de ruta para todos los controladores
}
```

## Importar Módulos

Los módulos pueden importar otros módulos para acceder a sus proveedores exportados:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

`UserService` ahora puede inyectar `DatabaseService` porque `DatabaseModule` lo exporta.

## Módulo Raíz

Toda aplicación tiene un módulo raíz que se pasa a `createElysiaApplication()`:

```typescript
@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
```

## Prefijo de Módulo

Aplica un prefijo de ruta a todos los controladores de un módulo:

```typescript
@Module({
  controllers: [UserController], // las rutas se convierten en /api/v1/users/...
  prefix: "/api/v1",
})
class ApiModule {}
```

## Módulos Globales

Marca un módulo como global para que sus proveedores estén disponibles en cualquier parte sin necesidad de importarlo:

```typescript
import { Global, Module } from "nestelia";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## Módulos Dinámicos

Los módulos pueden exponer métodos de configuración estáticos como `forRoot()` y `forRootAsync()`:

```typescript
@Module({})
class ConfigModule {
  static forRoot(options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        { provide: "CONFIG_OPTIONS", useValue: options },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// Uso
@Module({
  imports: [ConfigModule.forRoot({ path: ".env" })],
})
class AppModule {}
```

## Cómo Funciona

Internamente, `@Module()` crea un plugin de Elysia. Cuando se llama a `createElysiaApplication()`:

1. El contenedor de DI registra todos los proveedores del módulo
2. Los controladores se instancian con sus dependencias resueltas
3. Las rutas HTTP se registran en la instancia de Elysia
4. Los hooks de ciclo de vida se invocan en orden
