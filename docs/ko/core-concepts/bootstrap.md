---
title: 부트스트랩
icon: power
description: nestelia 애플리케이션을 초기화하고 시작합니다
---

`createElysiaApplication` 함수는 루트 모듈을 초기화하고 요청을 수신할 준비가 된 Elysia 인스턴스를 반환합니다.

## 기본 사용법

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## createElysiaApplication이 하는 일

1. **모듈 트리 해결** — 임포트, 프로바이더, 컨트롤러를 재귀적으로 처리합니다
2. **프로바이더 등록** — 모든 프로바이더를 DI 컨테이너에 추가합니다
3. **컨트롤러 인스턴스화** — 의존성이 주입된 컨트롤러 인스턴스를 생성합니다
4. **라우트 등록** — 데코레이트된 메서드를 Elysia 라우트에 매핑합니다
5. **라이프사이클 훅 실행** — `onModuleInit`과 `onApplicationBootstrap`을 순서대로 호출합니다
6. **ElysiaNestApplication 반환** — `.listen()`을 호출할 준비가 된 인스턴스를 반환합니다

## 마이크로서비스와 함께 사용

마이크로서비스 패키지를 사용할 때, `createElysiaApplication`은 HTTP + 마이크로서비스 하이브리드 모드를 지원하는 `ElysiaNestApplication`을 반환합니다:

```typescript
import { createElysiaApplication } from "nestelia";
import { Transport } from "nestelia/microservices";

const app = await createElysiaApplication(AppModule);

app.connectMicroservice({
  transport: Transport.REDIS,
  options: { host: "localhost", port: 6379 },
});

await app.startAllMicroservices();
app.listen(3000);
```

## 우아한 종료

nestelia는 종료 라이프사이클 훅을 지원합니다. 프로세스가 종료 신호를 받으면:

1. `BeforeApplicationShutdown` 훅이 먼저 실행됩니다
2. `OnModuleDestroy` 훅이 정리를 위해 실행됩니다
3. `OnApplicationShutdown` 훅이 마지막으로 실행됩니다

```typescript
@Injectable()
class DatabaseService implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.connection.close();
  }
}
```
