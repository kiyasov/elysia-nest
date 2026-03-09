---
title: Container API
icon: box
description: 고급 사용 사례를 위한 DI 컨테이너 직접 접근
---

`DIContainer` 싱글톤은 의존성 주입 시스템에 대한 저수준 접근을 제공합니다. 대부분의 애플리케이션에서는 직접 필요하지 않지만, 테스팅, 동적 프로바이더, 프레임워크 확장에 유용합니다.

## 인스턴스 가져오기

```typescript
import { DIContainer } from "nestelia";

const service = await DIContainer.get(UserService, UserModule);
```

## 프로바이더 등록

```typescript
DIContainer.register([
  UserService,
  { provide: "CONFIG", useValue: { port: 3000 } },
], MyModuleClass);
```

## 컨트롤러 등록

```typescript
DIContainer.registerControllers([UserController, AdminController], MyModuleClass);
```

## 컨테이너 초기화

테스트 격리에 유용합니다 — 등록된 모든 모듈과 프로바이더를 제거합니다:

```typescript
import { beforeEach } from "bun:test";
import { DIContainer } from "nestelia";

beforeEach(() => {
  DIContainer.clear();
});
```

## 모듈 관리

```typescript
// 모듈 추가
const moduleRef = DIContainer.addModule(MyModule, "MyModule");

// 키로 모듈 가져오기
const moduleRef = DIContainer.getModuleByKey("MyModule");

// 모든 모듈 가져오기
const modules = DIContainer.getModules();
```

## 요청 스코프

컨테이너는 `AsyncLocalStorage`를 사용해 요청 스코프 프로바이더를 관리합니다. 요청이 도착하면:

1. `Container.runInRequestContext()`가 새 컨텍스트를 생성합니다
2. `REQUEST` 스코프 프로바이더가 해당 컨텍스트에 대한 새 인스턴스를 받습니다
3. 응답 후 컨텍스트가 정리됩니다

```typescript
@Injectable({ scope: Scope.REQUEST })
class RequestLogger {
  private requestId = crypto.randomUUID();

  log(message: string) {
    console.log(`[${this.requestId}] ${message}`);
  }
}
```

## 모듈 키 해결

프로바이더는 모듈 범위로 지정됩니다. `DIContainer.get()`을 호출할 때 특정 모듈 내에서 프로바이더를 조회하려면 모듈 클래스를 전달합니다:

```typescript
const service = await DIContainer.get(UserService, UserModule);
```

생략하면 컨테이너가 모든 모듈을 검색합니다.

## 전역 모듈

```typescript
// 모듈을 전역으로 표시해서 어디서나 프로바이더에 접근 가능하게 합니다
const moduleRef = DIContainer.addModule(ConfigModule, "ConfigModule");
DIContainer.addGlobalModule(moduleRef);
DIContainer.bindGlobalScope();
```
