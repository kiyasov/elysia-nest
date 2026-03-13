---
title: 라이프사이클 훅
icon: refresh-cw
description: 애플리케이션 및 모듈 라이프사이클 이벤트에 훅을 연결합니다
---

nestelia는 애플리케이션 시작 및 종료 과정의 특정 지점에서 로직을 실행할 수 있는 라이프사이클 훅을 제공합니다.

## 모듈 라이프사이클 훅

`@Injectable()` 서비스나 컨트롤러에 다음 인터페이스를 구현합니다:

### OnModuleInit

**모든** 모듈의 프로바이더가 인스턴스화된 후 호출됩니다. 이 시점에서는 `ModuleRef`를 통해 어떤 프로바이더든 안전하게 가져올 수 있습니다:

```typescript
import { Injectable, OnModuleInit } from "nestelia";

@Injectable()
class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    await this.connect();
    console.log("Database connected");
  }
}
```

`onModuleInit` 내에서 `ModuleRef`를 사용하여 다른 프로바이더를 동적으로 가져올 수 있습니다:

```typescript
import { Injectable, ModuleRef, OnModuleInit } from "nestelia";

@Injectable()
class CacheService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    const db = this.moduleRef.get(DatabaseService);
    console.log(`Cache connected to ${db.getUrl()}`);
  }
}
```

### OnApplicationBootstrap

모든 모듈이 초기화된 후 호출됩니다:

```typescript
@Injectable()
class AppService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    console.log("Application is ready");
  }
}
```

### OnModuleDestroy

모듈이 종료될 때 (종료 중에) 호출됩니다:

```typescript
@Injectable()
class CacheService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.cache.flush();
  }
}
```

### BeforeApplicationShutdown

애플리케이션이 종료되기 시작하기 전에 호출됩니다. 종료를 트리거한 신호를 받습니다:

```typescript
@Injectable()
class GracefulService implements BeforeApplicationShutdown {
  async beforeApplicationShutdown(signal?: string) {
    console.log(`Shutting down due to: ${signal}`);
    await this.drainRequests();
  }
}
```

### OnApplicationShutdown

모든 모듈이 종료된 후 호출됩니다:

```typescript
@Injectable()
class CleanupService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    await this.releaseResources();
  }
}
```

## 실행 순서

시작 시:
1. `OnModuleInit` — 임포트 순서대로 모듈별
2. `OnApplicationBootstrap` — 모든 모듈이 초기화된 후

종료 시:
1. `BeforeApplicationShutdown`
2. `OnModuleDestroy`
3. `OnApplicationShutdown`

## Elysia 라이프사이클 데코레이터

nestelia는 Elysia의 요청 라이프사이클 훅을 컨트롤러의 메서드 데코레이터로도 노출합니다:

```typescript
import {
  OnRequest,
  OnBeforeHandle,
  OnAfterHandle,
  OnAfterResponse,
  OnError,
} from "nestelia";

@Controller("/")
class AppController {
  @OnRequest()
  logRequest(ctx: any) {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
  }

  @OnBeforeHandle()
  checkAuth(ctx: any) {
    // 라우트 핸들러 전에 실행
  }

  @OnAfterHandle()
  addHeaders(ctx: any) {
    ctx.set.headers["x-powered-by"] = "nestelia";
  }

  @OnError()
  handleError(ctx: any) {
    console.error("Error:", ctx.error);
  }

  @OnAfterResponse()
  logResponse(ctx: any) {
    console.log("Response sent");
  }
}
```

사용 가능한 Elysia 라이프사이클 데코레이터:

| 데코레이터 | 훅 |
|-----------|------|
| `@OnRequest()` | 라우팅 전 |
| `@OnParse()` | 본문 파싱 |
| `@OnTransform()` | 요청 변환 |
| `@OnBeforeHandle()` | 핸들러 전 |
| `@OnAfterHandle()` | 핸들러 후 |
| `@OnMapResponse()` | 응답 매핑 |
| `@OnAfterResponse()` | 응답 전송 후 |
| `@OnError()` | 에러 핸들러 |
