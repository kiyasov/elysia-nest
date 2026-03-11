---
title: 소개
description: Elysia 위에 구축된 모듈형 데코레이터 기반 프레임워크
---

# nestelia

**nestelia**는 [Elysia](https://elysiajs.com/)와 [Bun](https://bun.sh/) 위에 구축된 모듈형 데코레이터 기반 프레임워크입니다. 구조화된 서버사이드 애플리케이션 구축을 위한 데코레이터, 의존성 주입, 모듈, 라이프사이클 훅을 제공합니다.

::: warning
nestelia는 현재 활발히 개발 중입니다. 안정 릴리스 전에 API가 변경될 수 있습니다.
:::

## 왜 nestelia인가?

Elysia는 가장 빠른 Bun 네이티브 HTTP 프레임워크 중 하나입니다. nestelia는 Elysia의 성능을 희생하지 않으면서 그 위에 구조화된 모듈형 아키텍처를 추가합니다.

- **데코레이터** — `@Controller`, `@Get`, `@Post`, `@Body`, `@Param` 등
- **의존성 주입** — 싱글톤, 트랜지언트, 요청 스코프를 지원하는 생성자 기반 DI
- **모듈** — 컨트롤러, 프로바이더, 임포트를 응집력 있는 단위로 캡슐화
- **라이프사이클 훅** — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy` 등
- **가드, 인터셉터, 파이프** — 요청 파이프라인 확장성
- **미들웨어** — 클래스 기반 및 함수형 미들웨어 지원
- **예외 처리** — 자동 에러 응답을 갖춘 내장 HTTP 예외
- **TypeBox 검증** — Elysia의 네이티브 TypeBox 통합을 통한 스키마 기반 요청 검증

## 패키지

코어 외에도 nestelia는 선택적 패키지를 제공합니다:

| 패키지 | 설명 |
|---------|-------------|
| `nestelia/scheduler` | 크론 작업, 인터벌, 타임아웃 |
| `nestelia/microservices` | Redis, RabbitMQ, TCP 트랜스포트 |
| `nestelia/apollo` | Apollo GraphQL 코드 우선 통합 |
| `nestelia/passport` | Passport.js 인증 전략 |
| `nestelia/testing` | 프로바이더 오버라이드를 갖춘 격리 테스트 모듈 |
| `nestelia/cache` | 데코레이터를 이용한 HTTP 응답 캐싱 |
| `nestelia/rabbitmq` | 고급 RabbitMQ 메시징 |
| `nestelia/graphql-pubsub` | GraphQL 구독을 위한 Redis PubSub |

## 빠른 예제

```typescript
import { createElysiaApplication, Controller, Get, Module, Injectable, Inject } from "nestelia";

@Injectable()
class GreetService {
  hello() {
    return { message: "Hello from nestelia!" };
  }
}

@Controller("/greet")
class GreetController {
  constructor(@Inject(GreetService) private greet: GreetService) {}

  @Get("/")
  sayHello() {
    return this.greet.hello();
  }
}

@Module({
  controllers: [GreetController],
  providers: [GreetService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## Claude Code 스킬

nestelia를 위한 [Claude Code](https://claude.ai/claude-code) 스킬을 사용할 수 있습니다. AI 어시스턴트에서 직접 스캐폴딩 템플릿, 데코레이터 사용법, 모범 사례를 제공합니다.

```bash
npx skills add nestelia/nestelia
```

설치 후, Claude Code는 `nestelia`로 작업할 때 올바른 패턴을 자동으로 사용합니다.

## 다음 단계

- [설치](/ko/getting-started/installation) — nestelia와 피어 의존성을 설치합니다.
- [빠른 시작](/ko/getting-started/quick-start) — 5분 안에 첫 CRUD 앱을 만들어 보세요.
- [모듈](/ko/core-concepts/modules) — 모듈로 애플리케이션을 구성하는 방법을 알아봅니다.
- [의존성 주입](/ko/features/dependency-injection) — 다양한 스코프를 가진 생성자 기반 DI.
