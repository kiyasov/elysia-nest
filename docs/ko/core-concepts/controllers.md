---
title: 컨트롤러
icon: server
description: 데코레이터로 HTTP 라우트 핸들러를 정의합니다
---

컨트롤러는 들어오는 HTTP 요청을 처리하고 응답을 반환합니다. `@Controller()`로 데코레이트하고, HTTP 메서드 데코레이터로 라우트를 정의합니다.

## 컨트롤러 정의

```typescript
import { Controller, Get } from "nestelia";

@Controller("/cats")
class CatController {
  @Get("/")
  findAll() {
    return [{ name: "Tom" }, { name: "Garfield" }];
  }
}
```

`@Controller("/cats")` 데코레이터는 라우트 접두사를 설정합니다. `@Get("/")` 데코레이터는 `GET /cats/`를 `findAll()`에 매핑합니다.

## 컨트롤러 등록

컨트롤러는 반드시 모듈에 선언해야 합니다:

```typescript
@Module({
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}
```

## 서비스 주입

생성자에서 `@Inject()`를 사용해 DI 컨테이너에서 서비스에 접근합니다:

```typescript
@Controller("/cats")
class CatController {
  constructor(@Inject(CatService) private readonly catService: CatService) {}

  @Get("/")
  findAll() {
    return this.catService.findAll();
  }
}
```

## 라우트 메서드

nestelia는 모든 표준 HTTP 메서드에 대한 데코레이터를 제공합니다:

```typescript
@Controller("/items")
class ItemController {
  @Get("/")       findAll() { /* ... */ }
  @Get("/:id")    findOne() { /* ... */ }
  @Post("/")      create()  { /* ... */ }
  @Put("/:id")    update()  { /* ... */ }
  @Patch("/:id")  patch()   { /* ... */ }
  @Delete("/:id") remove()  { /* ... */ }
  @Options("/")   options() { /* ... */ }
  @Head("/")      head()    { /* ... */ }
  @All("/wild")   any()     { /* ... */ }
}
```

## 응답 반환

컨트롤러 메서드는 다음을 반환할 수 있습니다:

- **일반 객체 / 배열** — 자동으로 JSON으로 직렬화
- **문자열** — 일반 텍스트로 반환
- **Promise** — 대기 후 직렬화

```typescript
@Get("/")
async findAll() {
  const users = await this.userService.findAll();
  return users; // JSON으로 직렬화
}
```

## 요청 데이터 접근

`@Ctx()`를 사용해 전체 Elysia 컨텍스트를 가져오고, 모든 요청 데이터에 접근합니다:

```typescript
@Get("/:id")
findOne(@Ctx() ctx: any) {
  const id = ctx.params.id;
  const q = ctx.query.q;
  return this.service.findById(id);
}
```

타입이 지정되고 검증된 body, params, query에 접근하려면 TypeBox 기반 데코레이터를 사용하세요:

```typescript
import { t } from "elysia";

@Post("/")
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

자세한 내용은 [파라미터 데코레이터](/ko/features/parameter-decorators)를 참조하세요.

## 상태 코드 설정

`@HttpCode()`를 사용해 라우트에 커스텀 상태 코드를 설정합니다:

```typescript
@Post("/")
@HttpCode(201)
create(@Body(t.Object({ name: t.String() })) body: { name: string }) {
  return this.userService.create(body);
}
```

또는 동적 상태 코드를 위해 Elysia 컨텍스트를 사용합니다:

```typescript
@Post("/")
create(@Ctx() ctx: any, @Body(t.Object({ name: t.String() })) body: { name: string }) {
  ctx.set.status = 201;
  return this.userService.create(body);
}
```

## 응답 헤더 설정

`@Header()`를 사용해 정적 응답 헤더를 추가합니다:

```typescript
@Get("/")
@Header("Cache-Control", "no-store")
findAll() {
  return this.service.findAll();
}
```
