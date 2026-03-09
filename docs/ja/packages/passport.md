---
title: Passport
icon: key
description: Passport.js ストラテジーによる認証
---

Passport パッケージは、Passport.js の認証ストラテジーを nestelia のガードシステムに統合します。

## インストール

```bash
bun add passport
# 使用するストラテジーもインストール
bun add passport-jwt
bun add passport-local
```

## PassportStrategy

`PassportStrategy` ミックスインを継承してストラテジーを作成します:

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

`validate()` メソッドはストラテジーが認証情報を確認した後に呼ばれます。戻り値は `request.user` としてリクエストに付加されます。

## AuthGuard

特定のストラテジーでルートを保護するには `AuthGuard` を使用します:

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

## Local ストラテジーの例

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

## 複数のストラテジー

`AuthGuard` はストラテジー名の配列を受け付けます。いずれかのストラテジーが成功すればリクエストは認証されます:

```typescript
@UseGuards(AuthGuard(["jwt", "api-key"]))
```

## ストラテジーの登録

モジュールにストラテジープロバイダーを含めます:

```typescript
@Module({
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController, ProfileController],
})
class AuthModule {}
```
