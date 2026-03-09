---
title: Passport
icon: key
description: 使用 Passport.js 策略进行认证
---

Passport 包将 Passport.js 认证策略集成到 nestelia 的守卫系统中。

## 安装

```bash
bun add passport
# 加上你选择的策略
bun add passport-jwt
bun add passport-local
```

## PassportStrategy

通过继承 `PassportStrategy` 混入创建策略：

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

策略验证凭据后调用 `validate()` 方法。其返回值作为 `request.user` 附加到请求上。

## AuthGuard

使用 `AuthGuard` 以特定策略保护路由：

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

## 本地策略示例

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

## 多种策略

`AuthGuard` 接受策略名称数组。只要有任何一种策略成功，请求就会通过认证：

```typescript
@UseGuards(AuthGuard(["jwt", "api-key"]))
```

## 注册策略

在模块中包含策略提供者：

```typescript
@Module({
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController, ProfileController],
})
class AuthModule {}
```
