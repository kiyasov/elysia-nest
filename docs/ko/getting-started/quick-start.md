---
title: 빠른 시작
icon: zap
description: 5분 안에 nestelia로 CRUD API 만들기
---

이 가이드는 nestelia로 간단한 Users API를 구축하는 과정을 안내합니다.

## 1. 서비스 만들기

서비스는 비즈니스 로직을 담고 있으며, DI 컨테이너가 관리할 수 있도록 `@Injectable()`로 표시합니다.

```typescript
import { Injectable } from "nestelia";

@Injectable()
class UserService {
  private users = [{ id: 1, name: "John" }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(user: { name: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}
```

## 2. 컨트롤러 만들기

컨트롤러는 HTTP 라우트를 정의합니다. `@Controller`로 라우트 접두사를 설정하고, HTTP 데코레이터로 개별 메서드를 정의합니다.

```typescript
import { t } from "elysia";
import { Controller, Get, Post, Body, Param, Inject, Ctx } from "nestelia";

@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get("/")
  getAll() {
    return this.userService.findAll();
  }

  @Get("/:id")
  getById(@Ctx() ctx: any) {
    return this.userService.findById(Number(ctx.params.id));
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.userService.create(body);
  }
}
```

::: info
`@Body`, `@Param`, `@Query`는 검증을 위해 [TypeBox](https://github.com/sinclairzx81/typebox) 스키마를 받습니다. 스키마 없이 개별 라우트 파라미터에 접근하려면 `@Ctx()`를 사용해 전체 Elysia 컨텍스트를 가져오세요.
:::

## 3. 모듈 만들기

모듈은 컨트롤러와 프로바이더를 함께 묶습니다. 모든 애플리케이션에는 최소 하나의 루트 모듈이 있어야 합니다.

```typescript
import { Module } from "nestelia";

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}
```

## 4. 애플리케이션 부트스트랩

```typescript
import { createElysiaApplication } from "nestelia";

const app = await createElysiaApplication(AppModule);
app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
```

## 5. 테스트

```bash
# 사용자 목록 조회
curl http://localhost:3000/users

# ID로 사용자 조회
curl http://localhost:3000/users/1

# 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane"}'
```

## 전체 예제

```typescript
import { t } from "elysia";
import {
  createElysiaApplication,
  Controller,
  Get,
  Post,
  Module,
  Body,
  Ctx,
  Inject,
  Injectable,
} from "nestelia";

@Injectable()
class UserService {
  private users = [{ id: 1, name: "John" }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find((u) => u.id === id);
  }

  create(user: { name: string }) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser;
  }
}

@Controller("/users")
class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get("/")
  getAll() {
    return this.userService.findAll();
  }

  @Get("/:id")
  getById(@Ctx() ctx: any) {
    return this.userService.findById(Number(ctx.params.id));
  }

  @Post("/")
  create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
    return this.userService.create(body);
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
class AppModule {}

const app = await createElysiaApplication(AppModule);
app.listen(3000);
```

## 다음 단계

- [모듈](/ko/core-concepts/modules) — 모듈로 앱을 구성하는 방법을 알아봅니다.
- [의존성 주입](/ko/features/dependency-injection) — DI 스코프와 커스텀 프로바이더를 이해합니다.
