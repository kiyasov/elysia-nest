---
title: Passport
icon: key
description: Autenticação com estratégias Passport.js
---

O pacote Passport integra as estratégias de autenticação do Passport.js ao sistema de guards do nestelia.

## Instalação

```bash
bun add passport
# Mais a estratégia escolhida
bun add passport-jwt
bun add passport-local
```

## PassportStrategy

Crie uma estratégia estendendo o mixin `PassportStrategy`:

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

O método `validate()` é chamado após a estratégia verificar as credenciais. Seu valor de retorno é anexado à requisição como `request.user`.

## AuthGuard

Use `AuthGuard` para proteger rotas com uma estratégia específica:

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

## Exemplo com Estratégia Local

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

## Múltiplas Estratégias

`AuthGuard` aceita um array de nomes de estratégias. A requisição é autenticada se qualquer estratégia tiver sucesso:

```typescript
@UseGuards(AuthGuard(["jwt", "api-key"]))
```

## Registrando Estratégias

Inclua o provider da estratégia no seu módulo:

```typescript
@Module({
  providers: [JwtStrategy, LocalStrategy, AuthService],
  controllers: [AuthController, ProfileController],
})
class AuthModule {}
```
