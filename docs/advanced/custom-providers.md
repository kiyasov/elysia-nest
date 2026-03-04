---
title: Custom Providers
icon: puzzle
description: Value, class, factory, and alias providers
---

Beyond simple class providers, @kiyasov/elysia-nest supports several custom provider types for advanced dependency injection scenarios.

## Class Providers

The simplest form — the DI container instantiates the class:

```typescript
@Module({
  providers: [UserService], // shorthand for { provide: UserService, useClass: UserService }
})
class AppModule {}
```

You can also substitute one class for another:

```typescript
@Module({
  providers: [
    { provide: DatabaseService, useClass: PostgresService },
  ],
})
class AppModule {}
```

## Value Providers

Provide a static value (object, string, number, etc.):

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000, debug: true } },
    { provide: "API_KEY", useValue: "sk-abc123" },
  ],
})
class AppModule {}
```

Inject with a string token:

```typescript
@Injectable()
class ApiService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
}
```

## Factory Providers

Use a function to create the provider instance. The function can inject other dependencies:

```typescript
@Module({
  providers: [
    ConfigService,
    {
      provide: "DATABASE",
      useFactory: (config: ConfigService) => {
        return createDatabaseConnection(config.get("DATABASE_URL"));
      },
      inject: [ConfigService],
    },
  ],
})
class AppModule {}
```

Async factories are supported:

```typescript
{
  provide: "DATABASE",
  useFactory: async (config: ConfigService) => {
    const connection = await createConnection(config.get("DATABASE_URL"));
    await connection.migrate();
    return connection;
  },
  inject: [ConfigService],
}
```

## Alias Providers (useExisting)

Create an alias that points to an existing provider:

```typescript
@Module({
  providers: [
    PostgresService,
    { provide: "DATABASE", useExisting: PostgresService },
  ],
})
class AppModule {}
```

Both `PostgresService` and `"DATABASE"` resolve to the same singleton instance.

## Combining Provider Types

```typescript
@Module({
  providers: [
    // Class
    UserService,
    AuthService,

    // Value
    { provide: "CONFIG", useValue: { port: 3000 } },

    // Factory
    {
      provide: "LOGGER",
      useFactory: (config: any) => new Logger(config.level),
      inject: ["CONFIG"],
    },

    // Class substitution
    { provide: DatabaseService, useClass: PostgresService },

    // Alias
    { provide: "DB", useExisting: DatabaseService },
  ],
})
class AppModule {}
```

## Exporting Custom Providers

To make custom providers available to other modules:

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000 } },
    ConfigService,
  ],
  exports: ["CONFIG", ConfigService],
})
class SharedModule {}
```
