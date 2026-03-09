---
title: Forward References
icon: link
description: forwardRef()로 순환 의존성을 해결합니다
---

순환 의존성은 두 서비스가 서로를 의존할 때 발생합니다. nestelia는 이런 경우를 처리하기 위해 `forwardRef()`를 제공합니다.

## 문제

```typescript
// 순환 의존성이 생성됩니다:
@Injectable()
class ServiceA {
  constructor(@Inject(ServiceB) private b: ServiceB) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

해결 시점에 `ServiceA`는 `ServiceB`를 필요로 하고 `ServiceB`는 `ServiceA`를 필요로 합니다 — 데드락이 발생합니다.

## 해결책

순환 참조의 최소 한쪽에서 `forwardRef()`를 사용합니다:

```typescript
import { Injectable, Inject, forwardRef } from "nestelia";

@Injectable()
class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB)) private b: ServiceB
  ) {}
}

@Injectable()
class ServiceB {
  constructor(@Inject(ServiceA) private a: ServiceA) {}
}
```

`forwardRef(() => ServiceB)`는 모든 프로바이더가 등록될 때까지 `ServiceB`의 해결을 지연시켜 순환 체인을 끊습니다.

## forwardRef를 사용해야 할 때

- 서로를 참조하는 두 서비스
- 서비스가 컨트롤러를 참조하고 그 반대인 경우
- 모듈 간 순환 임포트

## 모범 사례

순환 의존성은 종종 설계 문제를 나타냅니다. `forwardRef()`를 사용하기 전에 다음을 고려해 보세요:

1. **공유 로직 추출** — 두 서비스가 모두 의존하는 제3의 서비스로 분리
2. **이벤트 사용** — 하나는 발행하고 다른 하나는 구독
3. **모듈 재구성** — 공유 프로바이더를 공통 모듈로 이동

리팩토링이 실용적이지 않을 때만 `forwardRef()`를 사용하세요.
