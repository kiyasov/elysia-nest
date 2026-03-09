---
title: 의존성 주입
icon: plug
description: 다양한 스코프를 지원하는 생성자 기반 DI
---

nestelia는 완전한 의존성 주입 시스템을 제공합니다. 서비스는 모듈에 등록되고 컨트롤러와 다른 서비스에 자동으로 주입됩니다.

## @Injectable()

DI 컨테이너가 관리할 수 있도록 클래스를 주입 가능한 것으로 표시합니다:

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  findAll() {
    return [{ id: 1, name: "John" }];
  }
}
```

## @Inject()

생성자에서 의존성 토큰을 명시적으로 지정합니다:

```typescript
@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
}
```

## @Optional()

의존성을 선택적으로 표시합니다 — 사용 불가능한 경우 `undefined`를 반환합니다:

```typescript
constructor(
  @Inject("ANALYTICS") @Optional() private analytics?: AnalyticsService
) {}
```

## 스코프

스코프를 사용해 서비스의 라이프사이클을 제어합니다:

```typescript
import { Injectable, Scope } from "nestelia";

// 기본값 — 어디서나 공유되는 하나의 인스턴스
@Injectable()
class SingletonService {}

// 주입될 때마다 새 인스턴스
@Injectable({ scope: Scope.TRANSIENT })
class TransientService {}

// HTTP 요청마다 새 인스턴스 (AsyncLocalStorage 사용)
@Injectable({ scope: Scope.REQUEST })
class RequestScopedService {}
```

| 스코프 | 동작 |
|-------|----------|
| `SINGLETON` | 전체 애플리케이션에서 단일 인스턴스 (기본값) |
| `TRANSIENT` | 주입될 때마다 새 인스턴스 |
| `REQUEST` | HTTP 요청마다 새 인스턴스 |

## 프로바이더 등록

프로바이더는 모듈의 `providers` 배열에 등록됩니다:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
class UserModule {}
```

## 프로바이더 내보내기

다른 모듈에서 프로바이더를 사용할 수 있게 하려면 `exports`에 추가합니다:

```typescript
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService], // DatabaseService를 주입할 수 있습니다
})
class UserModule {}
```

## 커스텀 프로바이더

값, 클래스, 팩토리, 별칭 프로바이더는 [커스텀 프로바이더](/ko/advanced/custom-providers) 페이지를 참조하세요.

## 순환 의존성

`forwardRef()`로 순환 의존성을 해결하는 방법은 [Forward References](/ko/advanced/forward-ref) 페이지를 참조하세요.
