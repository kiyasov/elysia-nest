---
title: 가드
icon: shield
description: @UseGuards()를 사용해 인증 로직으로 라우트를 보호합니다
---

가드는 요청이 라우트 핸들러로 진행되어야 하는지 결정합니다. `CanActivate` 인터페이스를 구현하며 핸들러가 호출되기 전에 자동으로 실행됩니다.

## CanActivate 인터페이스

```typescript
interface CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> | boolean;
}
```

`canActivate`가 `false`를 반환하면 요청은 **403 Forbidden**으로 거부됩니다. `true`를 반환하면 요청이 정상적으로 진행됩니다.

## 가드 만들기

```typescript
import { Injectable, CanActivate, ExecutionContext } from "nestelia";

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.headers.get("authorization") !== null;
  }
}
```

가드는 비동기도 가능합니다:

```typescript
@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.get("authorization");
    const user = await this.userService.verifyToken(token);
    return user?.role === "admin";
  }
}
```

## @UseGuards() 데코레이터

가드를 **메서드 레벨** (단일 라우트) 또는 **클래스 레벨** (컨트롤러의 모든 라우트)에 적용합니다. 둘 다 있을 경우 클래스 레벨 가드가 먼저 실행됩니다.

```typescript
import { Controller, Get, UseGuards } from "nestelia";

@Controller("/admin")
@UseGuards(AuthGuard)       // 이 컨트롤러의 모든 라우트에 적용
class AdminController {

  @Get("/dashboard")
  dashboard() {
    return { data: "admin-only content" };
  }

  @Get("/stats")
  @UseGuards(RolesGuard)    // AuthGuard → RolesGuard → 핸들러
  stats() {
    return { data: "stats" };
  }
}
```

여러 가드를 체인으로 연결할 수 있습니다 — **순서대로** 실행되며 첫 번째 `false`에서 체인이 중단됩니다:

```typescript
@UseGuards(AuthGuard, RolesGuard, IpWhitelistGuard)
```

## DI 인식 가드

가드가 모듈의 프로바이더로 등록되어 있으면 DI 컨테이너에서 해결됩니다 (생성자 주입 허용). 그렇지 않으면 직접 인스턴스화됩니다.

```typescript
@Module({
  controllers: [AdminController],
  providers: [AuthGuard, UserService],   // AuthGuard가 DI를 받습니다
})
class AdminModule {}
```

## ExecutionContext

`canActivate`에 전달되는 `ExecutionContext`는 현재 요청과 핸들러 메타데이터에 대한 접근을 제공합니다:

```typescript
interface ExecutionContext {
  /** 컨트롤러 클래스 */
  getClass<T = any>(): T;
  /** 라우트 핸들러 함수 */
  getHandler(): (...args: unknown[]) => unknown;
  /** 모든 핸들러 인수 */
  getArgs<T extends any[] = any[]>(): T;
  /** 인덱스로 단일 인수 */
  getArgByIndex<T = any>(index: number): T;
  /** 컨텍스트 타입 — HTTP 라우트의 경우 "http" */
  getType<T extends string = string>(): T;
  /** HTTP 컨텍스트로 전환 */
  switchToHttp(): HttpArgumentsHost;
}

interface HttpArgumentsHost {
  /** Web API Request 객체 */
  getRequest<T = any>(): T;
  /** Elysia 컨텍스트 (set.status, set.headers 등을 포함) */
  getResponse<T = any>(): T;
}
```

### 원시 요청 접근

```typescript
canActivate(context: ExecutionContext): boolean {
  const req = context.switchToHttp().getRequest<Request>();
  const token = req.headers.get("authorization");
  // ...
}
```

### Elysia 컨텍스트 접근 (상태, 헤더, 쿠키)

```typescript
canActivate(context: ExecutionContext): boolean {
  const ctx = context.switchToHttp().getResponse<ElysiaContext>();
  const cookie = ctx.cookie["session"]?.value;
  // ...
}
```

## 요청 파이프라인

가드는 컨트롤러와 핸들러가 해결된 **후**, 인터셉터와 핸들러 자체 **전**에 실행됩니다:

```
요청 → 컨트롤러 해결 → 가드 → 인터셉터 → 핸들러 → 응답
```
