---
title: Proveedores Personalizados
icon: puzzle
description: Proveedores de valor, clase, fábrica y alias
---

Más allá de los simples proveedores de clase, nestelia soporta varios tipos de proveedores personalizados para escenarios avanzados de inyección de dependencias.

## Proveedores de Clase

La forma más simple — el contenedor de DI instancia la clase:

```typescript
@Module({
  providers: [UserService], // abreviatura de { provide: UserService, useClass: UserService }
})
class AppModule {}
```

También puedes sustituir una clase por otra:

```typescript
@Module({
  providers: [
    { provide: DatabaseService, useClass: PostgresService },
  ],
})
class AppModule {}
```

## Proveedores de Valor

Provee un valor estático (objeto, cadena, número, etc.):

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000, debug: true } },
    { provide: "API_KEY", useValue: "sk-abc123" },
  ],
})
class AppModule {}
```

Inyecta con un token de cadena:

```typescript
@Injectable()
class ApiService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
}
```

## Proveedores de Fábrica

Usa una función para crear la instancia del proveedor. La función puede inyectar otras dependencias:

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

Se soportan fábricas asíncronas:

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

## Proveedores de Alias (useExisting)

Crea un alias que apunta a un proveedor existente:

```typescript
@Module({
  providers: [
    PostgresService,
    { provide: "DATABASE", useExisting: PostgresService },
  ],
})
class AppModule {}
```

Tanto `PostgresService` como `"DATABASE"` resuelven a la misma instancia singleton.

## Combinar Tipos de Proveedores

```typescript
@Module({
  providers: [
    // Clase
    UserService,
    AuthService,

    // Valor
    { provide: "CONFIG", useValue: { port: 3000 } },

    // Fábrica
    {
      provide: "LOGGER",
      useFactory: (config: any) => new Logger(config.level),
      inject: ["CONFIG"],
    },

    // Sustitución de clase
    { provide: DatabaseService, useClass: PostgresService },

    // Alias
    { provide: "DB", useExisting: DatabaseService },
  ],
})
class AppModule {}
```

## Exportar Proveedores Personalizados

Para que los proveedores personalizados estén disponibles en otros módulos:

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
