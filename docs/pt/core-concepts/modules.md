---
title: Módulos
icon: boxes
description: Organize sua aplicação em blocos coesos
---

Módulos são a principal forma de organizar uma aplicação nestelia. Cada módulo encapsula um conjunto de controllers, providers e imports.

## Definindo um Módulo

Use o decorador `@Module()` para declarar um módulo:

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## Opções do Módulo

```typescript
interface ModuleOptions {
  controllers?: Type[];        // Handlers de rotas
  providers?: Provider[];      // Services injetáveis
  imports?: any[];             // Outros módulos a importar
  exports?: ProviderToken[];   // Providers disponíveis para módulos que importam este
  middlewares?: Middleware[];   // Middleware baseado em classe ou funcional
  children?: (() => Promise<any>)[]; // Módulos filhos
  prefix?: string;             // Prefixo de rota para todos os controllers
}
```

## Importando Módulos

Módulos podem importar outros módulos para acessar seus providers exportados:

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

O `UserService` agora pode injetar o `DatabaseService` porque o `DatabaseModule` o exporta.

## Módulo Raiz

Toda aplicação tem um módulo raiz passado para `createElysiaApplication()`:

```typescript
@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
```

## Prefixo de Módulo

Aplique um prefixo de rota a todos os controllers de um módulo:

```typescript
@Module({
  controllers: [UserController], // rotas se tornam /api/v1/users/...
  prefix: "/api/v1",
})
class ApiModule {}
```

## Módulos Globais

Marque um módulo como global para que seus providers estejam disponíveis em todo lugar sem precisar importar:

```typescript
import { Global, Module } from "nestelia";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## Módulos Dinâmicos

Módulos podem expor métodos de configuração estáticos como `forRoot()` e `forRootAsync()`:

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

## Como Funciona

Por baixo dos panos, `@Module()` cria um plugin do Elysia. Quando `createElysiaApplication()` é chamado:

1. O container de DI registra todos os providers do módulo
2. Os controllers são instanciados com suas dependências resolvidas
3. As rotas HTTP são registradas na instância do Elysia
4. Os hooks de ciclo de vida são invocados em ordem
