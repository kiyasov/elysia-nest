---
title: Passport
icon: key
description: Authentication with Passport.js strategies
---

The Passport package integrates Passport.js authentication strategies into @kiyasov/elysia-nest's guard system.

## Installation

```bash
bun add passport
# Plus your chosen strategy
bun add passport-jwt
bun add passport-local
```

## PassportStrategy

Create a strategy by extending the `PassportStrategy` mixin:

```typescript
import { Injectable } from "@kiyasov/elysia-nest";
import { PassportStrategy } from "@kiyasov/elysia-nest/passport";
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

The `validate()` method is called after the strategy verifies the credentials. Its return value is attached to the request as `request.user`.

## AuthGuard

Use `AuthGuard` to protect routes with a specific strategy:

```typescript
import { Controller, Get } from "@kiyasov/elysia-nest";
import { AuthGuard } from "@kiyasov/elysia-nest/passport";

@Controller("/profile")
class ProfileController {
  @Get("/")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@Req() req: any) {
    return req.user;
  }
}
```

## Local Strategy Example

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

## Multiple Strategies

`AuthGuard` accepts an array of strategy names. The request is authenticated if any strategy succeeds:

```typescript
@UseGuards(AuthGuard(["jwt", "api-key"]))
```

## Registering Strategies

Include the strategy provider in your module:

```typescript
@Module({
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController, ProfileController],
})
class AuthModule {}
```
