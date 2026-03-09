---
title: 모듈
icon: boxes
description: 애플리케이션을 응집력 있는 블록으로 구성합니다
---

모듈은 nestelia 애플리케이션을 구성하는 주요 방법입니다. 각 모듈은 컨트롤러, 프로바이더, 임포트 집합을 캡슐화합니다.

## 모듈 정의

`@Module()` 데코레이터를 사용해 모듈을 선언합니다:

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class UserModule {}
```

## 모듈 옵션

```typescript
interface ModuleOptions {
  controllers?: Type[];        // 라우트 핸들러
  providers?: Provider[];      // 주입 가능한 서비스
  imports?: any[];             // 임포트할 다른 모듈
  exports?: ProviderToken[];   // 임포트하는 모듈에서 사용 가능한 프로바이더
  middlewares?: Middleware[];   // 클래스 기반 또는 함수형 미들웨어
  children?: (() => Promise<any>)[]; // 자식 모듈
  prefix?: string;             // 모든 컨트롤러의 라우트 접두사
}
```

## 모듈 임포트

모듈은 다른 모듈을 임포트해서 내보낸 프로바이더에 접근할 수 있습니다:

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

`DatabaseModule`이 `DatabaseService`를 내보내므로 `UserService`는 이제 `DatabaseService`를 주입할 수 있습니다.

## 루트 모듈

모든 애플리케이션에는 `createElysiaApplication()`에 전달하는 루트 모듈이 있습니다:

```typescript
@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
```

## 모듈 접두사

모듈 내 모든 컨트롤러에 라우트 접두사를 적용합니다:

```typescript
@Module({
  controllers: [UserController], // 라우트가 /api/v1/users/...가 됩니다
  prefix: "/api/v1",
})
class ApiModule {}
```

## 전역 모듈

모듈을 전역으로 표시해서 임포트 없이 어디서나 프로바이더를 사용할 수 있게 합니다:

```typescript
import { Global, Module } from "nestelia";

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
class ConfigModule {}
```

## 동적 모듈

모듈은 `forRoot()`나 `forRootAsync()` 같은 정적 설정 메서드를 노출할 수 있습니다:

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

// 사용법
@Module({
  imports: [ConfigModule.forRoot({ path: ".env" })],
})
class AppModule {}
```

## 작동 원리

내부적으로 `@Module()`은 Elysia 플러그인을 생성합니다. `createElysiaApplication()`이 호출되면:

1. DI 컨테이너가 모듈의 모든 프로바이더를 등록합니다
2. 의존성이 해결된 상태로 컨트롤러 인스턴스가 생성됩니다
3. Elysia 인스턴스에 HTTP 라우트가 등록됩니다
4. 라이프사이클 훅이 순서대로 호출됩니다
