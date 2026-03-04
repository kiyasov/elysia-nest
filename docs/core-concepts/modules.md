---
title: Modules
icon: boxes
description: Organize your application into cohesive blocks
---

Modules are the primary way to organize an @kiyasov/elysia-nest application. Each module encapsulates a set of controllers, providers, and imports.

## Defining a Module

Use the `@Module()` decorator to declare a module:

```typescript
import { Module } from "@kiyasov/elysia-nest";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## Module Options

```typescript
interface ModuleOptions {
  controllers?: Type[];        // Route handlers
  providers?: Provider[];      // Injectable services
  imports?: any[];             // Other modules to import
  exports?: ProviderToken[];   // Providers available to importing modules
  middlewares?: Middleware[];   // Class-based or functional middleware
  children?: (() => Promise<any>)[]; // Child modules
  prefix?: string;             // Route prefix for all controllers
}
```

## Importing Modules

Modules can import other modules to access their exported providers:

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

`UserService` can now inject `DatabaseService` because `DatabaseModule` exports it.

## Root Module

Every application has a root module passed to `createElysiaApplication()`:

```typescript
@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
```

## Module Prefix

Apply a route prefix to all controllers in a module:

```typescript
@Module({
  controllers: [UserController], // routes become /api/v1/users/...
  prefix: "/api/v1",
})
class ApiModule {}
```

## Global Modules

Mark a module as global so its providers are available everywhere without importing:

```typescript
import { Global, Module } from "@kiyasov/elysia-nest";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## Dynamic Modules

Modules can expose static configuration methods like `forRoot()` and `forRootAsync()`:

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

// Usage
@Module({
  imports: [ConfigModule.forRoot({ path: ".env" })],
})
class AppModule {}
```

## How It Works

Under the hood, `@Module()` creates an Elysia plugin. When `createElysiaApplication()` is called:

1. The DI container registers all providers from the module
2. Controllers are instantiated with their dependencies resolved
3. HTTP routes are registered on the Elysia instance
4. Lifecycle hooks are invoked in order
