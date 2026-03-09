---
title: 테스팅
icon: beaker
description: 프로바이더 오버라이드를 갖춘 격리 테스트 모듈
---

테스팅 패키지는 nestelia 애플리케이션의 단위 테스트 및 통합 테스트를 위한 유틸리티를 제공합니다.

## 빠른 시작

```typescript
import { describe, expect, it, beforeAll } from "bun:test";
import { Injectable } from "nestelia";
import { Test, TestingModule } from "nestelia/testing";

@Injectable()
class UserService {
  getUsers() {
    return [{ id: 1, name: "John" }];
  }
}

describe("UserService", () => {
  let module: TestingModule;
  let userService: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = module.get(UserService);
  });

  it("should return users", () => {
    expect(userService.getUsers()).toEqual([{ id: 1, name: "John" }]);
  });
});
```

## 의존성 모킹

### 값으로 오버라이드

```typescript
const mockDb = {
  query: () => [{ id: 1, name: "Mock User" }],
};

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useValue(mockDb)
  .compile();
```

### 클래스로 오버라이드

```typescript
class MockDatabaseService {
  query() {
    return [{ id: 1, name: "Mock" }];
  }
}

const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useClass(MockDatabaseService)
  .compile();
```

### 팩토리로 오버라이드

```typescript
const module = await Test.createTestingModule({
  providers: [UserService, DatabaseService],
})
  .overrideProvider(DatabaseService)
  .useFactory(() => ({
    query: () => [{ id: 1, name: "Factory Mock" }],
  }))
  .compile();
```

## API 참조

### Test.createTestingModule(metadata)

`TestingModuleBuilder`를 생성합니다.

**파라미터:**
- `metadata` — 모듈 설정 (`providers`, `imports`, `controllers`)

### TestingModuleBuilder

| 메서드 | 설명 |
|--------|-------------|
| `.overrideProvider(token)` | 프로바이더 오버라이드를 시작합니다 |
| `.useValue(value)` | 정적 값으로 교체합니다 |
| `.useClass(metatype)` | 다른 클래스로 교체합니다 |
| `.useFactory(factory, inject?)` | 팩토리 함수로 교체합니다 |
| `.compile()` | 빌드하고 `Promise<TestingModule>`을 반환합니다 |

### TestingModule

| 메서드 | 설명 |
|--------|-------------|
| `.get<T>(token)` | 프로바이더 인스턴스를 가져옵니다 (동기) |
| `.resolve<T>(token)` | 프로바이더를 해결합니다 (비동기, 요청 스코프용) |
| `.has(token)` | 프로바이더가 등록되어 있는지 확인합니다 |
