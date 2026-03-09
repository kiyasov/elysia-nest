---
title: カスタムプロバイダー
icon: puzzle
description: バリュー、クラス、ファクトリー、エイリアスプロバイダー
---

シンプルなクラスプロバイダー以外にも、nestelia は高度な依存性注入シナリオのためのいくつかのカスタムプロバイダー型をサポートしています。

## クラスプロバイダー

最もシンプルな形式 — DI コンテナがクラスをインスタンス化します:

```typescript
@Module({
  providers: [UserService], // { provide: UserService, useClass: UserService } の省略形
})
class AppModule {}
```

あるクラスを別のクラスに置き換えることもできます:

```typescript
@Module({
  providers: [
    { provide: DatabaseService, useClass: PostgresService },
  ],
})
class AppModule {}
```

## バリュープロバイダー

静的な値（オブジェクト、文字列、数値など）を提供します:

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000, debug: true } },
    { provide: "API_KEY", useValue: "sk-abc123" },
  ],
})
class AppModule {}
```

文字列トークンを使ってインジェクトします:

```typescript
@Injectable()
class ApiService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
}
```

## ファクトリープロバイダー

関数を使ってプロバイダーインスタンスを作成します。関数は他の依存関係をインジェクトできます:

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

非同期ファクトリーもサポートされています:

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

## エイリアスプロバイダー (useExisting)

既存のプロバイダーを指すエイリアスを作成します:

```typescript
@Module({
  providers: [
    PostgresService,
    { provide: "DATABASE", useExisting: PostgresService },
  ],
})
class AppModule {}
```

`PostgresService` と `"DATABASE"` は同じシングルトンインスタンスに解決されます。

## プロバイダー型の組み合わせ

```typescript
@Module({
  providers: [
    // クラス
    UserService,
    AuthService,

    // バリュー
    { provide: "CONFIG", useValue: { port: 3000 } },

    // ファクトリー
    {
      provide: "LOGGER",
      useFactory: (config: any) => new Logger(config.level),
      inject: ["CONFIG"],
    },

    // クラス置換
    { provide: DatabaseService, useClass: PostgresService },

    // エイリアス
    { provide: "DB", useExisting: DatabaseService },
  ],
})
class AppModule {}
```

## カスタムプロバイダーのエクスポート

カスタムプロバイダーを他のモジュールで利用可能にするには:

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
