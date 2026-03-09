---
title: 커스텀 프로바이더
icon: puzzle
description: 값, 클래스, 팩토리, 별칭 프로바이더
---

간단한 클래스 프로바이더 외에도 nestelia는 고급 의존성 주입 시나리오를 위한 여러 커스텀 프로바이더 타입을 지원합니다.

## 클래스 프로바이더

가장 간단한 형태 — DI 컨테이너가 클래스를 인스턴스화합니다:

```typescript
@Module({
  providers: [UserService], // { provide: UserService, useClass: UserService }의 축약형
})
class AppModule {}
```

하나의 클래스를 다른 클래스로 대체할 수도 있습니다:

```typescript
@Module({
  providers: [
    { provide: DatabaseService, useClass: PostgresService },
  ],
})
class AppModule {}
```

## 값 프로바이더

정적 값 (객체, 문자열, 숫자 등)을 제공합니다:

```typescript
@Module({
  providers: [
    { provide: "CONFIG", useValue: { port: 3000, debug: true } },
    { provide: "API_KEY", useValue: "sk-abc123" },
  ],
})
class AppModule {}
```

문자열 토큰으로 주입합니다:

```typescript
@Injectable()
class ApiService {
  constructor(@Inject("API_KEY") private apiKey: string) {}
}
```

## 팩토리 프로바이더

함수를 사용해 프로바이더 인스턴스를 생성합니다. 함수는 다른 의존성을 주입할 수 있습니다:

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

비동기 팩토리도 지원합니다:

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

## 별칭 프로바이더 (useExisting)

기존 프로바이더를 가리키는 별칭을 만듭니다:

```typescript
@Module({
  providers: [
    PostgresService,
    { provide: "DATABASE", useExisting: PostgresService },
  ],
})
class AppModule {}
```

`PostgresService`와 `"DATABASE"` 모두 동일한 싱글톤 인스턴스로 해결됩니다.

## 프로바이더 타입 조합

```typescript
@Module({
  providers: [
    // 클래스
    UserService,
    AuthService,

    // 값
    { provide: "CONFIG", useValue: { port: 3000 } },

    // 팩토리
    {
      provide: "LOGGER",
      useFactory: (config: any) => new Logger(config.level),
      inject: ["CONFIG"],
    },

    // 클래스 대체
    { provide: DatabaseService, useClass: PostgresService },

    // 별칭
    { provide: "DB", useExisting: DatabaseService },
  ],
})
class AppModule {}
```

## 커스텀 프로바이더 내보내기

다른 모듈에서 커스텀 프로바이더를 사용할 수 있게 하려면:

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
