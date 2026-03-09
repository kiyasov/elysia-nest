---
title: 미들웨어
icon: layers
description: 클래스 기반 및 함수형 미들웨어로 횡단 관심사 로직을 추가합니다
---

미들웨어는 라우트 핸들러 전에 실행되며 요청, 응답을 수정하거나 파이프라인을 단락시킬 수 있습니다.

## 클래스 기반 미들웨어

`ElysiaNestMiddleware`를 구현하는 클래스를 만듭니다:

```typescript
import { Injectable, ElysiaNestMiddleware } from "nestelia";

@Injectable()
class LoggerMiddleware implements ElysiaNestMiddleware {
  async use(context: any, next: () => Promise<any>) {
    const start = Date.now();
    console.log(`→ ${context.request.method} ${context.request.url}`);

    await next();

    console.log(`← ${Date.now() - start}ms`);
  }
}
```

모듈의 `providers`와 `middlewares` 배열에 등록합니다:

```typescript
@Module({
  controllers: [AppController],
  providers: [LoggerMiddleware],
  middlewares: [LoggerMiddleware],
})
class AppModule {}
```

클래스 기반 미들웨어는 DI 컨테이너에서 해결되므로 다른 서비스를 주입할 수 있습니다:

```typescript
@Injectable()
class AuthMiddleware implements ElysiaNestMiddleware {
  constructor(@Inject(AuthService) private auth: AuthService) {}

  async use(context: any, next: () => Promise<any>) {
    const token = context.request.headers.get("authorization");
    if (!this.auth.verify(token)) {
      context.set.status = 401;
      return { error: "Unauthorized" };
    }
    await next();
  }
}
```

## 함수형 미들웨어

더 간단한 경우에는 Elysia 플러그인 함수를 직접 사용합니다:

```typescript
import cors from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";

@Module({
  middlewares: [
    (app) => app.use(cors()),
    (app) => app.use(jwt({ secret: "my-secret" })),
  ],
})
class AppModule {}
```

## 실행 순서

미들웨어는 `middlewares` 배열에 나열된 순서대로 실행되며, 라우트 핸들러가 실행되기 전에 동작합니다. 임포트된 모듈의 클래스 기반 미들웨어는 현재 모듈의 미들웨어보다 먼저 실행됩니다.
