---
title: Passport
icon: key
description: Passport.js 전략을 사용한 인증
---

Passport 패키지는 Passport.js 인증 전략을 nestelia의 가드 시스템에 통합합니다.

## 설치

```bash
bun add passport
# 선택한 전략도 추가합니다
bun add passport-jwt
bun add passport-local
```

## PassportStrategy

`PassportStrategy` 믹스인을 확장해 전략을 만듭니다:

```typescript
import { Injectable } from "nestelia";
import { PassportStrategy } from "nestelia/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "my-secret",
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

`validate()` 메서드는 전략이 자격증명을 검증한 후 호출됩니다. 반환값은 `request.user`로 요청에 첨부됩니다.

## AuthGuard

`AuthGuard`를 사용해 특정 전략으로 라우트를 보호합니다:

```typescript
import { Controller, Get } from "nestelia";
import { AuthGuard } from "nestelia/passport";

@Controller("/profile")
class ProfileController {
  @Get("/")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@Req() req: any) {
    return req.user;
  }
}
```

## Local 전략 예제

```typescript
@Injectable()
class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }
}

@Controller("/auth")
class AuthController {
  @Post("/login")
  @UseGuards(AuthGuard("local"))
  login(@Req() req: any) {
    return { token: this.authService.generateToken(req.user) };
  }
}
```

## 여러 전략

`AuthGuard`는 전략 이름 배열을 받습니다. 어느 전략이든 성공하면 요청이 인증됩니다:

```typescript
@UseGuards(AuthGuard(["jwt", "api-key"]))
```

## 전략 등록

모듈에 전략 프로바이더를 포함합니다:

```typescript
@Module({
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController, ProfileController],
})
class AuthModule {}
```
