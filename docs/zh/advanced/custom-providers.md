---
title: 自定义提供者
icon: puzzle
description: 值提供者、类提供者、工厂提供者和别名提供者
---

除了简单的类提供者之外，nestelia 还支持多种自定义提供者类型，用于高级依赖注入场景。

## 类提供者

最简单的形式——DI 容器实例化该类：

```typescript
@Module({
  providers: [UserService], // { provide: UserService, useClass: UserService } 的简写
})
class AppModule {}
```

你也可以用一个类替换另一个类：

```typescript
@Module({
  providers: [
    { provide: DatabaseService, useClass: PostgresService },
  ],
})
class AppModule {}
```

## 值提供者

提供一个静态值（对象、字符串、数字等）：

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000, debug: true } },
    { provide: "API_KEY", useValue: "sk-abc123" },
  ],
})
class AppModule {}
```

使用字符串令牌注入：

```typescript
@Injectable()
class ApiService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
}
```

## 工厂提供者

使用函数创建提供者实例。该函数可以注入其他依赖：

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

支持异步工厂：

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

## 别名提供者（useExisting）

创建指向现有提供者的别名：

```typescript
@Module({
  providers: [
    PostgresService,
    { provide: "DATABASE", useExisting: PostgresService },
  ],
})
class AppModule {}
```

`PostgresService` 和 `"DATABASE"` 都解析为同一个单例实例。

## 组合提供者类型

```typescript
@Module({
  providers: [
    // 类
    UserService,
    AuthService,

    // 值
    { provide: "CONFIG", useValue: { port: 3000 } },

    // 工厂
    {
      provide: "LOGGER",
      useFactory: (config: any) => new Logger(config.level),
      inject: ["CONFIG"],
    },

    // 类替换
    { provide: DatabaseService, useClass: PostgresService },

    // 别名
    { provide: "DB", useExisting: DatabaseService },
  ],
})
class AppModule {}
```

## 导出自定义提供者

要使自定义提供者对其他模块可用：

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
