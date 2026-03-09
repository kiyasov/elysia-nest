---
title: Providers Customizados
icon: puzzle
description: Providers de valor, classe, factory e alias
---

Além dos providers de classe simples, o nestelia suporta vários tipos de providers customizados para cenários avançados de injeção de dependências.

## Providers de Classe

A forma mais simples — o container de DI instancia a classe:

```typescript
@Module({
  providers: [UserService], // abreviação para { provide: UserService, useClass: UserService }
})
class AppModule {}
```

Você também pode substituir uma classe por outra:

```typescript
@Module({
  providers: [
    { provide: DatabaseService, useClass: PostgresService },
  ],
})
class AppModule {}
```

## Providers de Valor

Forneça um valor estático (objeto, string, número, etc.):

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000, debug: true } },
    { provide: "API_KEY", useValue: "sk-abc123" },
  ],
})
class AppModule {}
```

Injete com um token de string:

```typescript
@Injectable()
class ApiService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
}
```

## Providers de Factory

Use uma função para criar a instância do provider. A função pode injetar outras dependências:

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

Factories assíncronas são suportadas:

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

## Providers de Alias (useExisting)

Crie um alias que aponta para um provider existente:

```typescript
@Module({
  providers: [
    PostgresService,
    { provide: "DATABASE", useExisting: PostgresService },
  ],
})
class AppModule {}
```

Tanto `PostgresService` quanto `"DATABASE"` resolvem para a mesma instância singleton.

## Combinando Tipos de Provider

```typescript
@Module({
  providers: [
    // Classe
    UserService,
    AuthService,

    // Valor
    { provide: "CONFIG", useValue: { port: 3000 } },

    // Factory
    {
      provide: "LOGGER",
      useFactory: (config: any) => new Logger(config.level),
      inject: ["CONFIG"],
    },

    // Substituição de classe
    { provide: DatabaseService, useClass: PostgresService },

    // Alias
    { provide: "DB", useExisting: DatabaseService },
  ],
})
class AppModule {}
```

## Exportando Providers Customizados

Para tornar providers customizados disponíveis para outros módulos:

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
